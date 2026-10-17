// Native Web Crypto Authentication Library for Gig Kavach
// 100% Edge-Compatible (Cloudflare Workers & Node.js 20+)

export interface User {
  id: string;
  phoneNumber: string; // 10-digit primary identifier
  email?: string | null;
  name: string;
  age?: number | null;
  city?: string | null;
  language: string;
  emergencyPhone?: string | null;
  platforms: string[];
  createdAt?: string;
}

export interface SignupRequest {
  phoneNumber: string;
  email?: string;
  password: string;
  name: string;
  age?: number;
  city?: string;
  language?: string;
  emergencyPhone?: string;
  platforms?: string[];
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

const JWT_SECRET = process.env.AUTH_SECRET || 'gig-kavach-worker-secure-secret-key-2026';

/**
 * Derives a PBKDF2 salted hash using standard Web Crypto API (SHA-256, 100,000 iterations).
 */
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hash = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const salt = Array.from(saltBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { hash, salt };
}

/**
 * Verifies a password against the stored PBKDF2 hash and salt.
 */
export async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const saltBytes = new Uint8Array(storedSalt.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      256
    );

    const checkHash = Array.from(new Uint8Array(derivedBits))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return checkHash === storedHash;
  } catch {
    return false;
  }
}

/**
 * Creates a tamper-proof signed session token using Web Crypto HMAC-SHA256.
 */
export async function createSessionToken(user: User): Promise<string> {
  const enc = new TextEncoder();
  const payload = JSON.stringify({
    user,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days session
  });

  const payloadB64 = Buffer.from(payload).toString('base64url');
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const signatureB64 = Buffer.from(signature).toString('base64url');

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies and decodes a signed session token. Returns null if invalid or expired.
 */
export async function verifySessionToken(token: string): Promise<User | null> {
  try {
    if (!token || !token.includes('.')) return null;
    const [payloadB64, signatureB64] = token.split('.');
    if (!payloadB64 || !signatureB64) return null;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signature = Buffer.from(signatureB64, 'base64url');
    const isValid = await crypto.subtle.verify('HMAC', key, signature, enc.encode(payloadB64));
    if (!isValid) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;

    return payload.user;
  } catch {
    return null;
  }
}
