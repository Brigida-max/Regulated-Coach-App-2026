const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";

export const getGeminiResponse = async (history: any[], message: string) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          ...history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(h.content || h.text || "") }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ]
      })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Ik kan nu even niet praten.";
  } catch (e) {
    return "Verbindingsfout.";
  }
};

// Aliassen voor de app
export const getCoachResponseStream = getGeminiResponse;
export const getChatResponse = getGeminiResponse;

export const generateSpeech = async (text: string) => {
  if (!text) return null;
  try {
    // Deze specifieke URL is cruciaal voor de v1beta audio service
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
        }
      })
    });

    const data = await response.json();
    // Google stuurt de audio terug in deze specifieke map:
    const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return audioData || null;
  } catch (e) {
    console.error("Audio error:", e);
    return null;
  }
};