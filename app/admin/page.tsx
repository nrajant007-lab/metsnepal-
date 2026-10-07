import { isAdmin } from '@/lib/security';
import { getChatGPTUser, chatGPTSignInPath } from '@/app/chatgpt-auth';
import { PageIntro } from '@/components/storefront';
import AdminDashboard from '@/components/admin-dashboard';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin Dashboard', robots: { index: false, follow: false } };
export default async function Admin() { const user = await getChatGPTUser(); if (!await isAdmin())
    return <><PageIntro title="Administrator access"/><div className="container content-section"><div className="panel"><h2 style={{ fontSize: 26 }}>Sign in to manage your website.</h2><p>{user ? 'Your email is not on the administrator allowlist. The site owner must configure ADMIN_EMAILS to grant access.' : 'Administrator access is restricted to approved accounts.'}</p>{!user && <a className="btn" href={chatGPTSignInPath('/admin')} target="_top">Sign in with ChatGPT</a>}<p style={{ fontSize: 13 }}>Admin routes and data are protected on the server.</p></div></div></>; return <><PageIntro eyebrow="WEBSITE MANAGEMENT" title="Admin Dashboard">Signed in as {user?.email}</PageIntro><div className="container content-section"><AdminDashboard /></div></>; }
