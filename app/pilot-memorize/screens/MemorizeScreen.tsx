"use client";

import { useEffect } from "react";
import { useGame } from "../components/GameProvider";
import ImageGrid from "../components/ImageGrid";
import Timer from "../components/Timer";

export default function MemorizeScreen() {
  const { game, moveToAnswerStage } = useGame();
  const settings = game.getSettings();
  const originalGrid = game.getOriginalGrid();

  // Add this effect to ensure automatic transition when time is up
  useEffect(() => {
    const timeInSeconds = parseTimeToSeconds(settings.memorizeTime);

    console.log(
      `Timer started: ${settings.memorizeTime} (${timeInSeconds} seconds)`
    );

    // Set a direct timeout to move to next stage
    const timer = setTimeout(() => {
      console.log("Time's up! Moving to answer stage...");
      moveToAnswerStage();
    }, timeInSeconds * 1000);

    // Cleanup on unmount
    return () => clearTimeout(timer);
  }, [settings.memorizeTime, moveToAnswerStage]);

  // Helper function to parse "MM:SS" to seconds
  function parseTimeToSeconds(timeStr: string): number {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    return minutes * 60 + seconds;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Memorize the Grid</h2>

      <div className="flex flex-col items-center gap-2">
        <p className="text-lg">Time Remaining:</p>
        <Timer
          initialTimeStr={settings.memorizeTime}
          onTimeEnd={() => {
            console.log("Timer component called onTimeEnd");
            moveToAnswerStage();
          }}
          isActive={true}
        />
      </div>

      {/* Add a debug button for testing */}
      {/* <button
        onClick={() => moveToAnswerStage()}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Next Stage (Debug)
      </button> */}

      <div className="w-full max-w-md">
        <ImageGrid images={originalGrid} />
      </div>
    </div>
  );
}
