import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCwzKd6oh-H7E5g-iSVkQ-ZgwtMjJ4P2Zo";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateSpeech(text: string) {
  if (!text || text.trim().length === 0) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Spreek de volgende tekst rustig, warm en vrouwelijk uit in het Nederlands: ${text}` }] }],
      generationConfig: {
        responseModalities: ["audio"],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
      },
    });

    return response.response;
  } catch (error) {
    console.error("Fout bij Gemini:", error);
    return null;
  }
}