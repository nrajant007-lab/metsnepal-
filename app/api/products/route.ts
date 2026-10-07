import { getProducts } from '@/lib/db';
import { errorResponse } from '@/lib/security';
export const dynamic = 'force-dynamic';
export async function GET() { try {
    return Response.json(await getProducts(), { headers: { 'Cache-Control': 'no-store' } });
}
catch (e) {
    return errorResponse(e);
} }
