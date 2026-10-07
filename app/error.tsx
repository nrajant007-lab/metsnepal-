'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: {
    reset: () => void;
}) { return <div className="container empty-state"><h1>We couldn’t load this page.</h1><p>Please try again, or contact our team for assistance.</p><button className="btn" onClick={reset}>Try Again</button> <Link className="btn outline" href="/contact">Contact Us</Link></div>; }
