import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, normalizePhoneNumber } from '@/lib/db';
import { hashPassword, createSessionToken, User } from '@/lib/auth';
import { sanitizeText } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone = body.phoneNumber || body.phone;
    const rawPassword = body.password;
    const rawName = body.name;

    if (!rawPhone || !rawPassword || !rawName) {
      return NextResponse.json(
        { error: 'मोबाइल नंबर, नाम और पासवर्ड आवश्यक हैं।' },
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

    if (String(rawPassword).length < 4) {
      return NextResponse.json(
        { error: 'पासवर्ड कम से कम 4 अक्षरों या अंकों का होना चाहिए।' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Check if phone number is already registered
    const existing = await db
      .prepare('SELECT id FROM users WHERE phone_number = ?')
      .bind(phoneNumber)
      .first<{ id: string }>();

    if (existing) {
      return NextResponse.json(
        { error: 'यह मोबाइल नंबर पहले से पंजीकृत है। कृपया लॉगिन करें।' },
        { status: 409 }
      );
    }

    const { hash, salt } = await hashPassword(String(rawPassword));
    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    const name = sanitizeText(String(rawName));
    const email = body.email ? sanitizeText(String(body.email)) : null;
    const age = body.age ? parseInt(String(body.age), 10) : null;
    const city = body.city ? sanitizeText(String(body.city)) : 'Delhi NCR';
    const language = body.language ? sanitizeText(String(body.language)) : 'hi';
    const emergencyPhone = body.emergencyPhone ? normalizePhoneNumber(String(body.emergencyPhone)) : null;
    const platforms = Array.isArray(body.platforms) && body.platforms.length > 0
      ? body.platforms
      : ['Swiggy'];

    await db
      .prepare(`
        INSERT INTO users (
          id, phone_number, email, password_hash, salt, name, age, city, language, emergency_phone, platforms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        userId,
        phoneNumber,
        email,
        hash,
        salt,
        name,
        age,
        city,
        language,
        emergencyPhone,
        JSON.stringify(platforms)
      )
      .run();

    const user: User = {
      id: userId,
      phoneNumber,
      email,
      name,
      age,
      city,
      language,
      emergencyPhone,
      platforms,
      createdAt: new Date().toISOString(),
    };

    const token = await createSessionToken(user);
    const response = NextResponse.json({
      success: true,
      message: 'खाता सफलतापूर्वक बन गया!',
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
    console.error('Signup error:', err);
    return NextResponse.json(
      { error: 'खाता बनाने में समस्या आई। कृपया पुनः प्रयास करें।' },
      { status: 500 }
    );
  }
}
