const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";

// DE HOOFDFUNCTIE
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
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Geen tekst ontvangen:", data);
      return "Ik hoor je, maar ik kan momenteel geen antwoord formuleren.";
    }

    return text;
  } catch (e) {
    console.error("Verbindingsfout:", e);
    return "Er is een probleem met de verbinding. Probeer het over een momentje opnieuw.";
  }
};

// ALIASES: We voegen er eentje toe die vaak in AI Studio templates zit
export const getCoachResponse = getGeminiResponse;
export const getCoachResponseStream = getGeminiResponse;
export const sendMessage = getGeminiResponse; 

// AUDIO FUNCTIE
export const generateSpeech = async (text: string) => {
  if (!text) return null;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } }
        }
      })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) {
    return null;
  }
};