import { GoogleGenerativeAI } from "@google/generative-ai";

// In-memory cache for audio data to speed up repeated requests
const audioCache = new Map<string, string>();

// De API Sleutel direct in de code voor maximale stabiliteit op Vercel
const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";
const genAI = new GoogleGenerativeAI(apiKey);

export const generateSpeech = async (text: string) => {
  if (!text || text.trim().length === 0) {
    return null;
  }

  if (audioCache.has(text)) {
    return audioCache.get(text);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Spreek de volgende tekst rustig, warm en vrouwelijk uit in het Nederlands: ${text}` }] }],
      generationConfig: {
        responseModalities: ["audio"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      audioCache.set(text, base64Audio);
      return base64Audio;
    }
    
    return null;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    return null;
  }
};

export const getCoachResponseStream = async (history: any[], message: string, userProfile?: any, onChunk?: (text: string) => void) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `Je bent de 'Regulated Identity Coach', een expert in zenuwstelsel-regulatie. 
      Help de gebruiker uit Survival Identity naar Core Identity. Spreek Nederlands, wees empathisch en kortaf waar nodig.`
    });

    const sanitizedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text || "" }]
    }));

    const result = await model.generateContentStream({
      contents: sanitizedHistory,
    });

    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      onChunk?.(fullText);
    }

    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ik heb momenteel moeite met verbinden. Probeer het zo meteen nog eens.";
  }
};