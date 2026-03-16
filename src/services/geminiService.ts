const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";

// 1. De hoofdfunctie voor de AI Coach tekst
export const getGeminiResponse = async (history: any[], message: string) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          ...history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text || h.content || "" }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        systemInstruction: { parts: [{ text: "Je bent de Regulated Identity Coach. Help de gebruiker in het Nederlands vanuit rust en verbinding." }] }
      })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Ik kan momenteel geen antwoord formuleren.";
  } catch (e) {
    console.error("Coach Error:", e);
    return "Er is een verbindingsfout met de coach.";
  }
};

// 2. Extra namen toevoegen voor het geval je app die gebruikt
export const getCoachResponseStream = getGeminiResponse;
export const getChatResponse = getGeminiResponse;

// 3. De functie voor het geluid (TTS)
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
    console.error("Audio Error:", e);
    return null;
  }
};