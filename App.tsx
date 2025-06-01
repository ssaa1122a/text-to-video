
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StoryInputForm } from './components/StoryInputForm';
import { VideoPlayer } from './components/VideoPlayer';
import { ErrorMessage } from './components/ErrorMessage';
import { generateImage } from './services/geminiService';
import type { Scene } from './types';
import { MAX_SCENES_PER_GENERATION, IMAGE_GENERATION_PROMPT_SUFFIX } from './constants';

const App: React.FC = () => {
  const [storyText, setStoryText] = useState<string>('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sceneDuration, setSceneDuration] = useState<number>(3000); // Default 3 seconds

  const handleStorySubmit = useCallback(async (newStoryText: string) => {
    setStoryText(newStoryText);
    setError(null);
    setIsLoading(true);
    setScenes([]); // Reset scenes
    setCurrentSceneIndex(0);
    setIsPlaying(false);

    const scenePrompts = newStoryText
      .split(/\n\s*\n/)
      .map(prompt => prompt.trim())
      .filter(prompt => prompt.length > 0)
      .slice(0, MAX_SCENES_PER_GENERATION);

    if (scenePrompts.length === 0) {
      setError("Please provide some text to generate scenes.");
      setIsLoading(false);
      return;
    }
    
    const initialScenes: Scene[] = scenePrompts.map((prompt, index) => ({
      id: `scene-${index}-${Date.now()}`,
      prompt: prompt,
      fullPrompt: `${prompt} ${IMAGE_GENERATION_PROMPT_SUFFIX}`,
      imageUrl: undefined,
      status: 'pending',
    }));
    setScenes(initialScenes);

    let anyError = false;
    for (let i = 0; i < initialScenes.length; i++) {
      const sceneToProcess = initialScenes[i];
      setScenes(prevScenes => 
        prevScenes.map(s => s.id === sceneToProcess.id ? { ...s, status: 'generating' } : s)
      );
      try {
        const imageDataUrl = await generateImage(sceneToProcess.fullPrompt);
        setScenes(prevScenes =>
          prevScenes.map(s => s.id === sceneToProcess.id ? { ...s, imageUrl: imageDataUrl, status: 'completed' } : s)
        );
      } catch (err) {
        console.error(`Error generating image for scene ${i + 1}:`, err);
        anyError = true;
        setScenes(prevScenes =>
          prevScenes.map(s => s.id === sceneToProcess.id ? { ...s, status: 'error', error: (err as Error).message || 'Failed to generate image' } : s)
        );
      }
    }
    if (anyError) {
      setError("Some images could not be generated. Please check individual scenes.");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && scenes.length > 0) {
      timer = setTimeout(() => {
        setCurrentSceneIndex(prevIndex => (prevIndex + 1) % scenes.length);
      }, sceneDuration); // Use sceneDuration state
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentSceneIndex, scenes.length, sceneDuration]); // Add sceneDuration to dependency array

  const handlePlayPause = () => {
    if (scenes.length > 0) {
      setIsPlaying(prev => !prev);
    }
  };

  const handleNextScene = () => {
    if (scenes.length > 0) {
      setCurrentSceneIndex(prevIndex => (prevIndex + 1) % scenes.length);
      setIsPlaying(false); 
    }
  };

  const handlePrevScene = () => {
    if (scenes.length > 0) {
      setCurrentSceneIndex(prevIndex => (prevIndex - 1 + scenes.length) % scenes.length);
      setIsPlaying(false);
    }
  };
  
  const handleGoToScene = (index: number) => {
    if (index >= 0 && index < scenes.length) {
      setCurrentSceneIndex(index);
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 space-y-6">
          <StoryInputForm onSubmit={handleStorySubmit} isLoading={isLoading} />
          
          <div className="bg-gray-800 p-4 rounded-lg shadow-xl">
            <label htmlFor="sceneDuration" className="block text-sm font-medium text-gray-300 mb-1">
              Scene Duration (ms)
            </label>
            <input
              type="number"
              id="sceneDuration"
              name="sceneDuration"
              value={sceneDuration}
              onChange={(e) => setSceneDuration(Math.max(500, parseInt(e.target.value, 10) || 3000))}
              className="w-full p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition"
              disabled={isLoading}
              min="500"
              step="100"
            />
          </div>
          {error && <ErrorMessage message={error} className="mt-4" />}
        </div>
        <div className="lg:w-2/3">
          {scenes.length > 0 || isLoading ? (
            <VideoPlayer
              scenes={scenes}
              currentSceneIndex={currentSceneIndex}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onNext={handleNextScene}
              onPrev={handlePrevScene}
              onGoToScene={handleGoToScene}
              isLoadingGlobal={isLoading && scenes.every(s => s.status === 'pending' || s.status === 'generating')}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-800 rounded-lg p-8 shadow-xl min-h-[40vh] lg:min-h-[60vh]">
              <p className="text-gray-400 text-xl text-center">Enter your story to generate an animated storyboard.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;