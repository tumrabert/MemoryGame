"use client";

import { useState } from "react";
import { useGame } from "../components/GameProvider";
import TimePicker from "../components/TimePicker";

export default function SettingsScreen() {
  const { updateSettings, startGame } = useGame();
  const [memorizeTime, setMemorizeTime] = useState("02:00");
  const [answerTime, setAnswerTime] = useState("02:00");

  const handleStartGame = () => {
    updateSettings({
      memorizeTime,
      answerTime,
    });
    startGame();
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Pilot Memorize Game</h1>

      <div className="w-full">
        <div className="mb-8">
          <TimePicker
            id="memorizeTime"
            label="Memorize Time (mm:ss):"
            value={memorizeTime}
            onChange={setMemorizeTime}
          />
        </div>

        <div className="mb-8">
          <TimePicker
            id="answerTime"
            label="Answer Time (mm:ss):"
            value={answerTime}
            onChange={setAnswerTime}
          />
        </div>
      </div>

      <button
        onClick={handleStartGame}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl"
      >
        Start Game
      </button>
    </div>
  );
}
