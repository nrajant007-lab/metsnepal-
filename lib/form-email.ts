import { env } from 'cloudflare:workers';
import { company } from './catalog';
import { database } from './db';

export type EmailStatus = 'pending' | 'sending' | 'accepted' | 'activation_required' | 'failed';
const titles: Record<string, string> = { contact: 'Contact inquiry', quote: 'Quotation request', service: 'Service request', checkout: 'Order request', review: 'Review awaiting approval' };

export function emailRecord(id: string, kind: string, data: unknown, origin: string) {
    return database().prepare('INSERT INTO email_notifications (record_id,kind,payload,origin,status,updated_at) VALUES (?,?,?,?,?,?)')
        .bind(id, kind, JSON.stringify(data), origin, 'pending', new Date().toISOString());
}

export async function emailStatus(id: string): Promise<EmailStatus | null> {
    const row = await database().prepare('SELECT status FROM email_notifications WHERE record_id=?').bind(id).first<{ status: EmailStatus }>();
    return row?.status || null;
}

export async function sendFormEmail(id: string): Promise<EmailStatus | null> {
    const db = database();
    const row = await db.prepare('UPDATE email_notifications SET status=?,updated_at=? WHERE record_id=? AND status IN (?, ?, ?) RETURNING kind,payload,origin')
        .bind('sending', new Date().toISOString(), id, 'pending', 'failed', 'activation_required').first<{ kind: string; payload: string; origin: string }>();
    if (!row) return emailStatus(id);
    let status: EmailStatus = 'failed';
    try {
        const recipient = (env as unknown as Record<string, string>).FORM_SUBMIT_RECIPIENT || company.email;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) throw new Error('Invalid recipient');
        const data = JSON.parse(row.payload) as Record<string, unknown>;
        const fields = Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'website').map(([key, value]) => [key, typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value ?? '')]));
        const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', Referer: row.origin + '/' },
            body: JSON.stringify({ ...fields, request_reference: id, form_type: titles[row.kind] || row.kind, _subject: `${company.name} — ${titles[row.kind] || row.kind}`, _template: 'table', _url: row.origin + '/', ...(data.email ? { _replyto: data.email } : {}) }),
            signal: AbortSignal.timeout(15000)
        });
        const result = await response.json() as { success?: boolean | string; message?: string };
        if (response.ok && (result.success === true || result.success === 'true')) status = /activat|confirm.*email|verify.*email/i.test(result.message || '') ? 'activation_required' : 'accepted';
        else if (/activat|confirm.*email|verify.*email/i.test(result.message || '')) status = 'activation_required';
    } catch {
        // Never log customer data. The saved request remains available to the administrator.
        status = 'failed';
    }
    await db.prepare('UPDATE email_notifications SET status=?,updated_at=? WHERE record_id=?').bind(status, new Date().toISOString(), id).run();
    return status;
}
