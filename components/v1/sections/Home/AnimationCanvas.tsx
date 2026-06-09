"use client";

import { useEffect, useRef } from "react";
import type { Engine } from "@/lib/animations/core/Engine";

type Props = {
  sceneFactory: (canvas: HTMLCanvasElement) => Engine;
  className?: string;
  ariaHidden?: boolean;
};

export function AnimationCanvas({
  sceneFactory,
  className,
  ariaHidden = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const factoryRef = useRef(sceneFactory);
  factoryRef.current = sceneFactory;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = factoryRef.current(canvas);
    scene.start();
    return () => scene.destroy();
  }, []);

  return (
    <canvas ref={canvasRef} className={className} aria-hidden={ariaHidden} />
  );
}
