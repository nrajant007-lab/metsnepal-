'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { useContact } from './company-provider';
type Field = {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    wide?: boolean;
};
const shared: Field[] = [{ name: 'name', label: 'Full name', required: true }, { name: 'phone', label: 'Phone number', type: 'tel', required: true }, { name: 'email', label: 'Email', type: 'email' }];
const fields: Record<string, Field[]> = { quote: [shared[0], { name: 'organization', label: 'Company / Hospital / Organization' }, shared[1], shared[2], { name: 'product', label: 'Product', required: true }, { name: 'quantity', label: 'Quantity', type: 'number', required: true }, { name: 'message', label: 'Message', type: 'textarea', wide: true }], service: [...shared, { name: 'equipment', label: 'Equipment name', required: true }, { name: 'brand', label: 'Brand' }, { name: 'model', label: 'Model' }, { name: 'serial', label: 'Serial number' }, { name: 'date', label: 'Preferred service date', type: 'date' }, { name: 'problem', label: 'Problem description', type: 'textarea', required: true, wide: true }, { name: 'address', label: 'Address', required: true, wide: true }], contact: [...shared, { name: 'subject', label: 'Product / Service / Subject', required: true }, { name: 'message', label: 'How can we help?', type: 'textarea', required: true, wide: true }], review: [{ name: 'name', label: 'Name', required: true }, { name: 'rating', label: 'Rating (1–5)', type: 'number', required: true }, { name: 'review', label: 'Review', type: 'textarea', required: true, wide: true }] };
export default function RequestForm({ kind, product = '', productId = '', onDone }: {
    kind: 'quote' | 'service' | 'contact' | 'review';
    product?: string;
    productId?: string;
    onDone?: () => void;
}) {
    const [busy, setBusy] = useState(false), [error, setError] = useState(''), [done, setDone] = useState(false), [notification, setNotification] = useState(''), [key] = useState(() => crypto.randomUUID());
    const submit = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setBusy(true); setError(''); const form = e.currentTarget; const values: any = Object.fromEntries(new FormData(form)); if (kind === 'review')
        values.productId = productId; try {
        const response = await fetch('/api/submit/' + kind, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: JSON.stringify(values) });
        const data: any = await response.json();
        if (!response.ok)
            throw new Error(data.error || 'Please try again.');
        setDone(true);
        if (data.emailStatus && data.emailStatus !== 'accepted') setNotification('Your request has been saved. Email notification is pending; for urgent assistance, please call us or contact us on WhatsApp.');
        onDone?.();
    }
    catch (e) {
        setError((e as Error).message || 'Network error. Please try again.');
    }
    finally {
        setBusy(false);
    } };
    if (done)
        return <div className="form-success" role="status"><CheckCircle2 size={32}/><h2 style={{ fontSize: 25, marginTop: 16 }}>Thank you.</h2><p>{kind === 'review' ? 'Your review has been submitted for approval.' : 'Our team will contact you shortly.'}</p>{notification && <p>{notification}</p>}<Link className="btn outline" href="/products">Continue browsing</Link></div>;
    return <form onSubmit={submit} className="form-grid">{fields[kind].map(f => <label key={f.name} className={'field ' + (f.wide ? 'wide' : '')}>{f.label}{f.required ? ' *' : ''}{f.type === 'textarea' ? <textarea name={f.name} required={f.required} maxLength={3000}/> : <input name={f.name} type={f.type || 'text'} required={f.required} defaultValue={f.name === 'product' ? product : f.name === 'quantity' ? '1' : undefined} min={f.type === 'number' ? 1 : f.type === 'date' ? new Date().toISOString().slice(0, 10) : undefined} max={f.name === 'rating' ? 5 : f.name === 'quantity' ? 100 : undefined} maxLength={f.type === 'number' ? undefined : 254} autoComplete={f.name === 'name' ? 'name' : f.name === 'phone' ? 'tel' : f.name === 'email' ? 'email' : undefined}/>}</label>)}<div className="hide-field" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><div className="field wide"><p style={{ fontSize: 12, marginBottom: 4 }}>Submissions are saved by our company and sent through FormSubmit to our team by email. Please avoid sharing patient records or sensitive medical information. See our <Link className="text-link" href="/privacy-policy">Privacy Policy</Link>.</p>{error && <p className="form-error" role="alert">{error}</p>}<button className="btn" disabled={busy} style={{ justifySelf: 'start' }}>{busy ? 'Submitting…' : { quote: 'Request a Quote', service: 'Request Service', contact: 'Send Inquiry', review: 'Submit Review' }[kind]}</button></div></form>;
}
export function ContactAside({ hours }: {
    hours?: string;
}) { const { company, wa } = useContact(); return <aside className="panel"><span className="eyebrow">LET’S TALK</span><h2 style={{ fontSize: 24 }}>We’re here to help.</h2><p>For product guidance, current prices or service support, reach our team directly.</p><a href={`tel:${company.call}`}><Phone size={18}/> {company.phone}</a><a href={wa()}><MessageCircle size={18}/> +{company.whatsapp}</a><a href={`mailto:${company.email}`}>{company.email}</a><p style={{ fontSize: 14, marginTop: 24 }}>{company.name}<br />{company.address}<br />G.P.O. Box: {company.gpoBox} · EPC: {company.epc}</p><h3>Business hours</h3><p style={{ fontSize: 14 }}>{hours || 'Please contact us to confirm office hours before visiting.'}</p></aside>; }
