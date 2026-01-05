import { GoogleGenAI } from "@google/genai";
import { CompetencyRow } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePerformanceReport = async (data: CompetencyRow[]): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    ØªØ­ÙÙÙ Ø¨ÙØ§ÙØ§Øª Ø£Ø¯Ø§Ø¡ Ø§ÙØªÙØ§ÙÙØ° Ø§ÙØªØ§ÙÙØ© ÙØªÙØ¯ÙÙ ØªÙØ±ÙØ± ÙÙØµÙ:
    
    ${JSON.stringify(data.map(d => ({ code: d.code, desc: d.description, mastery: d.mastery })))}

    Ø§ÙÙØ·ÙÙØ¨:
    1. ØªØ­Ø¯ÙØ¯ ÙÙØ§Ø· Ø§ÙÙÙØ© (Ø§ÙÙÙØ§ÙØ§Øª Ø°Ø§Øª ÙØ³Ø¨Ø© ØªØ­ÙÙ Ø¹Ø§ÙÙØ©).
    2. ØªØ­Ø¯ÙØ¯ ÙÙØ§Ø· Ø§ÙØ¶Ø¹Ù (Ø§ÙÙÙØ§ÙØ§Øª Ø°Ø§Øª ÙØ³Ø¨Ø© ØªØ­ÙÙ ÙÙØ®ÙØ¶Ø©).
    3. ØªÙØ¯ÙÙ ØªÙØµÙØ§Øª ØªØ±Ø¨ÙÙØ© ÙØ¹ÙØ§Ø¬ÙØ© ÙØ­Ø¯Ø¯Ø© ÙØªØ­Ø³ÙÙ Ø§ÙØ£Ø¯Ø§Ø¡ ÙÙ ÙÙØ§Ø· Ø§ÙØ¶Ø¹Ù.
    4. Ø§Ø¬Ø¹Ù Ø§ÙØªÙØ±ÙØ± Ø¨ØµÙØºØ© MarkdownØ ÙØ§Ø³ØªØ®Ø¯Ù Ø¹ÙØ§ÙÙÙ ÙØ§Ø¶Ø­Ø© Ø¨Ø§ÙÙØºØ© Ø§ÙØ¹Ø±Ø¨ÙØ©.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "ÙÙ ÙØªÙ Ø¥ÙØ´Ø§Ø¡ Ø§ÙØªÙØ±ÙØ±.";
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};

export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    // Determine MIME type from base64 string
    const mimeType = base64Image.substring(base64Image.indexOf(":") + 1, base64Image.indexOf(";"));
    const data = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: mimeType, 
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Extract image from response parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image generated");

  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};