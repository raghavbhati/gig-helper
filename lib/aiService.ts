export interface DisputeDraftResponse {
  incidentSummary: string;
  inAppSupportMessage: string;
  officialEscalationEmail: {
    subject: string;
    body: string;
  };
  laborCommissionerPetition: {
    title: string;
    body: string;
    relevantLegalActs: string[];
  };
}

export async function callGemini(prompt: string, imageBase64?: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
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

    parts.push({ text: prompt });
    contents.push({ parts });

    // Use gemini-1.5-flash or gemini-2.5-flash
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1500,
        }
      })
    });

    if (!res.ok) {
      console.warn("Gemini API call failed:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.error("Gemini invocation error:", err);
    return null;
  }
}
