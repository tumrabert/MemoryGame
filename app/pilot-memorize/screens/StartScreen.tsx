"use client";

import { useState } from 'react';
import { useGame } from '../components/GameProvider';

export default function StartScreen() {
  const { game, updateSettings, startGame } = useGame();
  const settings = game.getSettings();
  
  const [memorizeTime, setMemorizeTime] = useState(settings.memorizeTime);
  const [answerTime, setAnswerTime] = useState(settings.answerTime);
  const [error, setError] = useState('');

  const validateTimeFormat = (time: string): boolean => {
    return /^\d{2}:\d{2}$/.test(time);
  };

  const handleStart = () => {
    // Validate time format
    if (!validateTimeFormat(memorizeTime) || !validateTimeFormat(answerTime)) {
      setError('Please enter time in mm:ss format');
      return;
    }
    
    // Update settings and start game
    updateSettings({ memorizeTime, answerTime });
    startGame();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">Game Settings</h2>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="w-full">
        <label className="block text-sm font-medium mb-1">
          Memorize Time (mm:ss)
        </label>
        <input
          type="text"
          value={memorizeTime}
          onChange={(e) => setMemorizeTime(e.target.value)}
          placeholder="02:00"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="w-full">
        <label className="block text-sm font-medium mb-1">
          Answer Time (mm:ss)
        </label>
        <input
          type="text"
          value={answerTime}
          onChange={(e) => setAnswerTime(e.target.value)}
          placeholder="02:00"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button
        onClick={handleStart}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start Game
      </button>
    </div>
  );
}
