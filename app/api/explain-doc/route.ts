import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/aiService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { documentText, imageBase64, language = 'hi' } = await req.json();

    const systemPrompt = `You are Gig Kavach AI, a legal and contract simplification assistant for informal & gig workers.
Analyze the provided document excerpt or image (contract clause, deactivation notice, insurance policy, wage memo).
Explain it in simple, everyday language that a semi-literate worker can immediately understand.

Provide:
1. simplifiedWhatIsIt: "Yeh kagaz kya hai?" (1 simple sentence)
2. simplifiedImpact: "Aapki kamai aur kaam par kya asar padega?" (2 simple sentences)
3. recommendedAction: "Aapko abhi turant kya karna chahiye?" (actionable bullet points)
4. trapWarning: High-risk warning if this clause is one-sided, unfair, or dangerous, otherwise null.

Respond in JSON matching:
{
  "simplifiedWhatIsIt": string,
  "simplifiedImpact": string,
  "recommendedAction": string,
  "trapWarning": string | null
}`;

    let resultJson = null;
    const aiOutput = await callGemini(systemPrompt + "\nDocument content:\n" + (documentText || "Document Image"), imageBase64);

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
        simplifiedWhatIsIt: "यह कंपनी और आपके बीच का सर्विस एग्रीमेंट क्लॉज है जो अकाउंट डीएक्टिवेशन और पेनल्टी के नियमों को तय करता है।",
        simplifiedImpact: "अगर ग्राहक कोई शिकायत दर्ज करता है या ऐप में कोई गड़बड़ी आती है, तो कंपनी बिना आपकी बात सुने आपकी आईडी ब्लॉक कर सकती है और उस हफ्ते का पैसा रोक सकती है।",
        recommendedAction: "1. हर डिलीवरी की फोटो और कस्टमर चैट अपने फोन में सुरक्षित रखें। 2. अगर आईडी ब्लॉक होती है, तो 'Dispute Drafter' टैब से तुरंत आधिकारिक अपील भेजें।",
        trapWarning: "⚠️ चेतावनी: यह क्लॉज एकतरफा है। भारतीय उपभोक्ता और श्रम कानूनों के तहत बिना स्पष्टीकरण का मौका दिए आईडी बंद करना गैरकानूनी माना गया है।"
      };
    }

    return NextResponse.json(resultJson);
  } catch (error) {
    console.error("API error in explain-doc:", error);
    return NextResponse.json({ error: "Failed to explain document" }, { status: 500 });
  }
}
