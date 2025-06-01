
import { GoogleGenAI, GenerateImagesResponse } from "@google/genai";
import { GEMINI_IMAGE_MODEL } from '../constants';

// IMPORTANT: This service assumes `process.env.API_KEY` is set in the environment.
// The application's build process or hosting environment MUST provide this variable.
// DO NOT add UI for API key input.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

const getGoogleGenAI = (): GoogleGenAI => {
  if (!API_KEY) {
    console.error("API_KEY is not configured in process.env.API_KEY. Image generation will fail.");
    throw new Error("API_KEY is not configured. Please set the API_KEY environment variable.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const genAIInstance = getGoogleGenAI();
    
    const response: GenerateImagesResponse = await genAIInstance.models.generateImages({
      model: GEMINI_IMAGE_MODEL,
      prompt: prompt,
      config: { 
        numberOfImages: 1, 
        outputMimeType: 'image/png' // or 'image/jpeg'
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      console.error("No image data received from API or unexpected response structure:", response);
      throw new Error('No image data received from API.');
    }
  } catch (error) {
    console.error('Error generating image via Gemini API:', error);
    // Check for specific Gemini API error structures if available, or rethrow
    if (error instanceof Error) {
        // Attempt to find more specific error messages if they exist
        const errorDetails = (error as any).message || (error as any).details || 'Unknown Gemini API error';
        if (errorDetails.includes("API_KEY_INVALID") || errorDetails.includes("API key not valid")) {
             throw new Error("Invalid API Key. Please ensure your API_KEY environment variable is correct.");
        }
        if (errorDetails.includes("Quota exceeded")) {
            throw new Error("API Quota Exceeded. Please check your Gemini API usage limits.");
        }
        throw new Error(`Gemini API error: ${errorDetails}`);
    }
    throw new Error('Failed to generate image due to an unknown error.');
  }
};
