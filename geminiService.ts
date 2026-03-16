import { GoogleGenerativeAI, Modality } from "@google/genai";

const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";
const genAI = new GoogleGenerativeAI(apiKey);

export const generateSpeech = async (text: string) => {
  if (!text || text.trim().length === 0) return null;

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Spreek de volgende tekst rustig, warm en vrouwelijk uit in het Nederlands: ${text}` }] }],
      generationConfig: {
        responseModalities: ["audio" as any],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        }
      }
    });

    return response.response;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};