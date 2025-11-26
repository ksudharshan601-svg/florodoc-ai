import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DiseaseAnalysisResult } from "../types";

// Initialize Gemini Client
// CRITICAL: API Key must come from environment variables for Vercel/Security
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isPlant: {
      type: Type.BOOLEAN,
      description: "True if the image contains a plant or leaf, false otherwise.",
    },
    plantName: {
      type: Type.STRING,
      description: "Common name of the plant identified.",
    },
    condition: {
      type: Type.STRING,
      description: "The name of the disease detected, or 'Healthy' if no disease is found.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score of the diagnosis from 0 to 100.",
    },
    description: {
      type: Type.STRING,
      description: "A brief summary of the condition.",
    },
    symptoms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of visual symptoms identified.",
    },
    causes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Potential causes of the disease (fungal, bacterial, pests, etc.).",
    },
    treatments: {
      type: Type.OBJECT,
      properties: {
        organic: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Organic or home remedies.",
        },
        chemical: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Chemical fungicides or pesticides.",
        },
      },
    },
    prevention: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Steps to prevent future outbreaks.",
    },
  },
  required: ["isPlant", "plantName", "condition", "confidence", "symptoms", "treatments"],
};

export const analyzePlantImage = async (base64Image: string): Promise<DiseaseAnalysisResult> => {
  // Extract MIME type and base64 data
  // Expected format: "data:image/png;base64,..."
  let mimeType = "image/jpeg";
  let base64Data = base64Image;

  // Robust parsing of data URI using indexOf to avoid issues with potential extra commas in headers
  const commaIndex = base64Image.indexOf(",");
  if (commaIndex !== -1) {
    const header = base64Image.slice(0, commaIndex);
    base64Data = base64Image.slice(commaIndex + 1);
    
    const match = header.match(/:(.*?);/);
    if (match) {
      mimeType = match[1];
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: "You are an expert plant pathologist. Analyze this image. If it is not a plant, set isPlant to false and leave other fields empty or generic. If it is a plant, identify it, detect any diseases, and provide detailed treatments. Return the result in JSON format.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more deterministic/factual results
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("No response from Gemini API");
    }

    const result = JSON.parse(textResponse) as DiseaseAnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};