"use client";

import { useState, useEffect, useRef } from "react";

interface TimerProps {
  initialTimeStr?: string; // Format: "mm:ss"
  time?: string; // Alternative prop name used in MemorizeScreen
  onTimeEnd?: () => void;
  onTimeUp?: () => void; // Alternative prop name used in MemorizeScreen
  isActive?: boolean;
}

export function Timer({
  initialTimeStr,
  time,
  onTimeEnd,
  onTimeUp,
  isActive = true,
}: TimerProps) {
  // Use either initialTimeStr or time prop
  const timeStr = initialTimeStr || time || "00:00";

  // Parse the initial time string to seconds
  const parseTime = (timeStr: string): number => {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  // Store total remaining seconds and whether timer has ended
  const [totalSeconds, setTotalSeconds] = useState(parseTime(timeStr));
  const timerEndedRef = useRef(false);
  const callbackRef = useRef({ onTimeEnd, onTimeUp });

  // Update callback refs when props change
  useEffect(() => {
    callbackRef.current = { onTimeEnd, onTimeUp };
  }, [onTimeEnd, onTimeUp]);

  // Reset timer when time string changes
  useEffect(() => {
    setTotalSeconds(parseTime(timeStr));
    timerEndedRef.current = false;
  }, [timeStr]);

  // Handle timer completion
  const handleTimeEnd = () => {
    if (timerEndedRef.current) return;

    timerEndedRef.current = true;
    const { onTimeEnd, onTimeUp } = callbackRef.current;

    if (onTimeEnd) onTimeEnd();
    if (onTimeUp) onTimeUp();
  };

  // Timer countdown effect
  useEffect(() => {
    // Handle case where timer starts at 0
    if (totalSeconds === 0 && !timerEndedRef.current) {
      handleTimeEnd();
      return;
    }

    let interval: NodeJS.Timeout | null = null;

    if (isActive && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            // Call the callback on the next tick for reliability
            setTimeout(handleTimeEnd, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, totalSeconds]);

  // Format the display time
  const formatTime = () => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      minutes: minutes,
      seconds: seconds,
    };
  };

  const displayTime = formatTime();

  return (
    <div className="timer text-4xl font-bold">
      {displayTime.minutes.toString().padStart(2, "0")}:
      {displayTime.seconds.toString().padStart(2, "0")}
    </div>
  );
}

export default Timer;
