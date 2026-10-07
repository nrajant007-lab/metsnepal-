import { siteOrigin } from '@/lib/catalog';
export default function robots() { return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/checkout', '/cart', '/account', '/order-confirmation/'] }, sitemap: siteOrigin + '/sitemap.xml' }; }
