import { GoogleGenerativeAI } from "@google/generative-ai";

// We gebruiken de sleutel direct om configuratiefouten te voorkomen
const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";
const genAI = new GoogleGenerativeAI(apiKey);

export const generateSpeech = async (text: string) => {
  if (!text) return null;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Spreek dit uit: ${text}` }] }],
      generationConfig: {
        responseModalities: ["audio"],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
      }
    });
    return result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getCoachResponseStream = async (history: any[], message: string, userProfile?: any, onChunk?: (text: string) => void) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text || "" }]
      }))
    });

    const result = await chat.sendMessageStream(message);
    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) onChunk(fullText);
    }
    return fullText;
  } catch (e) {
    return "Ik kan momenteel geen verbinding maken. Controleer de console.";
  }
};