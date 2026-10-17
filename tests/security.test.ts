import { describe, it, expect } from 'vitest';
import { sanitizeInput, checkRateLimit } from '../lib/security';

describe('Security & Sanitization Engine', () => {
  it('strips dangerous HTML and script tags from text inputs to prevent XSS', () => {
    const maliciousInput = '<script>document.location="evil.com"</script>Swiggy penalty';
    const sanitized = sanitizeInput(maliciousInput);

    expect(sanitized).toBe('scriptdocument.location="evil.com"/scriptSwiggy penalty');
    expect(sanitized).not.toContain('<');
    expect(sanitized).not.toContain('>');
  });

  it('enforces maximum character limits to prevent buffer or memory overflow', () => {
    const longString = 'A'.repeat(5000);
    const sanitized = sanitizeInput(longString, 500);

    expect(sanitized.length).toBe(500);
  });

  it('rate limits excessive API requests from the same client IP', () => {
    const ip = '192.168.1.100';
    let allowedCount = 0;

    for (let i = 0; i < 40; i++) {
      if (checkRateLimit(ip)) {
        allowedCount++;
      }
    }

    // Should allow up to 30 requests and block the rest
    expect(allowedCount).toBe(30);
    expect(checkRateLimit(ip)).toBe(false);
  });
});
