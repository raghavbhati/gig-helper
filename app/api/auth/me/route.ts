import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get('saathi_session')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const user = await verifySessionToken(token);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const db = getDatabase();
    const countRecord = await db
      .prepare('SELECT COUNT(*) as count FROM shift_audits WHERE user_id = ?')
      .bind(user.id)
      .first<{ count: number }>();

    return NextResponse.json({
      authenticated: true,
      user,
      shiftCount: countRecord?.count || 0,
    });
  } catch (err) {
    console.error('Session check error:', err);
    return NextResponse.json({ authenticated: false, user: null });
  }
}
