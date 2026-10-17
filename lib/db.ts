// Cloudflare D1 & Local SQLite Database Bridge for Saathi

import path from 'path';
import fs from 'fs';
import { User } from './auth';

export interface D1DatabaseInterface {
  prepare(query: string): {
    bind(...args: any[]): {
      first<T = any>(): Promise<T | null>;
      all<T = any>(): Promise<{ results: T[] }>;
      run(): Promise<{ success: boolean; meta?: any }>;
    };
  };
  exec(query: string): Promise<any>;
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    phone_number TEXT UNIQUE NOT NULL,
    email TEXT,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    city TEXT,
    language TEXT DEFAULT 'hi',
    emergency_phone TEXT,
    platforms TEXT DEFAULT '["Swiggy"]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shift_audits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    platform TEXT NOT NULL,
    gross_pay REAL NOT NULL,
    active_hours REAL NOT NULL,
    fuel_expense REAL DEFAULT 0,
    penalty_deduction REAL DEFAULT 0,
    insurance_deduction REAL DEFAULT 0,
    net_pay REAL NOT NULL,
    hourly_rate REAL NOT NULL,
    discrepancy_flag BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_shifts_user ON shift_audits(user_id, date DESC);
`;

let localDbInstance: any = null;

/**
 * Returns a D1-compatible database client.
 * In Cloudflare Pages Edge environment: uses context.env.DB
 * In Node.js / Local Next.js environment: uses native node:sqlite
 */
export function getDatabase(cloudflareEnv?: { DB?: any }): D1DatabaseInterface {
  if (cloudflareEnv?.DB) {
    return cloudflareEnv.DB as D1DatabaseInterface;
  }

  // Node.js local SQLite runtime
  if (!localDbInstance) {
    try {
      const { DatabaseSync } = require('node:sqlite');
      const dataDir = path.join(process.cwd(), '.data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const dbPath = path.join(dataDir, 'saathi.sqlite');
      localDbInstance = new DatabaseSync(dbPath);
      localDbInstance.exec(SCHEMA_SQL);
    } catch (err) {
      console.warn("Local SQLite initialization note:", err);
      // Fallback in-memory map if node:sqlite has permission issues
      return createMemoryDb();
    }
  }

  return {
    prepare(query: string) {
      return {
        bind(...args: any[]) {
          return {
            async first<T = any>(): Promise<T | null> {
              const stmt = localDbInstance.prepare(query);
              const result = stmt.get(...args) as T | undefined;
              return result || null;
            },
            async all<T = any>(): Promise<{ results: T[] }> {
              const stmt = localDbInstance.prepare(query);
              const results = stmt.all(...args) as T[];
              return { results: results || [] };
            },
            async run(): Promise<{ success: boolean; meta?: any }> {
              const stmt = localDbInstance.prepare(query);
              const res = stmt.run(...args);
              return { success: true, meta: res };
            },
          };
        },
      };
    },
    async exec(query: string) {
      return localDbInstance.exec(query);
    },
  };
}

// In-memory fallback if file system is disabled in sandbox
const memoryStore = {
  users: new Map<string, any>(),
  shifts: new Map<string, any[]>(),
};

function createMemoryDb(): D1DatabaseInterface {
  return {
    prepare(query: string) {
      return {
        bind(...args: any[]) {
          return {
            async first<T = any>(): Promise<T | null> {
              if (query.includes('FROM users WHERE phone_number =')) {
                const phone = args[0];
                return (memoryStore.users.get(phone) as T) || null;
              }
              if (query.includes('FROM users WHERE id =')) {
                const id = args[0];
                const allUsers = Array.from(memoryStore.users.values());
                for (const u of allUsers) {
                  if (u.id === id) return u as T;
                }
              }
              return null;
            },
            async all<T = any>(): Promise<{ results: T[] }> {
              if (query.includes('FROM shift_audits WHERE user_id =')) {
                const userId = args[0];
                const shifts = memoryStore.shifts.get(userId) || [];
                return { results: shifts as T[] };
              }
              return { results: [] };
            },
            async run(): Promise<{ success: boolean; meta?: any }> {
              if (query.includes('INSERT INTO users')) {
                // id, phone_number, email, password_hash, salt, name, age, city, language, emergency_phone, platforms
                const [id, phone, email, pHash, salt, name, age, city, lang, emergency, platforms] = args;
                memoryStore.users.set(phone, {
                  id,
                  phone_number: phone,
                  email,
                  password_hash: pHash,
                  salt,
                  name,
                  age,
                  city,
                  language: lang,
                  emergency_phone: emergency,
                  platforms,
                });
              }
              return { success: true };
            },
          };
        },
      };
    },
    async exec() {
      return true;
    },
  };
}

/**
 * Normalizes 10-digit Indian phone numbers (strips leading 0 or +91).
 */
export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}
