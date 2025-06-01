
export const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-002';
export const MAX_SCENES_PER_GENERATION = 10; // Limit number of scenes generated at once
export const IMAGE_GENERATION_PROMPT_SUFFIX = "Epic cinematic still, detailed, vibrant colors, anime movie style.";

// Placeholder for API Key, ensure it's set in your environment
// The application will try to use process.env.API_KEY directly
// For local development, you might need to set this up using a .env file and a bundler like Vite or Webpack
// Or, if this app is run in an environment like Google's Project IDX, it might be available.
// THIS IS A CRITICAL ASSUMPTION. THE APP WILL FAIL IF process.env.API_KEY IS NOT AVAILABLE.
if (typeof process === 'undefined' || typeof process.env === 'undefined') {
  // @ts-ignore
  window.process = { env: {} }; // Mock process.env for browser if it doesn't exist
}
// Ensure API_KEY is at least an empty string if not set, to avoid undefined errors.
// The geminiService will handle actual check or rely on SDK to throw error.
// It's better if the build environment defines this.
// Example: process.env.API_KEY = process.env.API_KEY || "YOUR_FALLBACK_API_KEY_FOR_DEV_ONLY_NOT_FOR_PROD";
// However, per instructions, we must assume it's configured.

    