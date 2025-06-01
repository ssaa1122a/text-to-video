
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          AI Animated Storyboard Generator
        </h1>
        <p className="text-sm text-gray-400 mt-1">Turn your stories into visual scenes.</p>
      </div>
    </header>
  );
};
    