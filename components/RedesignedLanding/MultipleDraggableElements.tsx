"use client";

import { useState, useEffect } from "react";
import { DraggableElement } from "./DraggableElement";

type ScreenSize = "default" | "lg" | "md" | "sm" | "ipad" | "xl";

interface Position {
  x: number;
  y: number;
}

interface DraggableImageConfig {
  src: string;
  positions: {
    xl?: Position;
    ipad: Position;
    default: Position;
    lg: Position;
    md: Position;
    sm: Position;
  };
}

const DRAGGABLE_IMAGE_CONFIGS: DraggableImageConfig[] = [
  {
    src: "/draggable/draggable.png",
    positions: {
      default: { x: 300, y: 75 },
      ipad: { x: 75, y: 0 },
      lg: { x: 50, y: 50 },
      md: { x: 200, y: 100 },
      sm: { x: 60, y: 30 },
    },
  },
  {
    src: "/draggable/draggable2.png",
    positions: {
      default: { x: 675, y: 75 },
      ipad: { x: 450, y: 75 },
      lg: { x: 250, y: 100 },
      md: { x: 400, y: 100 },
      sm: { x: 240, y: 60 },
    },
  },
  {
    src: "/draggable/draggable3.png",
    positions: {
      xl: { x: 1650, y: 675 },
      default: { x: 1050, y: 600 },
      ipad: { x: 900, y: 675 },
      lg: { x: 750, y: 450 },
      md: { x: 700, y: 400 },
      sm: { x: 390, y: 450 },
    },
  },
  {
    src: "/draggable/draggable4.png",
    positions: {
      xl: { x: 1500, y: 225 },
      default: { x: 1125, y: 300 },
      ipad: { x: 1050, y: 375 },
      lg: { x: 800, y: 200 },
      md: { x: 750, y: 200 },
      sm: { x: 330, y: 300 },
    },
  },
  {
    src: "/draggable/draggable5.png",
    positions: {
      default: { x: 75, y: 375 },
      ipad: { x: 75, y: 375 },
      lg: { x: 0, y: 350 },
      md: { x: 50, y: 250 },
      sm: { x: 30, y: 150 },
    },
  },
  {
    src: "/draggable/draggable6.png",
    positions: {
      default: { x: 375, y: 450 },
      ipad: { x: 225, y: 600 },
      lg: { x: 50, y: 600 },
      md: { x: 250, y: 300 },
      sm: { x: 60, y: 300 },
    },
  },
  {
    src: "/draggable/draggable7.png",
    positions: {
      xl: { x: 825, y: 600 },
      default: { x: 525, y: 600 },
      ipad: { x: 525, y: 675 },
      lg: { x: 150, y: 450 },
      md: { x: 350, y: 400 },
      sm: { x: 30, y: 540 },
    },
  },
  {
    src: "/draggable/draggable8.png",
    positions: {
      default: { x: 975, y: 150 },
      ipad: { x: 900, y: 225 },
      lg: { x: 450, y: 150 },
      md: { x: 650, y: 100 },
      sm: { x: 360, y: 120 },
    },
  },
];

const SCREEN_BREAKPOINTS = {
  sm: 768,
  lg: 1024,
  ipad: 1100,
  xl: 1536,
};

export function MultipleDraggableElements() {
  const [currentScreenSize, setCurrentScreenSize] =
    useState<ScreenSize>("default");
  const [currentGridSize, setCurrentGridSize] = useState<number>(75);
  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);

    const handleWindowResize = () => {
      const width = window.innerWidth;

      if (width < SCREEN_BREAKPOINTS.sm) {
        setCurrentScreenSize("sm");
        setCurrentGridSize(30);
      } else if (width < SCREEN_BREAKPOINTS.lg) {
        setCurrentScreenSize("lg");
        setCurrentGridSize(50);
      } else if (width < SCREEN_BREAKPOINTS.ipad) {
        setCurrentScreenSize("ipad");
        setCurrentGridSize(75);
      } else if (width < SCREEN_BREAKPOINTS.xl) {
        setCurrentScreenSize("default");
        setCurrentGridSize(75);
      } else {
        setCurrentScreenSize("xl");
        setCurrentGridSize(75);
      }
    };

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const calculateScaleFactor = () => {
    if (currentScreenSize === "sm") {
      return 0.4;
    } else if (currentScreenSize === "md" || currentScreenSize === "lg") {
      return 0.7;
    }
    return 1;
  };

  const alignPositionToGrid = (position: number, gridSize: number) => {
    return Math.floor(position / gridSize) * gridSize;
  };

  if (!isClientMounted) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 left-1/2 right-1/2 z-10 -ml-[50vw] -mr-[50vw] h-full w-screen overflow-hidden">
      {DRAGGABLE_IMAGE_CONFIGS.map((imageConfig, index) => {
        const scaleFactor = calculateScaleFactor();

        let selectedPosition: Position;
        switch (currentScreenSize) {
          case "sm":
            selectedPosition = imageConfig.positions.sm;
            break;
          case "md":
            selectedPosition = imageConfig.positions.md;
            break;
          case "lg":
            selectedPosition = imageConfig.positions.lg;
            break;
          case "ipad":
            selectedPosition = imageConfig.positions.ipad;
            break;
          case "xl":
            selectedPosition =
              imageConfig.positions.xl || imageConfig.positions.default;
            break;
          default:
            selectedPosition = imageConfig.positions.default;
        }

        const alignedX = alignPositionToGrid(
          selectedPosition.x,
          currentGridSize
        );
        const alignedY = alignPositionToGrid(
          selectedPosition.y,
          currentGridSize
        );

        return (
          <DraggableElement
            key={`${index}-${currentScreenSize}`}
            imageSrc={imageConfig.src}
            initialPosition={{
              x: alignedX,
              y: alignedY,
            }}
            gridSize={currentGridSize}
            id={`draggable-element-${index}`}
            scale={scaleFactor}
          />
        );
      })}
    </div>
  );
}
