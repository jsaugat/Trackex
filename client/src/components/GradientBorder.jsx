import { cn } from "@/lib/utils";
import "@/styles/animate.scss";
// import "@/utils/borderSpin.js";
import { useEffect } from "react";

export default function GradientBorder({ children, className, radius }) {
  useEffect(() => {
    const gradientBorder = document.querySelector("#gradientBorder");

    gradientBorder.addEventListener("mouseover", function () {
      // Array of possible gradient directions
      const directions = [
        "to top",
        "to right",
        "to bottom",
        "to left",
        "to top right",
        "to top left",
        "to bottom right",
        "to bottom left",
      ];

      // Generate a random direction
      const randomIndex = Math.floor(Math.random() * directions.length);
      const randomDirection = directions[randomIndex];

      // Set the random direction as a CSS variable for the specific element
      gradientBorder.style.setProperty("--direction", randomDirection);
    });

    // Cleanup: Remove event listener when component unmounts
    return () => {
      gradientBorder.removeEventListener("mouseover", () => {});
    };
  }); // Empty dependency array ensures the effect runs only once when component mounts

  return (
    <div
      id="gradientBorder"
      className={cn(
        ` relative 
          p-[0.06rem] 
          bg-transparent
          dark:bg-gradient-to-r 
          from-secondary 
          via-primary/20 
          to-secondary 
          hover:via-primary/60
          rounded-${radius} 
        `,
        className
      )}
    >
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
