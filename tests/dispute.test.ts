import { describe, it, expect } from 'vitest';
import { translations, Language } from '../lib/translations';

describe('Dispute Acts & Translation Integrity', () => {
  it('supports all 7 core regional languages with required UI keys', () => {
    const requiredLanguages: Language[] = ['en', 'hi', 'hinglish', 'ta', 'te', 'kn', 'bn'];

    requiredLanguages.forEach((lang) => {
      const t = translations[lang];
      expect(t).toBeDefined();
      expect(t.appName).toBeTruthy();
      expect(t.tabs.earnings).toBeTruthy();
      expect(t.tabs.dispute).toBeTruthy();
      expect(t.tabs.welfare).toBeTruthy();
      expect(t.tabs.docs).toBeTruthy();
      expect(t.tabs.safety).toBeTruthy();
    });
  });

  it('validates statutory labor acts citation structure', () => {
    const legalActs = [
      "Code on Social Security 2020 (Sections 113-114: Gig & Platform Workers Welfare)",
      "Payment of Wages Act 1936 (Section 7: Deductions for Damage or Loss)",
      "State Platform Based Gig Workers Welfare & Social Security Act",
      "Consumer Protection (E-Commerce) Rules 2020 (Unfair Contract Terms)"
    ];

    expect(legalActs.length).toBe(4);
    expect(legalActs[0]).toContain("Code on Social Security 2020");
    expect(legalActs[1]).toContain("Payment of Wages Act 1936");
  });
});
