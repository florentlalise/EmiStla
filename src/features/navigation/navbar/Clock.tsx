"use client";

import { useState, useEffect } from "react";

export default function ClockItem() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const weekday = currentTime.toLocaleDateString("en-GB", { weekday: "short" });
  const day = currentTime.toLocaleDateString("en-GB", { day: "2-digit" });
  const month = currentTime.toLocaleDateString("en-GB", { month: "short" });
  const year = currentTime.toLocaleDateString("en-GB", { year: "numeric" });
  const time = currentTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <>
      {weekday} {day} {month} {year} {time}
    </>
  );
}
