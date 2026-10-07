import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { database } from './db';
export async function isAdmin() { const user = await getChatGPTUser(); const allow = ((env as unknown as Record<string, string>).ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean); return !!user && allow.includes(user.email.toLowerCase()); }
export async function protectMutation(req: Request) { const origin = req.headers.get('origin'); if (!origin || origin !== new URL(req.url).origin)
    throw new Error('Invalid request origin'); if (!(req.headers.get('content-type') || '').includes('application/json'))
    throw new Error('JSON required'); const length = Number(req.headers.get('content-length') || 0); if (length > 50000)
    throw new Error('Request too large'); }
export async function rateLimit(req: Request, scope: string) { const ip = req.headers.get('cf-connecting-ip') || req.headers.get('oai-authenticated-user-id') || 'local'; const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip)); const hash = Array.from(new Uint8Array(digest)).map(n => n.toString(16).padStart(2, '0')).join(''); const bucket = Math.floor(Date.now() / 600000); const key = `${scope}:${hash}:${bucket}`; const row = await database().prepare('INSERT INTO rate_limits (key,count,window) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key, bucket).first<{
    count: number;
}>(); if (row && row.count > (scope === 'cart' ? 100 : 10))
    throw new Error('Too many requests. Please try again in 10 minutes.'); if (Math.random() < .02)
    await database().prepare('DELETE FROM rate_limits WHERE window < ?').bind(bucket - 6).run(); }
export async function readJson(req: Request) { const text = await req.text(); if (text.length > 50000)
    throw new Error('Request too large'); return JSON.parse(text); }
export function errorResponse(e: unknown) { console.error('Request failed', e instanceof Error ? e.message : 'unknown'); const message = e instanceof Error ? e.message : ''; const safe = /Too many|Invalid request|JSON required|Request too large|Cart|Product|quantity|stock|Payment|idempotency|not found|Sign in|Access denied|unpublished/i.test(message); return Response.json({ error: safe ? message : 'We could not process your request. Please try again or contact us.' }, { status: /Too many/.test(message) ? 429 : /Access denied|Sign in/.test(message) ? 403 : safe ? 400 : 503, headers: { 'Cache-Control': 'no-store' } }); }
