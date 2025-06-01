
import React, { useState } from 'react';
import { MAX_SCENES_PER_GENERATION } from '../constants';

interface StoryInputFormProps {
  onSubmit: (storyText: string) => void;
  isLoading: boolean;
}

export const StoryInputForm: React.FC<StoryInputFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-xl space-y-4">
      <div>
        <label htmlFor="storyText" className="block text-lg font-medium text-gray-300 mb-1">
          Your Story / Script
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Enter your story. Each paragraph will be treated as a new scene prompt.
          Max {MAX_SCENES_PER_GENERATION} scenes per generation.
        </p>
        <textarea
          id="storyText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
          placeholder="Once upon a time, in a land far away...\n\nA brave knight ventured into a dark forest.\n\nHe discovered a hidden cave glowing with magical light."
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Scenes...
          </>
        ) : (
          'Generate Storyboard'
        )}
      </button>
    </form>
  );
};
    