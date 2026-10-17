import { getDatabase, normalizePhoneNumber } from '../../../lib/db';
import { verifyPassword, createSessionToken, User } from '../../../lib/auth';

export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const rawPhone = body.phoneNumber || body.phone;
    const rawPassword = body.password;

    if (!rawPhone || !rawPassword) {
      return new Response(
        JSON.stringify({ error: 'मोबाइल नंबर और पासवर्ड दोनों आवश्यक हैं।' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const phoneNumber = normalizePhoneNumber(String(rawPhone));
    if (phoneNumber.length !== 10) {
      return new Response(
        JSON.stringify({ error: 'कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = getDatabase(context.env);

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
      return new Response(
        JSON.stringify({ error: 'यह मोबाइल नंबर पंजीकृत नहीं है। कृपया पहले नया खाता बनाएं।' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isMatch = await verifyPassword(
      String(rawPassword),
      record.password_hash,
      record.salt
    );

    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: 'पासवर्ड गलत है। कृपया सही पासवर्ड दर्ज करें।' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
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

    return new Response(
      JSON.stringify({
        success: true,
        message: 'सफलतापूर्वक लॉगिन हो गया!',
        user,
        token,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `saathi_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 3600}`,
        },
      }
    );
  } catch (err: any) {
    console.error('Edge Login error:', err);
    return new Response(
      JSON.stringify({ error: 'लॉगिन करने में समस्या आई। कृपया पुनः प्रयास करें।' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
