"use client";

import { useGame } from "../components/GameProvider";
import ImageGrid from "../components/ImageGrid";
import DraggableImage from "../components/DraggableImage";
import Timer from "../components/Timer";
import { ImagePosition } from "../models/Game";
import { useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function AnswerScreen() {
  const {
    game,
    submitAnswers,
    playerAnswers,
    updatePlayerAnswer,
    availableImages,
  } = useGame();

  const settings = game.getSettings();

  const handleSubmit = useCallback(() => {
    const validAnswers = playerAnswers
      .map((answer, index) => 
        answer ? { ...answer, position: index } : null)
      .filter((answer): answer is ImagePosition => answer !== null && typeof answer.position === "number");
    
    console.log("Submitting answers with positions:", validAnswers);
    submitAnswers(validAnswers as ImagePosition[]);
  }, [submitAnswers, playerAnswers]);

  function parseTimeToSeconds(timeStr: string): number {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    return minutes * 60 + seconds;
  }

  useEffect(() => {
    const timeInSeconds = parseTimeToSeconds(settings.answerTime);
    console.log(
      `Answer timer started: ${settings.answerTime} (${timeInSeconds} seconds)`
    );

    // Set a direct timeout to submit answers
    const timer = setTimeout(() => {
      console.log("Answer time's up! Submitting answers...");
      handleSubmit();
    }, timeInSeconds * 1000);

    // Cleanup on unmount
    return () => clearTimeout(timer);
  }, [settings.answerTime, handleSubmit]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold">Reconstruct the Grid</h2>

        <div className="flex flex-col items-center gap-2">
          <p className="text-lg">Time Remaining:</p>
          <Timer
            initialTimeStr={settings.answerTime}
            onTimeEnd={handleSubmit}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-start">
          {/* Left side - Answer grid */}
          <div className="w-full max-w-md">
            <h3 className="text-lg font-medium mb-2">Your Answer:</h3>
            <ImageGrid
              images={playerAnswers}
              isAnswering={true}
              onDrop={(index, image) => updatePlayerAnswer(index, image)}
            />
          </div>

          {/* Right side - Available images */}
          <div className="w-full max-w-md">
            <h3 className="text-lg font-medium mb-2">Available Images:</h3>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 16 }, (_, i) => {
                const imageId = i + 1;
                const imgNum = imageId < 10 ? `0${imageId}` : `${imageId}`;
                return (
                  <DraggableImage
                    key={imageId}
                    image={{
                      id: imageId,
                      imgSrc: `/Image/img${imgNum}.png`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Answer
        </button>
      </div>
    </DndProvider>
  );
}
