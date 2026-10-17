import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/aiService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const {
      incidentDescription,
      platformName = 'Platform Aggregator',
      orderOrTicketId = 'N/A',
      workerName = 'Partner / Worker',
      workerPhone = '98XXXXXXXX',
      workerPersona = 'delivery',
      deductionAmount = '350',
    } = await req.json();

    const systemPrompt = `You are Saathi-AI, a legal advocacy assistant for gig and unorganized informal workers.
Generate a multi-tier dispute escalation bundle for the following incident:
Platform: ${platformName}
Worker: ${workerName} (${workerPhone}, ${workerPersona})
Order/Ticket: ${orderOrTicketId}
Deduction/Issue: ₹${deductionAmount}
Incident Details: ${incidentDescription}

Requirements:
1. inAppSupportMessage: Short (under 60 words), polite, crisp text suitable for platform live in-app chat.
2. officialEscalationEmail: Formal email with professional Subject and Body addressed to Partner Grievance Officer / Operations Lead. It must cite operational delays, force majeure or lack of human review, and demand refund within 48 hours.
3. laborCommissionerPetition: Formal petition addressed to "The District Labor Commissioner / Platform Gig Workers Grievance Redressal Officer" citing principles of natural justice, Code on Social Security 2020 / State Gig Workers Social Security Act, and illegal arbitrary wage withholding.

Return ONLY valid JSON matching:
{
  "incidentSummary": string,
  "inAppSupportMessage": string,
  "officialEscalationEmail": {
    "subject": string,
    "body": string
  },
  "laborCommissionerPetition": {
    "title": string,
    "body": string,
    "relevantLegalActs": string[]
  }
}`;

    let resultJson = null;
    const aiOutput = await callGemini(systemPrompt);

    if (aiOutput) {
      try {
        const cleaned = aiOutput.replace(/```json/g, "").replace(/```/g, "").trim();
        resultJson = JSON.parse(cleaned);
      } catch (e) {
        console.warn("Failed to parse AI output, falling back");
      }
    }

    if (!resultJson) {
      resultJson = {
        incidentSummary: `Dispute against arbitrary penalty of ₹${deductionAmount} on Order/Trip #${orderOrTicketId} on ${platformName}.`,
        inAppSupportMessage: `Hi Support Team, regarding Order #${orderOrTicketId}, an unfair penalty of ₹${deductionAmount} was deducted from my payout. The delay was entirely caused by adverse weather/traffic conditions beyond rider control. I completed delivery in good faith with customer verification. Kindly review my GPS breadcrumb and reverse this penalty immediately.`,
        officialEscalationEmail: {
          subject: `URGENT: Appeal Against Wrongful Payout Deduction - Partner ID: ${workerPhone} - Ref #${orderOrTicketId}`,
          body: `To,\nThe Grievance Redressal Officer & Operations Lead\n${platformName} Operations India\n\nRespected Sir/Madam,\n\nI am writing to register an urgent appeal against a wrongful penalty deduction of ₹${deductionAmount} levied on my partner account for Order/Trip Ref: #${orderOrTicketId}.\n\nIncident Summary:\n${incidentDescription}\n\nGrounds of Appeal:\n1. Force Majeure & Environmental Obstacles: The recorded transit duration was influenced by documented heavy rainfall and waterlogging in the sector, not rider negligence.\n2. Good Faith Fulfilment: The delivery was successfully handed over with direct confirmation from the customer doorstep.\n3. Lack of Human Review: The penalty was executed algorithmically without providing me an opportunity to explain or submit route telemetry.\n\nIn accordance with fair partnership guidelines and statutory gig worker welfare norms, I request an immediate reversal and credit of ₹${deductionAmount} to my linked bank account within 48 hours.\n\nSincerely,\n${workerName}\nRegistered Contact: ${workerPhone}`
        },
        laborCommissionerPetition: {
          title: `FORMAL GRIEVANCE PETITION UNDER GIG & UNORGANIZED WORKERS WELFARE GUIDELINES`,
          body: `BEFORE THE DISTRICT LABOR OFFICER & GIG WORKERS WELFARE TRIBUNAL\n\nIn the Matter of: ${workerName} (Complainant)\nVersus\n${platformName} (Respondent Aggregator)\n\nCOMPLAINT UNDER SECTION 7 (UNLAWFUL DEDUCTIONS) & SOCIAL SECURITY CODE\n\n1. The Complainant is a registered platform worker providing frontline delivery/transit services through Respondent's digital application.\n2. On the date in question (Ref #${orderOrTicketId}), Respondent unilaterally withheld an amount of ₹${deductionAmount} from Complainant's weekly payout without due process or show-cause inquiry.\n3. The stated reason for penalty is invalid, as the delay resulted from extreme local weather and traffic conditions beyond Complainant's reasonable control.\n4. Such arbitrary deduction violates Section 7 of the Payment of Wages Act and the Fair Grievance Redressal Framework of the Platform Based Gig Workers Act.\n\nPRAYER:\nThe Complainant respectfully prays that this Hon'ble Authority direct the Respondent to:\na) Refund the illegally withheld sum of ₹${deductionAmount} with applicable interest.\nb) Refrain from negative algorithmic rating throttling or retaliatory account suspension.\n\nDate: ${new Date().toLocaleDateString()}\nApplicant: ${workerName}`,
          relevantLegalActs: [
            "Code on Social Security 2020 (Sections 113-114: Gig & Platform Workers Welfare)",
            "Payment of Wages Act 1936 (Section 7: Deductions for Damage or Loss)",
            "State Platform Based Gig Workers Welfare & Social Security Act",
            "Consumer Protection (E-Commerce) Rules 2020 (Unfair Contract Terms)"
          ]
        }
      };
    }

    return NextResponse.json(resultJson);
  } catch (error) {
    console.error("API error in draft-dispute:", error);
    return NextResponse.json({ error: "Failed to draft dispute" }, { status: 500 });
  }
}
