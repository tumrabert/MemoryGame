"use client";

import React from "react";
import { useDrop } from "react-dnd";
import Image from "next/image";
import { ImagePosition } from "../models/Game";

// Create a separate component for each cell
function GridCell({
  index,
  image,
  isAnswering,
  onDrop,
  showCorrectness,
  originalGrid,
}: {
  index: number;
  image: ImagePosition | null;
  isAnswering: boolean;
  onDrop?: (index: number, item: ImagePosition) => void;
  showCorrectness: boolean;
  originalGrid?: ImagePosition[];
}) {
  // For checking correctness in summary view
  let isCorrect = false;
  let cellClassName = "border-2 border-gray-300";

  if (showCorrectness && originalGrid && image) {
    // Check if the image at this position matches the original grid
    isCorrect = originalGrid[index]?.id === image.id;
    cellClassName = isCorrect
      ? "border-2 border-green-500" // Correct answer
      : "border-2 border-red-500"; // Wrong answer
  }

  // Now useDrop is at the top level of a component
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "IMAGE",
      drop: (item: ImagePosition) => {
        if (onDrop) {
          onDrop(index, item);
        }
        return { index };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [index, onDrop]
  );

  if (isAnswering) {
    drop(ref);
  }

  return (
    <div
      ref={ref}
      className={`w-full aspect-square ${cellClassName} ${
        isAnswering && isOver ? "bg-blue-100" : "bg-white"
      } flex items-center justify-center p-1`}
    >
      {image && (
        <div className="w-full h-full relative">
          <Image
            src={image.imgSrc}
            alt={`Image ${image.id}`}
            width={100}
            height={100}
            className="object-contain w-full h-full"
            priority
          />
        </div>
      )}
    </div>
  );
}

export interface ImageGridProps {
  images: (ImagePosition | null)[];
  isAnswering?: boolean;
  onDrop?: (index: number, item: ImagePosition) => void;
  showCorrectness?: boolean;
  originalGrid?: ImagePosition[];
}

export default function ImageGrid({
  images,
  isAnswering = false,
  onDrop,
  showCorrectness = false,
  originalGrid,
}: ImageGridProps) {
  return (
    <div className="grid grid-cols-4 gap-1 w-full">
      {Array.from({ length: 16 }, (_, i) => (
        <GridCell
          key={`cell-${i}`}
          index={i}
          image={images[i]}
          isAnswering={isAnswering}
          onDrop={onDrop}
          showCorrectness={showCorrectness}
          originalGrid={originalGrid}
        />
      ))}
    </div>
  );
}
