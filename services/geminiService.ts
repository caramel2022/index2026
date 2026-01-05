import { GoogleGenAI } from "@google/genai";
import { CompetencyRow } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePerformanceReport = async (data: CompetencyRow[]): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    تحليل بيانات أداء التلاميذ التالية وتقديم تقرير مفصل:
    
    ${JSON.stringify(data.map(d => ({ code: d.code, desc: d.description, mastery: d.mastery })))}

    المطلوب:
    1. تحديد نقاط القوة (الكفايات ذات نسبة تحكم عالية).
    2. تحديد نقاط الضعف (الكفايات ذات نسبة تحكم منخفضة).
    3. تقديم توصيات تربوية وعلاجية محددة لتحسين الأداء في نقاط الضعف.
    4. اجعل التقرير بصيغة Markdown، واستخدم عناوين واضحة باللغة العربية.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "لم يتم إنشاء التقرير.";
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