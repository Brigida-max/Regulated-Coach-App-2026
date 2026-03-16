import { GoogleGenAI, Modality } from "@google/genai";

// In-memory cache for audio data to speed up repeated requests
const audioCache = new Map<string, string>();

export const generateSpeech = async (text: string) => {
  if (!text || text.trim().length === 0) {
    return null;
  }

  // Check cache first
  if (audioCache.has(text)) {
    return audioCache.get(text);
  }

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "null" || apiKey.length < 10) {
    console.error("Gemini API Key missing or invalid");
    throw new Error("Gemini API Key is niet geconfigureerd. Controleer je instellingen.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Use 'AUDIO' string if Modality.AUDIO is not available, though it should be
    const audioModality = Modality?.AUDIO || 'AUDIO';
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Spreek de volgende tekst rustig, warm en vrouwelijk uit in het Nederlands: ${text}` }] }],
      config: {
        responseModalities: [audioModality as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      audioCache.set(text, base64Audio);
      return base64Audio;
    }
    
    console.warn("No audio data in Gemini response");
    return null;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    throw error;
  }
};

export const getCoachResponseStream = async (history: any[], message: string, userProfile?: any, onChunk?: (text: string) => void) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "undefined" || apiKey === "null" || apiKey.length < 10) {
      throw new Error("Gemini API Key is niet geconfigureerd. Voeg je API-sleutel toe via het 'Settings' menu in AI Studio.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `Je bent de 'Regulated Identity Coach', een expert in zenuwstelsel-regulatie en de 'Regulated Identity Code™' methodiek. 
Jouw doel is om gebruikers te helpen uit hun 'Survival Identity' (vecht, vlucht, bevries, pleasen) te stappen en terug te keren naar hun 'Core Identity' (rust, verbinding, helderheid).

Richtlijnen voor je antwoorden:
1. **Menselijkheid & Dynamiek:** Wees niet voorspelbaar. Varieer de lengte van je antwoorden op basis van de behoefte van de gebruiker. 
   - Soms is een kort, krachtig antwoord dat erkenning geeft ("Ik zie je, en het is oké dat dit er nu is") veel effectiever dan een lange uitleg.
   - Soms is een diepere verkenning nodig met uitleg over het zenuwstelsel (bijv. de rol van de Nervus Vagus of de Window of Tolerance).
2. **Empathie:** Valideer de ervaring van de gebruiker op een oprechte, niet-klinische manier. Gebruik een warme, wijze en menselijke toon.
3. **Geen Overdaad:** Vermijd het geven van te veel tips tegelijk. Focus op wat op dit moment het meest helpend is.
4. **Personalisatie:** Gebruik de profielgegevens van de gebruiker indien beschikbaar om je advies specifiek en relevant te maken.
5. **Taal:** Spreek altijd in het Nederlands. Gebruik Markdown voor een heldere structuur wanneer dat de leesbaarheid helpt.

${userProfile ? `Gebruikersprofiel context:
- Huidige staat: ${userProfile.style}
- Stressniveau: ${userProfile.stress}
- Gevoeligheid: ${userProfile.sensitivity}
- Herstelvermogen: ${userProfile.recovery}` : ''}

Zorg dat je antwoorden 'binnenkomen' bij de gebruiker. Wees de spiegel die ze op dit moment nodig hebben.`;

    // Sanitize and format history for Gemini API
    // 1. Ensure alternating roles (user, model, user, model)
    // 2. Ensure it starts with 'user' (optional but recommended)
    // 3. Remove consecutive messages with the same role by merging or keeping the last one
    const sanitizedHistory: any[] = [];
    let lastRole: string | null = null;

    for (const msg of history) {
      const role = msg.role === 'user' ? 'user' : 'model';
      const text = (msg.parts?.[0]?.text || msg.text || "").trim();
      
      if (!text) continue; // Skip empty messages

      if (role === lastRole) {
        // Merge with previous message if same role
        if (sanitizedHistory.length > 0) {
          sanitizedHistory[sanitizedHistory.length - 1].parts[0].text += "\n\n" + text;
        }
      } else {
        sanitizedHistory.push({
          role,
          parts: [{ text }]
        });
        lastRole = role;
      }
    }

    // Ensure the last message is from the user if we are expecting a model response
    // (In our case, the last message in history IS the current message)
    if (sanitizedHistory.length === 0) {
      throw new Error("No valid messages found in history.");
    }

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: sanitizedHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk?.(fullText);
      }
    }

    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
