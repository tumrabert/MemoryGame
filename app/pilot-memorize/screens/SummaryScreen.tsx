"use client";

import { useGame } from "../components/GameProvider";
import ImageGrid from "../components/ImageGrid";

export default function SummaryScreen() {
  const { game, resetGame } = useGame();

  // Get the original grid and player answers
  const originalGrid = game.getOriginalGrid();
  const playerAnswers = game.getPlayerAnswers();
  const score = game.getScore();

  console.log("Original grid:", originalGrid);
  console.log("Player answers:", playerAnswers);
  console.log("Score:", score);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Game Results</h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <h3 className="text-xl mb-3">Your Answer</h3>
          <div className="w-full max-w-md">
            <ImageGrid
              images={
                playerAnswers.length ? playerAnswers : Array(16).fill(null)
              }
              showCorrectness={true}
              originalGrid={originalGrid}
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-xl mb-3">Correct Solution</h3>
          <div className="w-full max-w-md">
            <ImageGrid images={originalGrid} />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-2">Score</h3>
        <div className="grid grid-cols-2 gap-2">
          <p>Correct Placements:</p>
          <p className="font-bold text-green-600">{score.correctPlaces}</p>
          <p>Wrong Placements:</p>
          <p className="font-bold text-red-600">{score.wrongPlaces}</p>
          <p>Accuracy:</p>
          <p className="font-bold">{(score.accuracy * 100).toFixed(1)}%</p>
        </div>
      </div>

      <button
        onClick={resetGame}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Play Again
      </button>
    </div>
  );
}
