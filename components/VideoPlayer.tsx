
import React from 'react';
import type { Scene } from '../types';
import { SceneCard } from './SceneCard';
import { LoadingSpinner } from './LoadingSpinner';

interface VideoPlayerProps {
  scenes: Scene[];
  currentSceneIndex: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onGoToScene: (index: number) => void;
  isLoadingGlobal: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  scenes,
  currentSceneIndex,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onGoToScene,
  isLoadingGlobal
}) => {
  const currentScene = scenes[currentSceneIndex];

  if (isLoadingGlobal && scenes.length === 0) {
     return (
      <div className="w-full h-[60vh] bg-gray-800 rounded-lg shadow-xl flex flex-col items-center justify-center p-4">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-400">Preparing your storyboard...</p>
      </div>
    );
  }
  
  if (!scenes || scenes.length === 0) {
    return (
      <div className="w-full h-[60vh] bg-gray-800 rounded-lg shadow-xl flex flex-col items-center justify-center p-4">
        <p className="text-gray-400">No scenes to display yet. Generate a storyboard first.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-xl flex flex-col overflow-hidden">
      {/* Main Scene Display */}
      <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden"> {/* Added overflow-hidden for Ken Burns */}
        {currentScene && <SceneCard scene={currentScene} isActive={true} />}
         {!currentScene && scenes.length > 0 && <SceneCard scene={scenes[0]} isActive={true} /> /* Fallback to first if index is out of bounds temporarily */}
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-700/50 flex items-center justify-center space-x-3 sm:space-x-4">
        <button
          onClick={onPrev}
          disabled={scenes.length <= 1}
          className="p-2 sm:p-3 rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-white"
          aria-label="Previous Scene"
        >
          {/* Updated Previous Scene Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={onPlayPause}
          disabled={scenes.length === 0}
          className="p-3 sm:p-4 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-white"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          )}
        </button>
        <button
          onClick={onNext}
          disabled={scenes.length <= 1}
          className="p-2 sm:p-3 rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-white"
          aria-label="Next Scene"
        >
          {/* Updated Next Scene Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Thumbnails / Scene Selector */}
      {scenes.length > 1 && (
        <div className="p-3 bg-gray-900/70 overflow-x-auto whitespace-nowrap">
          <div className="flex space-x-2 justify-center">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              onClick={() => onGoToScene(index)}
              className={`w-16 h-10 sm:w-24 sm:h-14 rounded border-2 transition-all duration-150 ease-in-out
                          ${index === currentSceneIndex ? 'border-purple-500 scale-105' : 'border-gray-600 hover:border-purple-400'}
                          bg-black flex items-center justify-center overflow-hidden group relative`}
              aria-label={`Go to scene ${index + 1}`}
            >
              {scene.status === 'generating' && <LoadingSpinner size="sm" />}
              {scene.status === 'error' && <span className="text-red-500 text-xl">!</span>}
              {scene.imageUrl && (
                <img src={scene.imageUrl} alt={`Scene ${index + 1} thumbnail`} className="w-full h-full object-cover" />
              )}
              {!scene.imageUrl && scene.status !== 'generating' && scene.status !== 'error' && (
                 <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500 text-xs">{(index + 1)}</div>
              )}
              <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[0.6rem] py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                Scene {index + 1}
              </span>
            </button>
          ))}
          </div>
        </div>
      )}
    </div>
  );
};
