/**
 * Security & Sanitization Utilities for Saathi
 */

// Basic in-memory rate limiter per IP for API protection
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // Max 30 requests / min per IP

export function checkRateLimit(clientIp: string = '127.0.0.1'): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIp);

  if (!clientData || now - clientData.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(clientIp, { count: 1, lastReset: now });
    return true;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  clientData.count++;
  return true;
}

/**
 * Sanitize text inputs against XSS and injection
 */
export function sanitizeInput(input: string, maxLength: number = 2000): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Strip angle brackets to prevent HTML/script injection
    .trim();
}

/**
 * Validate earnings input payload
 */
export interface ValidatedEarningsInput {
  gross: number;
  hours: number;
  penalty: number;
  reason: string;
  platform: string;
}

export function validateEarningsInput(data: any): ValidatedEarningsInput {
  const gross = Math.max(0, Math.min(500000, parseFloat(data.gross) || 0));
  const hours = Math.max(0.1, Math.min(24, parseFloat(data.hours) || 8));
  const penalty = Math.max(0, Math.min(50000, parseFloat(data.penalty) || 0));
  const reason = sanitizeInput(data.reason || 'Unfair deduction', 200);
  const platform = sanitizeInput(data.platform || 'Platform', 50);

  return { gross, hours, penalty, reason, platform };
}
