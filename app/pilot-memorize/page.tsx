"use client";

import { useGame } from "./components/GameProvider";
import { GameStage } from "./models/Game";
import SettingsScreen from "./screens/SettingsScreen";
import MemorizeScreen from "./screens/MemorizeScreen";
import AnswerScreen from "./screens/AnswerScreen";
import SummaryScreen from "./screens/SummaryScreen";
import { useState, useEffect } from "react";

export default function MemorizePage() {
  const { game } = useGame();
  const [currentStage, setCurrentStage] = useState(game.getCurrentStage());

  // Force update stage whenever it changes
  useEffect(() => {
    const checkStage = () => {
      const stage = game.getCurrentStage();
      if (stage !== currentStage) {
        console.log("Stage changed from", currentStage, "to", stage);
        setCurrentStage(stage);
      }
    };

    // Check immediately and then on interval
    checkStage();
    const interval = setInterval(checkStage, 500);

    return () => clearInterval(interval);
  }, [game, currentStage]);

  console.log("Rendering page with stage:", currentStage);

  return (
    <main className="container mx-auto py-8 px-4">
      {currentStage === GameStage.START && <SettingsScreen />}
      {currentStage === GameStage.MEMORIZE && <MemorizeScreen />}
      {currentStage === GameStage.ANSWER && <AnswerScreen />}
      {currentStage === GameStage.SUMMARY && <SummaryScreen />}
    </main>
  );
}
