
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ModelType, IntelligenceBrief } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const fetchIntelligenceBrief = async (topic: string): Promise<IntelligenceBrief> => {
  const ai = getAIClient();
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: ModelType.FLASH,
    contents: `Provide a high-level executive summary of the latest trends in: ${topic}. Focus on strategic implications for business leaders.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "Unable to generate brief.";
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = chunks
    .filter((c: any) => c.web)
    .map((c: any) => ({
      title: c.web.title || "Reference",
      uri: c.web.uri,
    }));

  return { summary: text, sources };
};

export const chatWithGemini = async (
  message: string,
  history: { role: string; content: string }[],
  model: ModelType = ModelType.FLASH
) => {
  const ai = getAIClient();
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: "You are an executive AI assistant. Your responses are professional, concise, and highly accurate. If providing code, use Python by default.",
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const generateImage = async (
  prompt: string,
  model: ModelType = ModelType.NANO_BANANA,
  aspectRatio: "1:1" | "16:9" | "9:16" = "1:1"
): Promise<string | undefined> => {
  const ai = getAIClient();
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: model === ModelType.NANO_BANANA_PRO ? "1K" : undefined
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};

export const generateVideo = async (
  prompt: string,
  resolution: '720p' | '1080p' = '720p',
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string | undefined> => {
  const ai = getAIClient();
  let operation = await ai.models.generateVideos({
    model: ModelType.VEO,
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution,
      aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) return undefined;
  
  return `${downloadLink}&key=${process.env.API_KEY}`;
};

export const downloadVideoAsset = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Media export failed. Please verify network permissions.");
  }
};

export const editImage = async (
  prompt: string,
  base64Image: string,
  mimeType: string,
  model: ModelType = ModelType.NANO_BANANA
): Promise<string | undefined> => {
  const ai = getAIClient();
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};
