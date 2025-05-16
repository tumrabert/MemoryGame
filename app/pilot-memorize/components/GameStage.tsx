import { useGame } from './GameProvider';
import { GameStage as GameStageEnum } from '../models/Game';
import Timer from './Timer';
import ImageGrid from './ImageGrid'; // Assuming you have this component

export function GameStage() {
  const { 
    game, 
    handleMemorizeTimeEnd, 
    handleAnswerTimeEnd 
  } = useGame();
  
  const currentStage = game.getCurrentStage();
  const settings = game.getSettings();

  return (
    <div className="game-stage">
      {currentStage === GameStageEnum.MEMORIZE && (
        <div className="memorize-stage">
          <h1>Memorize the Grid</h1>
          <Timer 
  initialTimeStr={settings.memorizeTime} 
  onTimeEnd={handleMemorizeTimeEnd} 
/>
          <ImageGrid images={game.getOriginalGrid()} />
        </div>
      )}
      
      {currentStage === GameStageEnum.ANSWER && (
        <div className="answer-stage">
          <h1>Place the Images</h1>
          <Timer 
            initialTimeStr={settings.answerTime} 
            onTimeEnd={handleAnswerTimeEnd} 
          />
          {/* Answer stage UI with drag-and-drop */}
        </div>
      )}
      
      {currentStage === GameStageEnum.SUMMARY && (
        <div className="summary-stage">
          <h1>Game Results</h1>
          <div className="score">
            <p>Correct: {game.getScore().correctPlaces}</p>
            <p>Wrong: {game.getScore().wrongPlaces}</p>
            <p>Accuracy: {(game.getScore().accuracy * 100).toFixed(1)}%</p>
          </div>
        </div>
      )}
      
      {currentStage === GameStageEnum.START && (
        <div className="start-stage">
          <h1>Pilot Memorize Game</h1>
          <p>Press Start to begin</p>
        </div>
      )}
    </div>
  );
}

export default GameStage;
