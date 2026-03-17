const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";

// 1. De Coach Tekst Functie
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
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Ik kan nu even niet antwoorden.";
  } catch (e) {
    return "Verbindingsfout.";
  }
};

// Aliassen voor je app-onderdelen
export const getCoachResponseStream = getGeminiResponse;
export const getChatResponse = getGeminiResponse;

// 2. De Geluid (TTS) Functie - DIT MOET DE 404 OPLOSSEN
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
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: "Puck" } 
            } 
          }
        }
      })
    });

    const data = await response.json();
    
    // Cruciaal: We vissen de audio uit de v1beta structuur
    const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!audioData) {
      console.error("Geen audio in Google response:", data);
      return null;
    }
    
    return audioData;
  } catch (e) {
    console.error("Audio error:", e);
    return null;
  }
};