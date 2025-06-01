
export interface Scene {
  id: string;
  prompt: string; // Original user prompt for the scene
  fullPrompt: string; // Prompt sent to Gemini, potentially with suffixes
  imageUrl?: string; // base64 data URL
  status: 'pending' | 'generating' | 'completed' | 'error';
  error?: string;
}
    