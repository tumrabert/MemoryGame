"use client";

import { useDrag } from "react-dnd";
import Image from "next/image";
import { ImagePosition } from "../models/Game";

interface DraggableImageProps {
  image: ImagePosition;
}

export default function DraggableImage({ image }: DraggableImageProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "IMAGE",
    item: image,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`w-full aspect-square border-2 border-gray-300 flex items-center justify-center p-1 ${
        isDragging ? "opacity-50" : "opacity-100"
      } cursor-move`}
    >
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
    </div>
  );
}
