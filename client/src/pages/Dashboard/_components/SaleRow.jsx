import React, { useEffect } from "react";
import { isToday, isYesterday, format } from "date-fns";
function formatDate(dateString) {
  // console.log("date: ", dateString);
  const date = new Date(dateString);
  const parsedDate = date.toJSON()?.split("T")[0];
  // console.log("parsedDate: ", parsedDate);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  function isSameDay(d1, d2) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  function format(date, formatString) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return formatString
      .replace("MMMM", month)
      .replace("d", day)
      .replace("yyyy", year);
  }

  if (isSameDay(date, today)) {
    return format(date, "d MMMM yyyy") + " - Today";
  } else if (isSameDay(date, yesterday)) {
    return format(date, "d MMMM yyyy") + " - Yesterday";
  } else {
    return format(date, "d MMMM yyyy");
  }
}

export default function SaleRow({
  description,
  customer,
  email,
  saleAmount,
  date,
}) {
  return (
    <main className="flex flex-wrap justify-between mb-2">
      {/* LEFT */}
      <section className="flex justify-between gap-3">
        <figure className="h-10 w-10 rounded-full bg-secondary dark:bg-foreground p-1">
          <img
            width={200}
            height={200}
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${customer}`}
            alt="avatar"
          />
        </figure>
        <div className="text-sm">
          <p>{customer || "Unknown"}</p>
          <div className="text-ellipsis overflow-hidden whitespace-nowrap w-[120px] sm:w-auto  text-muted-foreground">
            {formatDate(date)}
          </div>
        </div>
      </section>
      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <span className="p-1 px-3 text-sm text-muted-foreground border rounded-full">
          {description}
        </span>
        <div className="text-sm border rounded-full p-1 px-3 flex items-center gap-2">
          <span className="text-neutral-400">NPR</span>{" "}
          <h3 className="text-lg">+{saleAmount}</h3>
        </div>
      </div>
    </main>
  );
}
