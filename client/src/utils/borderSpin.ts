const gradientBorder = document.querySelector("#gradientBorder");
console.log(gradientBorder)

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
