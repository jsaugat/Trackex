//? No timezone date
export function DateToUTCDate(date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
}

//? Format currency
export const formatCurrency = (currency) => currency.toLocaleString();

//? US Date formats
export function formatMDY(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }); // May 27 2024
}
export function formatDMY(date) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }); 
  
  // To transform "16 May 2024" format
  const parts = formattedDate.split(" ");
  const finalDate = `${parseInt(parts[1])} ${parts[0]} ${parts[2]}`;
  return finalDate;
  // 27 May 2024
}

//? Current Time
export function getCurrentTime() {
  // Get current date and time
  const now = new Date();

  // Get hours, minutes, and seconds
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // Determine AM or PM
  let meridiem = "AM";
  if (hours >= 12) {
    meridiem = "PM";
  }

  // Convert 24-hour format to 12-hour format
  if (hours > 12) {
    hours -= 12;
  }

  // Add leading zeros if needed
  hours = (hours < 10 ? "0" : "") + hours;
  minutes = (minutes < 10 ? "0" : "") + minutes;
  seconds = (seconds < 10 ? "0" : "") + seconds;

  // Print time with AM/PM
  // const timeString = hours + ":" + minutes + ":" + seconds + " " + meridiem;
  const timeString = hours + ":" + minutes + " " + meridiem;
  return timeString;
  console.log("Current time: " + timeString);
}

//? Suffix an amount (K, M, B, T)
export function formatNumberWithSuffix(num) {
  const suffixes = ["", "K", "M", "B", "T"]; // Array of suffixes
  const suffixNum = Math.floor(("" + num).length / 3); // Determine the suffix index
  let shortValue = parseFloat(
    (suffixNum !== 0 ? num / Math.pow(1000, suffixNum) : num).toPrecision(2)
  );
  if (shortValue % 1 !== 0) {
    shortValue = shortValue.toFixed(1);
  }
  return shortValue + suffixes[suffixNum]; // Concatenate the number with suffix
}
