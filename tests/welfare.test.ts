import { describe, it, expect } from 'vitest';
import { sampleWelfareSchemes } from '../lib/sampleData';

describe('Welfare Schemes & Eligibility Logic', () => {
  it('contains essential informal worker welfare schemes', () => {
    const schemeIds = sampleWelfareSchemes.map((s) => s.id);

    expect(schemeIds).toContain('e-shram');
    expect(schemeIds).toContain('gig-welfare-board');
    expect(schemeIds).toContain('pm-jay');
    expect(schemeIds).toContain('pm-svanidhi');
    expect(schemeIds).toContain('bocw-welfare');
  });

  it('correctly matches eligible schemes for unorganized delivery partners', () => {
    const deliverySchemes = sampleWelfareSchemes.filter((s) =>
      s.eligiblePersonas.includes('delivery')
    );

    expect(deliverySchemes.length).toBeGreaterThanOrEqual(4);
    const eshram = deliverySchemes.find((s) => s.id === 'e-shram');
    expect(eshram).toBeDefined();
    expect(eshram?.benefitAmount).toContain('2,00,000');
  });

  it('provides required documents checklist for each scheme', () => {
    sampleWelfareSchemes.forEach((scheme) => {
      expect(scheme.documentsRequired.length).toBeGreaterThanOrEqual(2);
      expect(scheme.officialPortal).toBeTruthy();
    });
  });
});
