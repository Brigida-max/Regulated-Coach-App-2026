import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";
const ai = new GoogleGenerativeAI(apiKey);

export async function generateSpeech(text: string) {
  if (!text || text.trim().length === 0) return null;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Spreek deze tekst rustig en warm uit: ${text}` }] }],
      generationConfig: {
        responseModalities: ["audio"],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
      },
    });

    return result.response;
  } catch (error) {
    console.error("Fout bij Gemini:", error);
    throw error;
  }
}