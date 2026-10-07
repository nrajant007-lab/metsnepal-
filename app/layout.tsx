import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from '@/components/storefront';
import { Toaster } from '@/components/ui/sonner';
import { CompanyProvider } from '@/components/company-provider';
import { companyFromContent } from '@/lib/company';
import { getContent, getCategories } from '@/lib/db';
import { categories as defaults } from '@/lib/catalog';
export const metadata: Metadata = {
    metadataBase: new URL('https://multi-equipment-nepal.whole-hill-4202.chatgpt.site'),
    title: { default: 'Multi Equipment | Medical Equipment Supply & Service Nepal', template: '%s | Multi Equipment Nepal' },
    description: 'Multi Equipment Trade and Services Pvt. Ltd. Medical equipment supply, sales, technical service and repair support in Chakupat, Lalitpur, Nepal.',
    openGraph: { title: 'Multi Equipment Trade and Services', description: 'Medical Equipment Supply, Sales & Service in Nepal', locale: 'en_NP', type: 'website' },
    icons: {
        icon: "/favicon.svg",
        shortcut: "/favicon.svg",
    },
};
export default async function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    let content: Record<string, string> = {};
    let categories: any[] = defaults;
    try {
        content = await getContent();
        categories = await getCategories();
    }
    catch {
        console.error('Company settings temporarily unavailable');
    }
    return (<html lang="en">
      <body className="antialiased"><CompanyProvider value={companyFromContent(content)}><a href="#main" className="sr-only focus:not-sr-only">Skip to content</a><Header />{content.promotion && <div className="notice" style={{ borderRadius: 0, textAlign: 'center' }}>{content.promotion}</div>}<main id="main">{children}</main><Footer categoryData={categories}/><Toaster /></CompanyProvider></body>
    </html>);
}
