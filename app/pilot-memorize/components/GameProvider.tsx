"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Game, GameSettings, ImagePosition, GameStage } from "../models/Game";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface GameContextType {
  game: Game;
  updateSettings: (settings: GameSettings) => void;
  startGame: () => void;
  moveToAnswerStage: () => void;
  submitAnswers: (answers?: ImagePosition[]) => void;
  resetGame: () => void;
  playerAnswers: (ImagePosition | null)[];
  updatePlayerAnswer: (index: number, image: ImagePosition) => void;
  availableImages: ImagePosition[];
  markImageAsPlaced: (imageId: number) => void;
  unmarkImageAsPlaced: (imageId: number) => void;
  handleMemorizeTimeEnd: () => void;
  handleAnswerTimeEnd: () => void;
  gameStage: GameStage;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game] = useState(new Game());
  const [playerAnswers, setPlayerAnswers] = useState<(ImagePosition | null)[]>(
    Array(16).fill(null)
  );
  const [placedImageIds, setPlacedImageIds] = useState<number[]>([]);

  // Add this state to track game stage changes and force re-renders
  const [gameStage, setGameStage] = useState<GameStage>(game.getCurrentStage());

  // All possible images for the right panel
  const [allImages, setAllImages] = useState<ImagePosition[]>([]);

  useEffect(() => {
    setAllImages(
      Array.from({ length: 16 }, (_, i) => {
        const imageId = i + 1;
        const imgNum = imageId < 10 ? `0${imageId}` : `${imageId}`;
        return {
          id: imageId,
          imgSrc: `/Image/img${imgNum}.png`, // Match the path in Game.ts
        };
      })
    );
  }, []);

  const availableImages = allImages.filter(
    (img) => !placedImageIds.includes(img.id)
  );

  const updateSettings = (settings: GameSettings) => {
    game.updateSettings(settings);
  };

  const startGame = () => {
    game.startGame();
    setPlayerAnswers(Array(16).fill(null));
    setPlacedImageIds([]);
  };

  // Update moveToAnswerStage to force a re-render
  const moveToAnswerStage = () => {
    console.log("Moving to answer stage - before:", game.getCurrentStage());
    game.moveToAnswerStage();
    console.log("Moving to answer stage - after:", game.getCurrentStage());

    // Force component re-render by updating a state variable
    setGameStage(game.getCurrentStage());
  };

  // Update the submitAnswers function to match the type signature
  const submitAnswers = useCallback(
    (answers?: ImagePosition[]) => {
      // If answers is undefined, use the current player answers
      const answersToSubmit =
        answers ||
        playerAnswers.filter((item): item is ImagePosition => item !== null);

      console.log("Submitting answers:", answersToSubmit);

      // Submit to the game
      game.submitAnswers(answersToSubmit);

      // Update UI state
      setGameStage(game.getCurrentStage());
    },
    [game, playerAnswers]
  );

  const resetGame = () => {
    game.resetGame();
    setPlayerAnswers(Array(16).fill(null));
    setPlacedImageIds([]);
  };

  // Update the updatePlayerAnswer function
  const updatePlayerAnswer = (index: number, image: ImagePosition) => {
    setPlayerAnswers((prev) => {
      const newAnswers = [...prev];

      // Save position information with the image
      newAnswers[index] = {
        ...image,
        position: index, // Explicitly set position
      };

      console.log(`Updated player answer at ${index}:`, newAnswers[index]);
      return newAnswers;
    });
  };

  const markImageAsPlaced = (imageId: number) => {
    if (!placedImageIds.includes(imageId)) {
      setPlacedImageIds([...placedImageIds, imageId]);
    }
  };

  const unmarkImageAsPlaced = (imageId: number) => {
    setPlacedImageIds(placedImageIds.filter((id) => id !== imageId));
  };

  const handleMemorizeTimeEnd = () => {
    moveToAnswerStage();
  };

  const handleAnswerTimeEnd = () => {
    submitAnswers([]);
  };

  return (
    <GameContext.Provider
      value={{
        game,
        gameStage, // Add this line
        updateSettings,
        startGame,
        moveToAnswerStage,
        submitAnswers,
        resetGame,
        playerAnswers,
        updatePlayerAnswer,
        availableImages,
        markImageAsPlaced,
        unmarkImageAsPlaced,
        handleMemorizeTimeEnd,
        handleAnswerTimeEnd,
      }}
    >
      <DndProvider backend={HTML5Backend}>{children}</DndProvider>
    </GameContext.Provider>
  );
}
