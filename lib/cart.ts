import { cookies } from 'next/headers';
import { database, getProducts } from './db';
import { priceOf, Product } from './catalog';
export type CartItem = {
    productId: string;
    quantity: number;
};
export type CartView = {
    items: {
        product: Product;
        quantity: number;
        unitPrice: number | null;
        total: number | null;
    }[];
    subtotal: number;
    needsQuote: boolean;
    unavailable: string[];
};
export async function sessionId(create = false) { const jar = await cookies(); let id = jar.get('met_cart')?.value; if (id && !/^[0-9a-f-]{36}$/.test(id))
    id = undefined; if (!id && create) {
    id = crypto.randomUUID();
    jar.set('met_cart', id, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
} return id; }
export async function rawCart(id: string): Promise<CartItem[]> { const row = await database().prepare('SELECT data FROM carts WHERE id=?').bind(id).first<{
    data: string;
}>(); return row ? JSON.parse(row.data) : []; }
export async function cartView(id?: string): Promise<CartView> { if (!id)
    return { items: [], subtotal: 0, needsQuote: false, unavailable: [] }; const saved = await rawCart(id); const products = await getProducts(); const items = saved.flatMap(i => { const p = products.find(p => p.id === i.productId); return p ? [{ product: p, quantity: i.quantity, unitPrice: priceOf(p), total: priceOf(p) === null ? null : priceOf(p)! * i.quantity }] : []; }); return { items, subtotal: items.reduce((n, i) => n + (i.total ?? 0), 0), needsQuote: items.some(i => i.unitPrice === null), unavailable: saved.filter(i => !products.some(p => p.id === i.productId)).map(i => i.productId) }; }
export async function saveCart(id: string, items: CartItem[]) { await database().prepare('INSERT INTO carts (id,data,updated_at) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at').bind(id, JSON.stringify(items), new Date().toISOString()).run(); }
