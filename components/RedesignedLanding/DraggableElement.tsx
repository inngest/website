"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  DndContext,
  useDraggable,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";

interface DraggableElementProps {
  initialPosition?: { x: number; y: number };
  gridSize?: number;
  imageSrc?: string;
  id?: string;
  scale?: number;
}

export function DraggableElement({
  initialPosition = { x: 20, y: 20 },
  gridSize = 75,
  imageSrc = "/draggable/draggable.png",
  id = "draggable",
  scale = 1,
}: DraggableElementProps) {
  const [currentPosition, setCurrentPosition] = useState({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);

  const elementSize = gridSize;

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    setCurrentPosition({
      x: initialPosition.x,
      y: initialPosition.y,
    });
  }, [initialPosition.x, initialPosition.y]);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;

    const finalX = currentPosition.x + delta.x;
    const finalY = currentPosition.y + delta.y;

    const centerX = finalX + elementSize / 2;
    const centerY = finalY + elementSize / 2;

    setCurrentPosition({
      x: Math.floor(centerX / gridSize) * gridSize,
      y: Math.floor(centerY / gridSize) * gridSize,
    });

    setIsDragging(false);
  };

  if (!isClientMounted) {
    return (
      <div
        style={{
          position: "absolute",
          top: currentPosition.y,
          left: currentPosition.x,
          width: `${elementSize}px`,
          height: `${elementSize}px`,
        }}
      />
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <DraggableItem
        position={currentPosition}
        isDragging={isDragging}
        imageSrc={imageSrc}
        id={id}
        elementSize={elementSize}
        scale={scale}
      />
    </DndContext>
  );
}

interface DraggableItemProps {
  position: { x: number; y: number };
  isDragging: boolean;
  imageSrc?: string;
  id: string;
  elementSize: number;
  scale?: number;
}

function DraggableItem({
  position,
  isDragging,
  imageSrc,
  id,
  elementSize,
  scale = 1,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const transformStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: "none",
      }
    : {
        transition: "none",
      };

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: 10,
        width: `${elementSize}px`,
        height: `${elementSize}px`,
        ...transformStyle,
      }}
      {...listeners}
      {...attributes}
    >
      <div
        className={`${
          isDragging ? "scale-110" : "scale-100"
        } relative flex h-full w-full items-center justify-center transition-transform duration-100`}
      >
        <div
          className={`absolute inset-0 -z-10 rounded-full blur-xl`}
        />
        <Image
          src={imageSrc || "/draggable/draggable.png"}
          alt="Draggable element"
          width={elementSize}
          height={elementSize}
          className={`select-none ${isDragging ? "opacity-80" : "opacity-100"}`}
          style={{
            objectFit: "contain",
            width: `${elementSize}px`,
            height: `${elementSize}px`,
          }}
        />
        {/* going to remove this before merging */}
        {/* <div className="absolute bottom-0 right-0 flex flex-col gap-y-1">
          <div>{position.x}</div>
          <div>{position.y}</div>
        </div> */}
      </div>
    </div>
  );
}
