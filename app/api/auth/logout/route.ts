import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'सफलतापूर्वक लॉगआउट हो गया।',
  });

  response.cookies.set('gig_kavach_session', '', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
  });

  response.cookies.set('saathi_session', '', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
  });

  return response;
}
