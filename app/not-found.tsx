import Link from 'next/link';
export default function NotFound() { return <div className="container empty-state"><h1>Page or product not found</h1><p>The item may be unavailable. Browse our catalogue or ask our team for assistance.</p><Link className="btn" href="/products">Browse Products</Link> <Link className="btn outline" href="/contact">Contact Us</Link></div>; }
