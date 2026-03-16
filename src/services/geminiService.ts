const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";

// Deze functie regelt het geluid
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

// Deze functie regelt de tekst van de coach
export const getCoachResponseStream = async (history: any[], message: string, userProfile?: any, onChunk?: (text: string) => void) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })), { role: 'user', parts: [{ text: message }] }],
        systemInstruction: { parts: [{ text: "Je bent de Regulated Identity Coach. Help de gebruiker in het Nederlands." }] }
      })
    });
    const data = await response.json();
    const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Ik kon geen antwoord genereren.";
    if (onChunk) onChunk(fullText);
    return fullText;
  } catch (e) {
    return "Verbindingsfout met de coach.";
  }
};