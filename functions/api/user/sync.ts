import { verifySessionToken } from '../../../lib/auth';
import { getDatabase } from '../../../lib/db';

export async function onRequestPost(context: any) {
  try {
    const cookieHeader = context.request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/saathi_session=([^;]+)/);
    const authHeader = context.request.headers.get('Authorization') || '';
    const token = match ? match[1] : authHeader.replace('Bearer ', '');

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'क्लाउड सिंक के लिए लॉगिन आवश्यक है।' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await verifySessionToken(token);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json();
    const clientShifts = Array.isArray(body.shifts) ? body.shifts : [];
    const db = getDatabase(context.env);

    for (const shift of clientShifts) {
      if (!shift.id || !shift.date) continue;

      const fuel = shift.deductions?.fuelEstimate || 0;
      const penalty = shift.deductions?.penalty || 0;
      const hasDiscrepancy = shift.discrepancyAlert ? 1 : 0;
      const platformName = shift.source || 'Swiggy';

      await db
        .prepare(`
          INSERT INTO shift_audits (
            id, user_id, date, platform, gross_pay, active_hours,
            fuel_expense, penalty_deduction, net_pay, hourly_rate, discrepancy_flag
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            gross_pay = excluded.gross_pay,
            net_pay = excluded.net_pay,
            hourly_rate = excluded.hourly_rate
        `)
        .bind(
          shift.id,
          user.id,
          shift.date,
          platformName,
          shift.grossPay,
          shift.activeHours,
          fuel,
          penalty,
          shift.netPay,
          shift.realHourlyWage,
          hasDiscrepancy
        )
        .run();
    }

    const cloudShifts = await db
      .prepare('SELECT * FROM shift_audits WHERE user_id = ? ORDER BY date DESC')
      .bind(user.id)
      .all<{
        id: string;
        user_id: string;
        date: string;
        platform: string;
        gross_pay: number;
        active_hours: number;
        fuel_expense: number;
        penalty_deduction: number;
        net_pay: number;
        hourly_rate: number;
        discrepancy_flag: number;
      }>();

    return new Response(
      JSON.stringify({
        success: true,
        message: `${clientShifts.length} शिफ्ट क्लाउड में सुरक्षित सिंक हो गईं!`,
        totalSynced: cloudShifts.results.length,
        syncedAt: new Date().toISOString(),
        cloudShifts: cloudShifts.results,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Edge shift sync error:', err);
    return new Response(
      JSON.stringify({ error: 'शिफ्ट सिंक करने में समस्या आई।' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
