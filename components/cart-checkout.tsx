'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Choice } from './catalog-browser';
import type { CartView } from '@/lib/cart';
import { currency } from '@/lib/catalog';
export function CartSummary({ cart }: {
    cart: CartView;
}) { return <><h2 style={{ fontSize: 24 }}>Request summary</h2><div className="summary-row"><span>Subtotal</span><strong>{cart.needsQuote ? 'To be quoted' : currency(cart.subtotal)}</strong></div>{cart.needsQuote && cart.subtotal > 0 && <div className="summary-row"><span>Priced items</span><span>{currency(cart.subtotal)}</span></div>}<div className="summary-row"><span>Delivery / shipping</span><span>To be confirmed</span></div><div className="summary-row"><span>Discount</span><span>None applied</span></div><div className="summary-row summary-total"><span>Grand total</span><span>{cart.needsQuote ? 'Request Quote' : currency(cart.subtotal) + ' + delivery'}</span></div><p style={{ fontSize: 13, marginTop: 16 }}>Our team will confirm product availability, final prices and delivery before accepting your order.</p></>; }
function useCart() { const [cart, setCart] = useState<CartView | null>(null), [error, setError] = useState(''); const load = async () => { try {
    const r = await fetch('/api/cart');
    const data: any = await r.json();
    if (!r.ok)
        throw new Error(data.error);
    setCart(data);
    setError('');
}
catch (e) {
    setError((e as Error).message || 'Network error. Please try again.');
} }; useEffect(() => { load(); window.addEventListener('cart-updated', load); return () => window.removeEventListener('cart-updated', load); }, []); return { cart, setCart, error, setError, load }; }
export function Cart() { const { cart, setCart, error, setError, load } = useCart(); const [busy, setBusy] = useState(false); const change = async (productId: string, quantity: number) => { setBusy(true); try {
    const r = await fetch('/api/cart', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity }) });
    const d: any = await r.json();
    if (!r.ok)
        throw new Error(d.error);
    setCart(d);
    setError('');
}
catch (e) {
    setError((e as Error).message);
}
finally {
    setBusy(false);
} }; if (!cart)
    return <>{error ? <div className="form-error">{error}<button className="btn outline" onClick={load}>Try again</button></div> : <Skeleton className="h-80 w-full"/>}</>; if (!cart.items.length)
    return <div className="empty-state"><ShoppingBag size={48}/><h2>Your cart is empty</h2><p>Browse equipment or ask our team for a quotation.</p><Link className="btn" href="/products">Browse Products</Link> <Link className="btn outline" href="/request-quote">Request a Quote</Link></div>; return <div className="cart-layout"><div><h2 style={{ fontSize: 25 }}>Your equipment</h2>{error && <p className="form-error" role="alert">{error}</p>}{cart.unavailable.length > 0 && <p className="notice">Some products are no longer available. Contact us for assistance.</p>}{cart.items.map(i => <article className="cart-item" key={i.product.id}><Link href={'/products/' + i.product.slug}><img src={i.product.images[0]} alt={i.product.name} width="100" height="115"/></Link><div className="cart-item-info"><h3><Link href={'/products/' + i.product.slug}>{i.product.name}</Link></h3><p>{i.product.brand}</p><strong>{i.unitPrice === null ? 'Request Price' : currency(i.unitPrice)}</strong><p>Line total: {i.total === null ? 'To be quoted' : currency(i.total)}</p></div><div className="quantity"><button disabled={busy} aria-label={`Decrease ${i.product.name} quantity`} onClick={() => change(i.product.id, Math.max(1, i.quantity - 1))}>−</button><span style={{ padding: '0 12px' }} aria-live="polite">{i.quantity}</span><button disabled={busy} aria-label={`Increase ${i.product.name} quantity`} onClick={() => change(i.product.id, Math.min(100, i.quantity + 1))}>+</button></div><button disabled={busy} className="icon-btn" aria-label={`Remove ${i.product.name}`} onClick={() => change(i.product.id, 0)}><Trash2 size={18}/></button></article>)}<Link className="text-link" style={{ marginTop: 25 }} href="/products">Continue Shopping</Link></div><aside className="panel"><CartSummary cart={cart}/><Link className="btn full-width" href="/checkout">{cart.needsQuote ? 'Request Quote / Checkout' : 'Proceed to Checkout'}</Link></aside></div>; }
export function Checkout({ methods }: {
    methods: string[];
}) { const { cart, error, load } = useCart(); const [busy, setBusy] = useState(false), [formError, setError] = useState(''), [delivery, setDelivery] = useState('Delivery'), [province, setProvince] = useState('Bagmati'), [payment, setPayment] = useState('Arrange with team'), [accepted, setAccepted] = useState(false), [key] = useState(() => crypto.randomUUID()); if (!cart)
    return <>{error ? <p className="form-error">{error} <button onClick={load}>Try again</button></p> : <Skeleton className="h-80"/>}</>; if (!cart.items.length)
    return <div className="empty-state"><h2>Your cart is empty</h2><Link className="btn" href="/products">Browse Products</Link></div>; const submit = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setBusy(true); setError(''); try {
    const data = { ...Object.fromEntries(new FormData(e.currentTarget)), province, delivery, payment, accepted };
    const r = await fetch('/api/submit/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: JSON.stringify(data) });
    const d: any = await r.json();
    if (!r.ok)
        throw new Error(d.error);
    location.href = '/order-confirmation/' + d.id;
}
catch (e) {
    setError((e as Error).message || 'Could not submit your request. Please try again.');
    setBusy(false);
} }; return <div className="cart-layout"><form onSubmit={submit} className="panel"><h2 style={{ fontSize: 26 }}>Customer & delivery details</h2><p style={{ fontSize: 14 }}>No payment is collected online. Our team will contact you to confirm your request. Your details are saved and sent to our team through FormSubmit by email.</p><div className="form-grid">{[['name', 'Full name', 'text', true], ['phone', 'Phone number', 'tel', true], ['whatsapp', 'WhatsApp number', 'tel', false], ['email', 'Email', 'email', false]].map(([name, label, type, required]) => <label key={name as string} className="field">{label}{required ? ' *' : ''}<input name={name as string} type={type as string} required={required as boolean} maxLength={254}/></label>)}<label className="field">Province *<Choice label="Province" value={province} onChange={setProvince} options={['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim']}/></label>{[['district', 'District'], ['municipality', 'Municipality'], ['address', 'Address']].map(([name, label]) => <label className="field" key={name}>{label} *<input name={name} required maxLength={500}/></label>)}<label className="field wide">Delivery instructions<textarea name="instructions" maxLength={1000}/></label><div className="field wide"><span>Fulfilment</span><RadioGroup value={delivery} onValueChange={setDelivery} style={{ display: 'flex', gap: 22 }}>{['Delivery', 'Pickup'].map(v => <label className="filter-option" key={v}><RadioGroupItem value={v}/>{v === 'Pickup' ? 'Pickup from office' : v}</label>)}</RadioGroup></div><div className="field wide"><span>Payment arrangement</span><Choice label="Payment method" value={payment} onChange={setPayment} options={['Arrange with team', ...methods.filter(m => m !== 'Arrange with team')]}/></div><div className="hide-field" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><label className="filter-option" style={{ gridColumn: '1/-1' }}><Checkbox checked={accepted} onCheckedChange={v => setAccepted(!!v)}/><span>I agree to the <Link className="text-link" href="/terms-and-conditions">Terms</Link> and <Link className="text-link" href="/privacy-policy">Privacy Policy</Link>.</span></label>{formError && <p className="form-error field wide" role="alert">{formError}</p>}<button className="btn field wide" disabled={busy || !accepted}>{busy ? 'Submitting…' : cart.needsQuote ? 'Submit Quotation Request' : 'Submit Order Request'}</button></div></form><aside className="panel"><CartSummary cart={cart}/>{cart.items.map(i => <div key={i.product.id} className="summary-row"><span>{i.product.name} × {i.quantity}</span><strong>{i.total === null ? 'Quote' : currency(i.total)}</strong></div>)}</aside></div>; }
