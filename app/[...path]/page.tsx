import OfficeMap, { OfficeLocation } from '@/components/office-map';
import AboutPage from '@/components/about-page';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Phone, MapPin, MessageCircle, Wrench, CheckCircle2 } from 'lucide-react';
import { getProducts, getContent, getBrands, getCategories, database, previewCatalog, bundledCatalogOnly } from '@/lib/db';
import { PageIntro } from '@/components/storefront';
import CatalogBrowser from '@/components/catalog-browser';
import RequestForm, { ContactAside } from '@/components/request-form';
import ProductDetail from '@/components/product-detail';
import { Cart, Checkout } from '@/components/cart-checkout';
import { company, wa, services, legalPages, legalDefaults, siteOrigin, currency } from '@/lib/catalog';
import { sessionId } from '@/lib/cart';
import { companyFromContent } from '@/lib/company';
import { getChatGPTUser, requireChatGPTUser } from '@/app/chatgpt-auth';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: {
    params: Promise<{
        path: string[];
    }>;
}) { const { path } = await params; const slug = path.join('/'); const titles: Record<string, string> = { products: 'Medical Equipment in Nepal', categories: 'Equipment Categories', brands: 'Product Brands', services: 'Medical Equipment Service & Repair Nepal', 'service-request': 'Request Equipment Service', 'request-quote': 'Request a Quotation', about: 'About Us', contact: 'Contact Multi Equipment Lalitpur', cart: 'Shopping Cart', checkout: 'Checkout', account: 'Your Account', ...Object.fromEntries(legalPages) }; let title = titles[slug] || path.at(-1)?.replaceAll('-', ' ') || 'Medical Equipment'; let description = 'Medical equipment supply, sales and service support in Chakupat, Lalitpur, Nepal.'; if (path[0] === 'products' && path.length > 1) {
    const p = (await getProducts()).find(p => p.slug === path.at(-1));
    if (p) {
        title = p.seoTitle || p.name;
        description = p.seoDescription || p.shortDescription;
    }
} return { title, description, alternates: { canonical: siteOrigin + '/' + slug }, openGraph: { title, description, url: siteOrigin + '/' + slug }, robots: ['cart', 'checkout', 'account', 'order-confirmation'].includes(path[0]) || await previewCatalog() ? { index: false, follow: false } : undefined }; }
export default async function Page({ params, searchParams }: {
    params: Promise<{
        path: string[];
    }>;
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const { path } = await params;
    const slug = path.join('/');
    const content = await getContent();
    const contact = companyFromContent(content);
    if (slug === 'accessories') {
        const products = (await getProducts()).filter(p => p.tags.includes('accessories'));
        return <><PageIntro title="Accessories">Oxygen therapy and sleep therapy accessories. Contact us to confirm fit, compatibility, price and availability.</PageIntro><div className="container content-section"><CatalogBrowser products={products} categories={await getCategories()}/></div></>;
    }
    const contactWa = (m = "Hello Multi Equipment Trade and Services, I would like to make an inquiry.") => "https://wa.me/" + contact.whatsapp + "?text=" + encodeURIComponent(m);
    if (path[0] === 'products' && path.length > 1) {
        const products = await getProducts();
        const p = products.find(p => p.slug === path.at(-1));
        if (p) {
            const reviews = bundledCatalogOnly() ? {results: []} : await database().prepare('SELECT * FROM reviews WHERE product_id=? AND approved=1').bind(p.id).all();
            const structured = { '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.shortDescription, image: p.images.map(i => i.startsWith('/') ? siteOrigin + i : i), ...(p.sku ? { sku: p.sku } : {}), brand: { '@type': 'Brand', name: p.brand }, ...(p.price !== null ? { offers: { '@type': 'Offer', price: p.salePrice ?? p.price, priceCurrency: 'NPR', url: siteOrigin + '/products/' + p.slug, ...p.availability === 'In stock' ? { availability: 'https://schema.org/InStock' } : p.availability === 'Out of stock' ? { availability: 'https://schema.org/OutOfStock' } : {} } } : {}) };
            return <><PageIntro title={p.name}/><div className="container content-section"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([structured,{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:siteOrigin},{'@type':'ListItem',position:2,name:'Products',item:siteOrigin+'/products'},{'@type':'ListItem',position:3,name:p.name,item:siteOrigin+'/products/'+p.slug}]}]).replace(/</g, '\\u003c') }}/><ProductDetail product={p} related={products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4)} reviews={reviews.results}/></div></>;
        }
        const cats = await getCategories();
        const alias = path[1] === 'oxygen-concentrators' ? 'oxygen-respiratory-care' : path[1];
        const c = cats.find(c => c.slug === alias);
        if (c && path.length === 2)
            return <><PageIntro title={c.name}/><div className="container content-section"><CatalogBrowser products={products} categories={cats} initialCategory={c.slug}/></div></>;
        notFound();
    }
    if (slug === 'products' || path[0] === 'categories' && path.length === 2 || path[0] === 'brands' && path.length === 2) {
        const cats = await getCategories();
        const brands = await getBrands(); const privatePreview = await previewCatalog();
        const category = path[0] === 'categories' ? cats.find(c => c.slug === path[1]) : null;
        const brand = path[0] === 'brands' ? brands.find(b => b.slug === path[1] && (b.published||privatePreview)) : null;
        if (path.length === 2 && !category && !brand)
            notFound();
        return <><PageIntro eyebrow="MEDICAL EQUIPMENT" title={category?.name || brand?.name || 'Find the equipment you need'}>Explore products, compare options and contact our team for current prices and availability.</PageIntro><div className="container content-section"><CatalogBrowser products={await getProducts()} categories={cats} initialCategory={category?.slug} initialBrand={brand?.name}/></div></>;
    }
    if (slug === 'categories')
        return <><PageIntro title="Product categories">Browse by the kind of care you need to support.</PageIntro><div className="container content-section"><div className="category-grid">{(await getCategories()).map(c => <article className="category-card" key={c.slug}><div className="category-image"><img src={c.image || '/images/hero.webp'} alt={c.name} width="300" height="200" loading="lazy"/></div><div><h2 style={{ fontSize: 21 }}>{c.name}</h2><p>{c.description}</p><ul style={{ fontSize: 13, color: '#64798b', paddingLeft: 17 }}>{c.children?.map((s: string) => <li key={s}>{s}</li>)}</ul><Link className="btn outline" href={'/categories/' + c.slug}>View Products</Link></div></article>)}</div></div></>;
    if (slug === 'brands') {
        const privatePreview = await previewCatalog(); const brands = (await getBrands()).filter(b => b.published||privatePreview);
        return <><PageIntro title="Brands">Explore the brands in our verified product catalogue.</PageIntro><div className="container content-section">{brands.length ? <div className="brand-grid">{brands.map(b => <article className="panel" key={b.slug}>{b.logo ? <img src={b.logo} alt={b.name} width="160" height="70"/> : <div className="brand-name">{b.name}</div>}<p>{b.description}</p>{!b.published&&<p className="notice">Private preview · Supply verification pending.</p>}<Link className="btn outline" href={'/brands/' + b.slug}>View Products</Link></article>)}</div> : <div className="empty-state"><h2>Brand information is being verified</h2><p>Contact us to discuss equipment brands and current supply options.</p><Link className="btn" href="/contact">Contact Us</Link></div>}</div></>;
    }
    if (slug === 'request-quote' || slug === 'service-request') {
        const quote = slug === 'request-quote';
        const query = await searchParams;
        return <><PageIntro eyebrow={quote ? 'PRODUCT & PROCUREMENT SUPPORT' : 'TECHNICAL SUPPORT'} title={quote ? 'Request a Quote' : 'Request Equipment Service'}>{quote ? 'Tell us what you need. Our team will confirm pricing and availability.' : 'Share your equipment details so our team can discuss inspection, maintenance or repair.'}</PageIntro><div className="container content-section form-layout"><div className="panel"><RequestForm kind={quote ? 'quote' : 'service'} product={query.product || ''}/></div><ContactAside hours={content.hours}/></div></>;
    }
    if (slug === 'services')
        return <><PageIntro eyebrow="CARE FOR YOUR EQUIPMENT" title="Medical Equipment Service & Repair">Technical support, maintenance and repair assistance in Nepal.</PageIntro><div className="container content-section"><div className="service-grid">{services.map(s => <article className="panel" key={s}><Wrench size={26}/><h3>{s}</h3><p>Contact our team to discuss your equipment and service requirements.</p></article>)}</div><div className="notice" style={{ margin: '30px 0' }}>Service scope, parts compatibility, estimated costs and scheduling are confirmed after reviewing your equipment. No manufacturer authorization is implied.</div><Link className="btn" href="/service-request">Request Service</Link></div></>;
    if (slug === 'about') return <AboutPage content={content}/>;
    if (slug === 'contact')
        return <><PageIntro title="Contact our team">Product questions, quotations or technical support—we’re here to help.</PageIntro><div className="container content-section"><div className="contact-cards"><article className="panel"><MapPin /><h3>Visit us</h3><p>{content.address || contact.address}<br />G.P.O. Box: {contact.gpoBox} · EPC: {contact.epc}</p><OfficeLocation location={content.mapLocation || undefined} query={content.mapQuery || undefined}/></article><article className="panel"><Phone /><h3>Call us</h3><a className="text-link" href={`tel:${contact.call}`}>{content.phone || contact.phone}</a><p style={{ marginTop: 12 }}>Product guidance and service inquiries.</p></article><article className="panel"><MessageCircle /><h3>Chat on WhatsApp</h3><a className="text-link" href={contactWa()}>+{contact.whatsapp}</a><p style={{ marginTop: 12 }}>An easy way to contact us from your phone.</p></article></div><div className="form-layout"><div className="panel"><h2 style={{ fontSize: 26 }}>Send an inquiry</h2><RequestForm kind="contact"/></div><ContactAside hours={content.hours}/></div><OfficeMap name={contact.name} location={content.mapLocation || undefined} query={content.mapQuery || undefined}/></div></>;
    if (slug === 'cart')
        return <><PageIntro title="Your Cart">Review your selected equipment.</PageIntro><div className="container content-section"><Cart /></div></>;
    if (slug === 'checkout')
        return <><PageIntro title="Checkout">Submit your details. Our team will confirm the order or quotation.</PageIntro><div className="container content-section"><Checkout methods={(content.paymentMethods || '').split('\n').map(s => s.trim()).filter(Boolean)}/></div></>;
    if (path[0] === 'order-confirmation' && path.length === 2) {
        const id = path[1];
        const session = await sessionId();
        const user = await getChatGPTUser();
        const row = await database().prepare('SELECT * FROM orders WHERE id=? AND (session_id=? OR user_id=?)').bind(id, session || '', user?.userId || '').first<any>();
        if (!row)
            notFound();
        const d = JSON.parse(row.data);
        return <><PageIntro title="Thank You for Your Order"/><div className="container content-section"><div className="panel content-prose"><CheckCircle2 size={42} color="#247d59"/><h2 style={{ marginTop: 20 }}>Your request has been received.</h2><p>Our team will contact you to confirm availability, prices and delivery. No payment has been collected.</p><h3>{row.number}</h3><p>{d.name} · {d.phone}</p>{d.items.map((i: any) => <div className="summary-row" key={i.productId}><span>{i.name} × {i.quantity}</span><strong>{i.total === null ? 'To be quoted' : currency(i.total)}</strong></div>)}<div className="summary-row summary-total"><span>Total</span><span>{d.total === null ? 'To be quoted' : currency(d.total) + ' + delivery'}</span></div><h3 style={{ marginTop: 24 }}>Delivery information</h3><p>{d.delivery === 'Pickup' ? 'Pickup from office: ' + contact.address : [d.address, d.municipality, d.district, d.province, 'Nepal'].join(', ')}<br />{d.instructions}</p><p>Company contact: {contact.phone} · WhatsApp +{contact.whatsapp}</p><div className="hero-buttons"><Link className="btn" href="/products">Continue Shopping</Link><Link className="btn outline" href="/contact">Contact Us</Link><a className="btn whatsapp" href={contactWa('Hello, I have a question about order ' + row.number)}>Chat on WhatsApp</a></div></div></div></>;
    }
    if (slug === 'account') {
        return <Account />;
    }
    const legal = legalPages.find(([url]) => url === slug);
    if (legal)
        return <><PageIntro title={legal[1]}/><div className="container content-section content-prose"><div className="notice">Please contact the company for product-specific terms before purchase.</div><p className="legal-prose" style={{ marginTop: 25 }}>{content[slug] || legalDefaults[slug]}</p><Link className="btn outline" href="/contact">Contact Us</Link></div></>;
    notFound();
}
async function Account() { const user = await requireChatGPTUser('/account'); const rows = await database().prepare('SELECT number,status,data,id,created_at FROM orders WHERE user_id=? ORDER BY created_at DESC').bind(user.userId).all<any>(); return <><PageIntro title="Your Account">Signed in as {user.email}</PageIntro><div className="container content-section"><h2>Your order requests</h2>{rows.results.length ? rows.results.map(r => <div className="panel" style={{ marginBottom: 15 }} key={r.id}><h3>{r.number}</h3><p>{r.status} · {r.created_at.slice(0, 10)}</p><Link className="text-link" href={'/order-confirmation/' + r.id}>View details</Link></div>) : <p>You have no submitted order requests.</p>}<a className="text-link" href="/signout-with-chatgpt?return_to=%2F" target="_top">Sign out</a></div></>; }
