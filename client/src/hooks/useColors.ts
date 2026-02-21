import { useMemo } from "react";

export default function useColors() {
  const coolColors = useMemo(
    () => [
      "#00FFFF", // Aqua
      "#007FFF", // Azure
      "#4682B4", // Steel Blue
      "#8A2BE2", // Blue Violet
      "#4B0082", // Indigo
      "#20B2AA", // Light Sea Green
      "#40E0D0", // Turquoise
      "#5F9EA0", // Cadet Blue
      "#6A5ACD", // Slate Blue
      "#32CD32", // Lime Green
      "#3CB371", // Medium Sea Green
      "#66CDAA", // Medium Aquamarine
      "#8FBC8F", // Dark Sea Green
      "#2E8B57", // Sea Green
      "#B0C4DE", // Light Steel Blue
    ],
    []
  );

  const warmColors = useMemo(
    () => [
      // "#FF4500", // Orange Red
      "#FF6347", // Tomato
      // "#FF7F50", // Coral
      "#FFA500", // Orange
      "#FF69B4", // Hot Pink
      "#FF00FF", // Magenta
      "#DB7093", // Pale Violet Red
      "#DC143C", // Crimson
      "#FF6F61", // Bittersweet
      "#CD5C5C", // Indian Red
    ],
    []
  );

  return { coolColors, warmColors };
}
