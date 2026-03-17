const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";

// 1. De Coach Tekst Functie (Gebruikt de meest stabiele URL)
export const getGeminiResponse = async (history: any[], message: string) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Ik kan nu even niet antwoorden.";
  } catch (e) {
    return "Verbindingsfout.";
  }
};

export const getCoachResponseStream = getGeminiResponse;
export const getChatResponse = getGeminiResponse;

// 2. De Geluid (TTS) Functie - Aangepast naar de exact werkende v1beta URL
export const generateSpeech = async (text: string) => {
  if (!text) return null;
  try {
    // We gebruiken 'v1beta' omdat alleen die versie de 'AUDIO' modaliteit ondersteunt
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: "Puck" } 
            } 
          }
        }
      })
    });

    const data = await response.json();
    
    // Als er een error is, loggen we die nu direct in je scherm
    if (data.error) {
      console.error("GOOGLE ERROR:", data.error.message);
      return null;
    }

    const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return audioData || null;
  } catch (e) {
    console.error("Netwerk error:", e);
    return null;
  }
};