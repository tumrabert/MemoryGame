"use client";

import React from "react";

interface TimePickerProps {
  id?: string;
  label?: string;
  value: string; // "mm:ss" format
  onChange: (value: string) => void;
  className?: string;
}

export default function TimePicker({
  id,
  label,
  value,
  onChange,
  className = "",
}: TimePickerProps) {
  // Parse the mm:ss string to get minutes and seconds
  const [minutes, seconds] = value.split(":").map(Number);

  // Handle individual changes to minutes or seconds
  const handleMinutesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = e.target.value.padStart(2, "0");
    const newSeconds = seconds.toString().padStart(2, "0");
    onChange(`${newMinutes}:${newSeconds}`);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = minutes.toString().padStart(2, "0");
    const newSeconds = e.target.value.padStart(2, "0");
    onChange(`${newMinutes}:${newSeconds}`);
  };

  return (
    <div className={`time-picker ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-lg mb-2">
          {label}
        </label>
      )}

      <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
        {/* Minutes picker */}
        <div className="relative flex-1">
          <select
            id={`${id}-minutes`}
            value={minutes}
            onChange={handleMinutesChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {Array.from({ length: 30 }, (_, i) => (
              <option key={`mm-${i}`} value={i}>
                {i.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
          <label className="text-xs text-gray-500 mt-1 block text-center">
            Minutes
          </label>
        </div>

        <span className="text-xl font-bold">:</span>

        {/* Seconds picker */}
        <div className="relative flex-1">
          <select
            id={`${id}-seconds`}
            value={seconds}
            onChange={handleSecondsChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={`ss-${i}`} value={i}>
                {i.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
          <label className="text-xs text-gray-500 mt-1 block text-center">
            Seconds
          </label>
        </div>
      </div>
    </div>
  );
}
