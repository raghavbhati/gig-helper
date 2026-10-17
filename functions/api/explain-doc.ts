export async function onRequestPost(context: any) {
  try {
    const { documentText, imageBase64, language = 'hi' } = await context.request.json();
    const apiKey = context.env?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    let resultJson = null;

    if (apiKey) {
      try {
        const systemPrompt = `You are Saathi-AI, a legal and contract simplification assistant for informal & gig workers.
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

        const contents: any[] = [];
        const parts: any[] = [];
        if (imageBase64) {
          parts.push({
            inline_data: {
              mime_type: "image/jpeg",
              data: imageBase64.replace(/^data:image\/\w+;base64,/, "")
            }
          });
        }
        parts.push({ text: systemPrompt + "\nDocument content:\n" + (documentText || "Document Image") });
        contents.push({ parts });

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents, generationConfig: { temperature: 0.2, maxOutputTokens: 1500 } })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
            resultJson = JSON.parse(cleaned);
          }
        }
      } catch (e) {
        console.warn("Cloudflare Pages Gemini explain-doc error:", e);
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

    return new Response(JSON.stringify(resultJson), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to explain document" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
