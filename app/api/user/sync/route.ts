import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { EarningsRecord } from '@/lib/sampleData';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get('saathi_session')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'क्लाउड सिंक के लिए लॉगिन आवश्यक है।' },
        { status: 401 }
      );
    }

    const user = await verifySessionToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const clientShifts: EarningsRecord[] = Array.isArray(body.shifts) ? body.shifts : [];
    const db = getDatabase();

    // Upsert client shifts into D1
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

    // Retrieve all cloud shifts for this user
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

    return NextResponse.json({
      success: true,
      message: `${clientShifts.length} शिफ्ट क्लाउड में सुरक्षित सिंक हो गईं!`,
      totalSynced: cloudShifts.results.length,
      syncedAt: new Date().toISOString(),
      cloudShifts: cloudShifts.results,
    });
  } catch (err: any) {
    console.error('Shift sync error:', err);
    return NextResponse.json(
      { error: 'शिफ्ट सिंक करने में समस्या आई।' },
      { status: 500 }
    );
  }
}
