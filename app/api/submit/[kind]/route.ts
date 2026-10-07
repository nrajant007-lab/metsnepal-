import { quoteSchema, serviceSchema, inquirySchema, checkoutSchema, reviewSchema } from '@/lib/validation';
import { database, seed, getContent } from '@/lib/db';
import { protectMutation, rateLimit, readJson, errorResponse } from '@/lib/security';
import { sessionId, cartView } from '@/lib/cart';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { emailRecord, emailStatus, sendFormEmail } from '@/lib/form-email';
export const dynamic = 'force-dynamic';
export async function POST(req: Request, { params }: {
    params: Promise<{
        kind: string;
    }>;
}) {
    try {
        await protectMutation(req);
        await seed();
        const { kind } = await params;
        const schemas = { quote: quoteSchema, service: serviceSchema, contact: inquirySchema, checkout: checkoutSchema, review: reviewSchema };
        if (!(kind in schemas))
            return Response.json({ error: 'Form not found' }, { status: 404 });
        await rateLimit(req, kind);
        const raw = await readJson(req);
        const parsed = schemas[kind as keyof typeof schemas].safeParse(raw);
        if (!parsed.success)
            return Response.json({ error: parsed.error.issues[0]?.message || 'Please check the form.' }, { status: 400 });
        const value = parsed.data;
        const key = req.headers.get('Idempotency-Key');
        if (!key || !/^[0-9a-f-]{36}$/.test(key))
            throw new Error('Invalid idempotency key');
        const db = database();
        const prior = await db.prepare('SELECT record_id FROM submissions WHERE key=? AND kind=?').bind(key, kind).first<{
            record_id: string;
        }>();
        if (prior)
            return Response.json({ id: prior.record_id, ok: true, emailStatus: await emailStatus(prior.record_id) });
        const id = crypto.randomUUID(), now = new Date().toISOString();
        let statements: D1PreparedStatement[] = [];
        let emailData: unknown = value;
        if (kind === 'checkout') {
            const cartId = await sessionId();
            if (!cartId)
                throw new Error('Cart is empty');
            const cart = await cartView(cartId);
            if (!cart.items.length || cart.unavailable.length)
                throw new Error('Cart contains unavailable products. Please review your cart.');
            for (const i of cart.items) {
                if (i.product.availability === 'Out of stock' || i.product.stock !== null && i.quantity > i.product.stock)
                    throw new Error('Requested quantity exceeds current stock');
            }
            const content = await getContent();
            const methods = (content.paymentMethods || '').split('\n').map(s => s.trim()).filter(Boolean);
            const checkout = value as typeof checkoutSchema._output;
            if (checkout.payment !== 'Arrange with team' && !methods.includes(checkout.payment))
                throw new Error('Payment method is unavailable');
            const user = await getChatGPTUser();
            const customerId = crypto.randomUUID();
            const number = 'MET-' + now.slice(0, 10).replaceAll('-', '') + '-' + id.slice(0, 8).toUpperCase();
            const data = { ...checkout, number, items: cart.items.map(i => ({ productId: i.product.id, name: i.product.name, image: i.product.images[0], quantity: i.quantity, unitPrice: i.unitPrice, total: i.total })), subtotal: cart.subtotal, total: cart.needsQuote ? null : cart.subtotal, needsQuote: cart.needsQuote, shipping: null, discount: 0, paymentStatus: 'Awaiting arrangement', deliveryStatus: 'Not scheduled' };
            emailData = data;
            if (user)
                statements.push(db.prepare('INSERT OR IGNORE INTO users (id,email,role) VALUES (?,?,?)').bind(user.userId, user.email, 'customer'));
            statements.push(db.prepare('INSERT INTO customers (id,user_id,name,phone,email,created_at) VALUES (?,?,?,?,?,?)').bind(customerId, user?.userId ?? null, checkout.name, checkout.phone, checkout.email, now), db.prepare('INSERT INTO addresses (id,customer_id,data) VALUES (?,?,?)').bind(crypto.randomUUID(), customerId, JSON.stringify({ province: checkout.province, district: checkout.district, municipality: checkout.municipality, address: checkout.address })), db.prepare('INSERT INTO orders (id,number,customer_id,session_id,user_id,data,status,created_at) VALUES (?,?,?,?,?,?,?,?)').bind(id, number, customerId, cartId, user?.userId ?? null, JSON.stringify(data), 'Pending', now));
            for (const i of cart.items)
                statements.push(db.prepare('INSERT INTO order_items (id,order_id,product_id,name,quantity,unit_price) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(), id, i.product.id, i.product.name, i.quantity, i.unitPrice));
            statements.push(db.prepare('UPDATE carts SET data=?,updated_at=? WHERE id=?').bind('[]', now, cartId));
        }
        else if (kind === 'review') {
            const v = value as typeof reviewSchema._output;
            const product = await db.prepare('SELECT published FROM products WHERE id=?').bind(v.productId).first<{
                published: number;
            }>();
            if (!product?.published)
                throw new Error('Product not found');
            statements.push(db.prepare('INSERT INTO reviews (id,product_id,name,rating,review,approved,created_at) VALUES (?,?,?,?,?,0,?)').bind(id, v.productId, v.name, v.rating, v.review, now));
        }
        else {
            const table = { quote: 'quotations', service: 'service_requests', contact: 'contact_inquiries' }[kind as 'quote' | 'service' | 'contact'];
            statements.push(db.prepare(`INSERT INTO ${table} (id,data,status,created_at) VALUES (?,?,?,?)`).bind(id, JSON.stringify(value), 'Pending', now));
        }
        statements.push(db.prepare('INSERT INTO submissions (key,kind,record_id) VALUES (?,?,?)').bind(key, kind, id));
        statements.push(emailRecord(id, kind, emailData, new URL(req.url).origin));
        try {
            await db.batch(statements);
        }
        catch (e) {
            const duplicate = await db.prepare('SELECT record_id FROM submissions WHERE key=? AND kind=?').bind(key, kind).first<{
                record_id: string;
            }>();
            if (duplicate)
                return Response.json({ id: duplicate.record_id, ok: true, emailStatus: await emailStatus(duplicate.record_id) });
            throw e;
        }
        const notificationStatus = await sendFormEmail(id);
        return Response.json({ ok: true, id, emailStatus: notificationStatus }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
    }
    catch (e) {
        return errorResponse(e);
    }
}
