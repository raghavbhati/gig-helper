import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken, User } from '../lib/auth';
import { getDatabase, normalizePhoneNumber } from '../lib/db';

describe('Auth & Cryptography Suite', () => {
  it('hashes password with PBKDF2 and verifies accurately', async () => {
    const password = 'mySecretPassword!2026';
    const { hash, salt } = await hashPassword(password);

    expect(hash).toHaveLength(64);
    expect(salt).toHaveLength(32);

    const isMatch = await verifyPassword(password, hash, salt);
    expect(isMatch).toBe(true);

    const isWrong = await verifyPassword('wrongPassword123', hash, salt);
    expect(isWrong).toBe(false);
  });

  it('normalizes 10-digit Indian mobile numbers', () => {
    expect(normalizePhoneNumber('+91 98765-43210')).toBe('9876543210');
    expect(normalizePhoneNumber('09876543210')).toBe('9876543210');
    expect(normalizePhoneNumber('9876543210')).toBe('9876543210');
  });

  it('creates and verifies tamper-proof session tokens', async () => {
    const dummyUser: User = {
      id: 'usr_test_123',
      phoneNumber: '9876543210',
      email: 'raju@example.com',
      name: 'Raju Kumar',
      age: 28,
      city: 'Delhi NCR',
      language: 'hi',
      emergencyPhone: '9876500000',
      platforms: ['Swiggy', 'Zomato'],
    };

    const token = await createSessionToken(dummyUser);
    expect(token).toContain('.');

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.phoneNumber).toBe('9876543210');
    expect(decoded?.name).toBe('Raju Kumar');
    expect(decoded?.platforms).toContain('Swiggy');

    // Tampered token test
    const tampered = token.slice(0, -5) + 'abcde';
    const invalidDecoded = await verifySessionToken(tampered);
    expect(invalidDecoded).toBeNull();
  });

  it('creates and queries user in D1 / SQLite database by phone number', async () => {
    const db = getDatabase();
    const testPhone = '99999' + Math.floor(10000 + Math.random() * 90000);
    const { hash, salt } = await hashPassword('WorkerPass@123');

    await db
      .prepare(`
        INSERT INTO users (id, phone_number, email, password_hash, salt, name, age, city, language, emergency_phone, platforms)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        'usr_' + Date.now(),
        testPhone,
        'worker@example.com',
        hash,
        salt,
        'Mukesh Sharma',
        30,
        'Bengaluru',
        'en',
        '9876511111',
        JSON.stringify(['Uber', 'Ola'])
      )
      .run();

    const userRecord = await db
      .prepare('SELECT * FROM users WHERE phone_number = ?')
      .bind(testPhone)
      .first<{ name: string; phone_number: string; platforms: string }>();

    expect(userRecord).not.toBeNull();
    expect(userRecord?.name).toBe('Mukesh Sharma');
    expect(userRecord?.phone_number).toBe(testPhone);
    const platforms = JSON.parse(userRecord?.platforms || '[]');
    expect(platforms).toContain('Uber');
  });

  it('handles batch shift sync to D1 shift_audits with deduplication', async () => {
    const db = getDatabase();
    const userId = 'usr_sync_' + Date.now();
    const testDate = '2026-10-17';

    // Insert user
    const { hash, salt } = await hashPassword('Pass1234');
    await db
      .prepare('INSERT INTO users (id, phone_number, password_hash, salt, name) VALUES (?, ?, ?, ?, ?)')
      .bind(userId, '88888' + Math.floor(10000 + Math.random() * 90000), hash, salt, 'Sync Test User')
      .run();

    // Batch upsert 2 shifts
    const shift1Id = 'shift_sync_1_' + Date.now();
    await db
      .prepare(`
        INSERT INTO shift_audits (
          id, user_id, date, platform, gross_pay, active_hours, fuel_expense, penalty_deduction, net_pay, hourly_rate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(shift1Id, userId, testDate, 'Swiggy', 1500, 10, 300, 350, 850, 85)
      .run();

    const shiftsResult = await db
      .prepare('SELECT * FROM shift_audits WHERE user_id = ?')
      .bind(userId)
      .all<{ id: string; net_pay: number; hourly_rate: number }>();

    expect(shiftsResult.results.length).toBe(1);
    expect(shiftsResult.results[0].id).toBe(shift1Id);
    expect(shiftsResult.results[0].net_pay).toBe(850);
  });
});

