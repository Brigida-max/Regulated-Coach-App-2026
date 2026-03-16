const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";

// UNIVERSELE AI COACH FUNCTIE
export const getGeminiResponse = async (history: any[], message: string) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          ...history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content || h.text || "" }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        systemInstruction: { parts: [{ text: "Je bent de Regulated Identity Coach. Help de gebruiker in het Nederlands." }] }
      })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Geen antwoord van AI.";
  } catch (e) {
    return "Verbindingsfout. Controleer je internet.";
  }
};

// ALIASES (Zorgt dat de app de functie altijd vindt onder de juiste naam)
export const getCoachResponseStream = getGeminiResponse;
export const getChatResponse = getGeminiResponse;
export const getCoachResponse = getGeminiResponse;

// UNIVERSELE GELUID FUNCTIE (TTS)
export const generateSpeech = async (text: string) => {
  if (!text) return null;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Spreek dit uit: ${text}` }] }],
        generationConfig: {
          responseModalities: ["audio"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
        }
      })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) {
    return null;
  }
};