import { database, seed, getProducts, getBrands, getCategories, getContent } from '@/lib/db';
import { isAdmin, protectMutation, rateLimit, readJson, errorResponse } from '@/lib/security';
import { productSchema } from '@/lib/validation';
import { z } from 'zod';
import { sendFormEmail } from '@/lib/form-email';
export const dynamic = 'force-dynamic';
const tables = { orders: 'orders', quotations: 'quotations', services: 'service_requests', inquiries: 'contact_inquiries', customers: 'customers', reviews: 'reviews' } as const;
export async function GET() { try {
    if (!await isAdmin())
        throw new Error('Access denied. Administrator sign-in is required.');
    await seed();
    const result: Record<string, unknown> = { products: await getProducts(true), brands: await getBrands(), categories: await getCategories(), content: await getContent() };
    for (const [key, table] of Object.entries(tables)) {
        const rows = await database().prepare(`SELECT * FROM ${table} ORDER BY created_at DESC LIMIT 500`).all();
        result[key] = rows.results.map((r: any) => ({ ...r, ...r.data ? { data: JSON.parse(r.data) } : {} }));
    }
    const notifications = await database().prepare('SELECT record_id,status FROM email_notifications').all<{ record_id: string; status: string }>();
    const emailStatuses = new Map(notifications.results.map(r => [r.record_id, r.status]));
    for (const key of Object.keys(tables)) (result[key] as { id: string; emailStatus?: string }[]).forEach(row => { row.emailStatus = emailStatuses.get(row.id); });
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
}
catch (e) {
    return errorResponse(e);
} }
export async function POST(req: Request) {
    try {
        await protectMutation(req);
        if (!await isAdmin())
            throw new Error('Access denied. Administrator sign-in is required.');
        await seed();
        const body = await readJson(req);
        const db = database();
        if (body.action === 'retry-email') {
            const id = z.string().uuid().parse(body.id);
            await rateLimit(req, 'email-retry');
            const status = await sendFormEmail(id);
            if (status !== 'accepted') return Response.json({ error: status === 'activation_required' ? 'Activate FormSubmit using the email sent to your inbox, then retry.' : 'Email could not be sent. The request is still saved; please try again later.' }, { status: 503 });
        }
        else if (body.action === 'product') {
            const p = productSchema.safeParse(body.value);
            if (!p.success)
                return Response.json({ error: p.error.issues[0]?.message }, { status: 400 });
            const v = p.data;
            const statements = [db.prepare('INSERT INTO products (id,slug,data,published) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,data=excluded.data,published=excluded.published').bind(v.id, v.slug, JSON.stringify(v), v.published ? 1 : 0), db.prepare('DELETE FROM product_images WHERE product_id=?').bind(v.id), db.prepare('DELETE FROM product_specifications WHERE product_id=?').bind(v.id)];
            v.images.forEach((url, i) => statements.push(db.prepare('INSERT INTO product_images (id,product_id,url,alt,position) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(), v.id, url, v.name, i)));
            v.specifications.forEach(s => statements.push(db.prepare('INSERT INTO product_specifications (id,product_id,name,value) VALUES (?,?,?,?)').bind(crypto.randomUUID(), v.id, s.name, s.value)));
            await db.batch(statements);
        }
        else if (body.action === 'delete-product') {
            const id = z.string().max(100).parse(body.id);
            await db.batch([db.prepare('DELETE FROM reviews WHERE product_id=?').bind(id), db.prepare('DELETE FROM products WHERE id=?').bind(id)]);
        }
        else if (body.action === 'content') {
            const v = z.record(z.string().max(200), z.string().max(15000)).parse(body.value);
            if (Object.keys(v).some(k => k.startsWith('_')))
                throw new Error('Invalid request content key');
            if (v.whatsapp && !/^\d{8,16}$/.test(v.whatsapp))
                throw new Error('Invalid request WhatsApp number');
            if (v.call && !/^\+?\d{7,16}$/.test(v.call))
                throw new Error('Invalid request phone link');
            if (v.heroImage && !v.heroImage.startsWith('/images/') && !v.heroImage.startsWith('https://'))
                throw new Error('Invalid request image URL');
            await db.batch(Object.entries(v).map(([k, val]) => db.prepare('INSERT INTO content (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(k, val)));
        }
        else if (body.action === 'taxonomy') {
            const v = z.object({ kind: z.enum(['brands', 'categories']), id: z.string().regex(/^[a-z0-9-]+$/).max(100), slug: z.string().regex(/^[a-z0-9-]+$/).max(100), data: z.object({ name: z.string().min(2).max(100), description: z.string().max(1000), image: z.string().max(2000).optional(), logo: z.string().max(2000).optional(), children: z.array(z.string().max(100)).optional(), published: z.boolean().optional(), verified: z.boolean().optional() }) }).parse(body.value);
            for (const url of [v.data.image, v.data.logo])
                if (url && !url.startsWith('/images/') && !url.startsWith('https://'))
                    throw new Error('Invalid request image URL');
            if (v.kind === 'brands' && v.data.published && !v.data.verified)
                return Response.json({ error: 'Confirm legitimate supply before publishing a brand.' }, { status: 400 });
            await db.prepare(`INSERT INTO ${v.kind} (id,slug,data) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,data=excluded.data`).bind(v.id, v.slug, JSON.stringify(v.data)).run();
        }
        else if (body.action === 'delete-taxonomy') {
            const v = z.object({ kind: z.enum(['brands', 'categories']), id: z.string().max(100) }).parse(body);
            await db.prepare(`DELETE FROM ${v.kind} WHERE id=?`).bind(v.id).run();
        }
        else if (body.action === 'status') {
            const v = z.object({ kind: z.enum(['orders', 'quotations', 'services', 'inquiries']), id: z.string().max(100), status: z.string().max(50), notes: z.string().max(5000).optional(), paymentStatus: z.string().max(100).optional(), deliveryStatus: z.string().max(100).optional() }).parse(body);
            const statuses = v.kind === 'orders' ? ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] : ['Pending', 'Contacted', 'In progress', 'Completed', 'Cancelled'];
            if (!statuses.includes(v.status))
                throw new Error('Invalid request status');
            const table = tables[v.kind];
            if (v.kind === 'services')
                await db.prepare('UPDATE service_requests SET status=?,notes=? WHERE id=?').bind(v.status, v.notes || '', v.id).run();
            else if (v.kind === 'orders') {
                const row = await db.prepare('SELECT data FROM orders WHERE id=?').bind(v.id).first<{
                    data: string;
                }>();
                if (!row)
                    throw new Error('Order not found');
                await db.prepare('UPDATE orders SET status=?,data=? WHERE id=?').bind(v.status, JSON.stringify({ ...JSON.parse(row.data), paymentStatus: v.paymentStatus, deliveryStatus: v.deliveryStatus }), v.id).run();
            }
            else
                await db.prepare(`UPDATE ${table} SET status=? WHERE id=?`).bind(v.status, v.id).run();
        }
        else if (body.action === 'review') {
            const v = z.object({ id: z.string().max(100), approved: z.boolean() }).parse(body);
            await db.prepare('UPDATE reviews SET approved=? WHERE id=?').bind(v.approved ? 1 : 0, v.id).run();
        }
        else
            return Response.json({ error: 'Unknown admin action' }, { status: 400 });
        return Response.json({ ok: true });
    }
    catch (e) {
        return errorResponse(e);
    }
}
