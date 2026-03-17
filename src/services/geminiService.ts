const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";

// AI COACH TEKST FUNCTIE
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
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Ik heb moeite met antwoorden.";
  } catch (e) {
    return "Verbindingsfout.";
  }
};

export const getCoachResponseStream = getGeminiResponse;
export const getChatResponse = getGeminiResponse;

// GELUID FUNCTIE (TTS) - De cruciale fix
export const generateSpeech = async (text: string) => {
  if (!text) return null;
  try {
    // We gebruiken hier gemini-1.5-flash, omdat die TTS ondersteunt in v1beta
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ["audio"], // Kleine letters proberen (soms is dat het verschil)
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: "Puck" } // We proberen Puck (Nederlands) ipv Kore
            } 
          }
        }
      })
    });

    const data = await response.json();
    
    // Controleer of er een error in het antwoord van Google zit
    if (data.error) {
      console.error("Google API Error:", data.error.message);
      return null;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) {
    console.error("Audio error:", e);
    return null;
  }
};