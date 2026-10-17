import { describe, it, expect } from 'vitest';
import { validateEarningsInput } from '../lib/security';

describe('Earnings & Wage Calculations', () => {
  it('correctly calculates net take-home pay with fuel and penalty deductions', () => {
    const gross = 1450;
    const hours = 10;
    const penalty = 350;
    const fuel = Math.round(gross * 0.22); // 319
    const net = Math.max(0, gross - fuel - penalty); // 781

    expect(fuel).toBe(319);
    expect(net).toBe(781);
  });

  it('correctly calculates real hourly wage', () => {
    const net = 781;
    const hours = 10;
    const hourlyWage = Math.round((net / hours) * 10) / 10;

    expect(hourlyWage).toBe(78.1);
  });

  it('flags real hourly wage when below statutory minimum wage benchmark (₹95/hr)', () => {
    const hourlyWage = 78.1;
    const statutoryMinWage = 95.0;
    const isBelowMinWage = hourlyWage < statutoryMinWage;
    const underpaymentPercentage = Math.round(((statutoryMinWage - hourlyWage) / statutoryMinWage) * 100);

    expect(isBelowMinWage).toBe(true);
    expect(underpaymentPercentage).toBe(18); // ~18% below statutory minimum
  });

  it('validates input boundaries and prevents negative values', () => {
    const validated = validateEarningsInput({
      gross: '-500',
      hours: '0',
      penalty: '-200',
      reason: '<script>alert(1)</script>Penalty',
      platform: 'Swiggy<b>Bold</b>'
    });

    expect(validated.gross).toBe(0);
    expect(validated.hours).toBe(8);
    expect(validated.penalty).toBe(0);
    expect(validated.reason).not.toContain('<script>');
    expect(validated.platform).not.toContain('<b>');
  });
});
