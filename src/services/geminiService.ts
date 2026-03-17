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
            parts: [{ text: String(h.content || h.text || "") }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        systemInstruction: { parts: [{ text: "Je bent de Regulated Identity Coach. Help de gebruiker in het Nederlands vanuit rust en verbinding." }] }
      })
    });
    
    const data = await response.json();
    // We halen de tekst op de juiste manier uit de nieuwe Google structuur
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return aiText || "Ik kon geen antwoord genereren. Probeer het opnieuw.";
  } catch (e) {
    console.error("Coach Error:", e);
    return "Er is een verbindingsfout. Controleer je internet.";
  }
};

// Zorg dat de app de functie altijd vindt
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
        contents: [{ parts: [{ text: text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"], // Hoofdletters zijn belangrijk voor v1beta
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: "Kore" } 
            } 
          }
        }
      })
    });

    const data = await response.json();
    // Hier zat de 404/fout: we moeten de data heel specifiek uitlezen
    const audioBase64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!audioBase64) {
      console.warn("Google stuurde geen audio terug. Check de tekst.");
      return null;
    }
    return audioBase64;
  } catch (e) {
    console.error("Audio API Error:", e);
    return null;
  }
};