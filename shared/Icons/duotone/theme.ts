import tailwindColors from "tailwindcss/colors";
import { theme } from "src/tailwind.config";

const themeColors = theme.extend.colors;

export type IconProps = {
  size?: number;
  className?: string;
  color?: string;
};

export default function IconTheme(color: string = "transparent") {
  const hex =
    color in themeColors ? themeColors[color][500] : tailwindColors[color][500];
  return {
    // NOTE - This only reads from Tailwind color constants, not any theme overrides in tailwind.config.js
    color: color === "transparent" ? "#FFFFFF" : hex,
    opacity: color === "transparent" ? 0.3 : 1,
  };
}
