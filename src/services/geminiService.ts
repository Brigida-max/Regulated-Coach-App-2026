import { GoogleGenerativeAI } from "@google/genai";

const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";
const genAI = new GoogleGenerativeAI(apiKey);

// Cache voor audio om herhaling te voorkomen
const audioCache = new Map<string, string>();

export const generateSpeech = async (text: string) => {
  if (!text || text.trim().length === 0) return null;
  if (audioCache.has(text)) return audioCache.get(text);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Spreek de volgende tekst rustig en warm uit: ${text}` }] }],
      generationConfig: {
        responseModalities: ["audio" as any],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
      },
    });

    const base64Audio = (result.response as any).candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      audioCache.set(text, base64Audio);
      return base64Audio;
    }
    return null;
  } catch (error) {
    console.error("Audio Error:", error);
    return null;
  }
};

export const getCoachResponseStream = async (history: any[], message: string, userProfile?: any, onChunk?: (text: string) => void) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Je bent de 'Regulated Identity Coach'. Help de gebruiker vanuit rust en verbinding. Spreek Nederlands."
    });

    const sanitizedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text || "" }]
    }));

    const result = await model.generateContentStream({ contents: sanitizedHistory });

    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      onChunk?.(fullText);
    }
    return fullText;
  } catch (error) {
    console.error("Coach Error:", error);
    return "Er is een verbindingsfout. Probeer het later opnieuw.";
  }
};