import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/aiService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { message, language = 'hinglish', persona = 'delivery', history = [] } = await req.json();

    const systemPrompt = `You are Saathi (साथी), an empathetic, smart, street-savvy AI guardian for gig and informal workers (food delivery riders, cab/auto drivers, daily-wage laborers).
The user is speaking in ${language}.
Their persona is: ${persona}.
Answer in their selected language (${language}). Keep the tone warm, respectful, concise (max 3-4 sentences), and crystal clear.
Do NOT use legal jargon. Explain rules using everyday street analogies.
Always give 1 actionable next step (e.g. check e-Shram card, take screenshot, file dispute).`;

    let reply = null;
    const aiOutput = await callGemini(`${systemPrompt}\nUser says: ${message}`);

    if (aiOutput) {
      reply = aiOutput.trim();
    } else {
      // Realistic fallback based on common gig topics
      const msgLower = (message || '').toLowerCase();
      if (msgLower.includes('penalty') || msgLower.includes('kat gaya') || msgLower.includes('cut') || msgLower.includes('fine')) {
        reply = language === 'en'
          ? "I hear you. If a platform deducted a penalty unfairly, do not let it go. Go to our 'Dispute Drafter' tab above, attach your order number or voice note, and I will generate a formal appeal citing weather and platform guidelines to get your money refunded."
          : "चिंता मत कीजिए। अगर कंपनी ने गलत पेनल्टी काटी है तो चुप मत बैठिए। ऊपर 'शिकायत पत्र लिखें' टैब पर जाएं, अपना आर्डर नंबर बताएं, और मैं आपके लिए तुरंत कंपनी को भेजने वाला कानूनी अपील पत्र तैयार कर दूंगा।";
      } else if (msgLower.includes('scheme') || msgLower.includes('sarkari') || msgLower.includes('yojana') || msgLower.includes('bima') || msgLower.includes('insurance')) {
        reply = language === 'en'
          ? "As an informal or gig worker, you are entitled to the government's e-Shram card which provides ₹2 Lakh accident coverage for free, plus the State Gig Worker Welfare Fund. Check the 'Welfare Schemes' tab to verify your eligibility in 30 seconds."
          : "आप भारत सरकार के ई-श्रम (e-Shram) कार्ड के हकदार हैं, जिसमें मुफ्त ₹2 लाख का दुर्घटना बीमा मिलता है। इसके अलावा राज्य गिग वर्कर बोर्ड का फंड भी है। ऊपर 'सरकारी योजनाएं' टैब में देखें और तुरंत आवेदन का तरीका जानें।";
      } else {
        reply = language === 'en'
          ? "Namaste! I am Saathi. You can ask me to audit your delivery payout slips, write complaint letters for unfair penalties, check government welfare schemes, or simplify confusing company rules. How can I assist your shift today?"
          : "नमस्ते साथी! मैं आपका कानूनी और कमाई का डिजिटल मददगार हूँ। आप मुझसे अपनी कमाई का हिसाब चेक करवा सकते हैं, गलत कटी पेनल्टी की शिकायत लिखवा सकते हैं, या सरकारी बीमा योजनाएं समझ सकते हैं। बताइए आज मैं आपकी क्या मदद करूँ?";
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("API error in chat:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
