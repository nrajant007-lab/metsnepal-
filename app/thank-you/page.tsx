import Link from 'next/link';
import { company } from '@/lib/catalog';
export const metadata = { title: 'Thank you | METS Nepal' };
export default function ThankYou() {
 return <main className="container" style={{ paddingTop: 80, paddingBottom: 80 }}><section className="panel"><span className="eyebrow">CONTACT METS NEPAL</span><h1>Thank you for your inquiry.</h1><p>Your form has been submitted through FormSubmit. Our team will review your message and contact you using the details you provided.</p><p>For urgent assistance, call <a href={'tel:' + company.call}>{company.phone}</a> or email <a href={'mailto:' + company.email + '?subject=Website%20inquiry'}>{company.email}</a>.</p><Link className="btn" href="/products">Continue browsing</Link></section></main>;
}
