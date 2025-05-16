import { useGame } from "./GameProvider";
import { GameStage as GameStageEnum } from "../models/Game";

export function Controls() {
  const { game, startGame, resetGame, moveToAnswerStage, submitAnswers } =
    useGame();
  const currentStage = game.getCurrentStage();

  return (
    <div className="game-controls">
      {currentStage === GameStageEnum.START && (
        <button className="btn btn-primary" onClick={startGame}>
          Start Game
        </button>
      )}

      {currentStage === GameStageEnum.MEMORIZE && (
        <button className="btn btn-primary" onClick={moveToAnswerStage}>
          I am Ready
        </button>
      )}

      {currentStage === GameStageEnum.ANSWER && (
        <button className="btn btn-primary" onClick={() => submitAnswers([])}>
          Submit Answers
        </button>
      )}

      {currentStage === GameStageEnum.SUMMARY && (
        <button className="btn btn-primary" onClick={resetGame}>
          Play Again
        </button>
      )}

      {currentStage !== GameStageEnum.START && (
        <button className="btn btn-secondary" onClick={resetGame}>
          Reset
        </button>
      )}
    </div>
  );
}

export default Controls;
