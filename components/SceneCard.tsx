
import React from 'react';
import type { Scene } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface SceneCardProps {
  scene: Scene;
  isActive: boolean; // If this card is the main one being displayed
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene, isActive }) => {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center text-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}>
      {scene.status === 'generating' && (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm">Generating image for: "{scene.prompt.substring(0,50)}..."</p>
        </div>
      )}
      {scene.status === 'error' && (
        <div className="p-4 bg-red-800/20 rounded-md w-full h-full flex flex-col items-center justify-center">
          <p className="text-red-400 font-semibold">Error generating image</p>
          <p className="text-xs text-red-500 mt-1">{scene.error || 'Unknown error'}</p>
          <p className="text-xs text-gray-400 mt-2">Prompt: "{scene.prompt}"</p>
        </div>
      )}
      {scene.status === 'completed' && scene.imageUrl && (
        <>
          <img
            src={scene.imageUrl}
            alt={scene.prompt}
            className={`max-w-full max-h-full object-contain animate-fadeInImage ${isActive ? 'animate-kenBurnsActive' : ''}`}
          />
          <p className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded-md shadow-lg max-w-[95%] mx-auto truncate">
            {scene.prompt}
          </p>
        </>
      )}
      {scene.status === 'pending' && (
         <div className="flex flex-col items-center justify-center text-gray-500">
          <p className="text-sm">Scene pending: "{scene.prompt.substring(0,50)}..."</p>
        </div>
      )}
    </div>
  );
};
