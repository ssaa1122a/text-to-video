
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} AI Storyboard Generator. Powered by Gemini.</p>
      </div>
    </footer>
  );
};
    