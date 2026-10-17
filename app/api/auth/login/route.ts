import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, normalizePhoneNumber } from '@/lib/db';
import { verifyPassword, createSessionToken, User } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone = body.phoneNumber || body.phone;
    const rawPassword = body.password;

    if (!rawPhone || !rawPassword) {
      return NextResponse.json(
        { error: 'मोबाइल नंबर और पासवर्ड दोनों आवश्यक हैं।' },
        { status: 400 }
      );
    }

    const phoneNumber = normalizePhoneNumber(String(rawPhone));
    if (phoneNumber.length !== 10) {
      return NextResponse.json(
        { error: 'कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    const record = await db
      .prepare('SELECT * FROM users WHERE phone_number = ?')
      .bind(phoneNumber)
      .first<{
        id: string;
        phone_number: string;
        email: string | null;
        password_hash: string;
        salt: string;
        name: string;
        age: number | null;
        city: string | null;
        language: string | null;
        emergency_phone: string | null;
        platforms: string | null;
        created_at: string;
      }>();

    if (!record) {
      return NextResponse.json(
        { error: 'यह मोबाइल नंबर पंजीकृत नहीं है। कृपया पहले नया खाता बनाएं।' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(
      String(rawPassword),
      record.password_hash,
      record.salt
    );

    if (!isMatch) {
      return NextResponse.json(
        { error: 'पासवर्ड गलत है। कृपया सही पासवर्ड दर्ज करें।' },
        { status: 401 }
      );
    }

    let platforms: string[] = ['Swiggy'];
    try {
      if (record.platforms) {
        platforms = JSON.parse(record.platforms);
      }
    } catch {
      platforms = ['Swiggy'];
    }

    const user: User = {
      id: record.id,
      phoneNumber: record.phone_number,
      email: record.email,
      name: record.name,
      age: record.age,
      city: record.city,
      language: record.language || 'hi',
      emergencyPhone: record.emergency_phone,
      platforms,
      createdAt: record.created_at,
    };

    const token = await createSessionToken(user);
    const response = NextResponse.json({
      success: true,
      message: 'सफलतापूर्वक लॉगिन हो गया!',
      user,
      token,
    });

    response.cookies.set('saathi_session', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'लॉगिन करने में समस्या आई। कृपया पुनः प्रयास करें।' },
      { status: 500 }
    );
  }
}
