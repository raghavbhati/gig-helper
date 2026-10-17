import { verifySessionToken } from '../../../lib/auth';
import { getDatabase } from '../../../lib/db';

export async function onRequestGet(context: any) {
  try {
    const cookieHeader = context.request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/saathi_session=([^;]+)/);
    const authHeader = context.request.headers.get('Authorization') || '';
    const token = match ? match[1] : authHeader.replace('Bearer ', '');

    if (!token) {
      return new Response(JSON.stringify({ authenticated: false, user: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await verifySessionToken(token);
    if (!user) {
      return new Response(JSON.stringify({ authenticated: false, user: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = getDatabase(context.env);
    const countRecord = await db
      .prepare('SELECT COUNT(*) as count FROM shift_audits WHERE user_id = ?')
      .bind(user.id)
      .first<{ count: number }>();

    return new Response(
      JSON.stringify({
        authenticated: true,
        user,
        shiftCount: countRecord?.count || 0,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Edge me error:', err);
    return new Response(JSON.stringify({ authenticated: false, user: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
