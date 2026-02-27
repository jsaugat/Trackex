import { useRef, useState, useEffect, useCallback } from "react";

export function useThrottle(fn, delay) {
  const lastCallRef = useRef(0);
  const runningRef = useRef(false);
  const timerRef = useRef(null);

  const [remainingTime, setRemainingTime] = useState(0);

  const throttledFn = useCallback(
    async (...args) => {
      const now = Date.now();

      if (runningRef.current) return;
      if (now - lastCallRef.current < delay) return;

      runningRef.current = true;
      lastCallRef.current = now;
      setRemainingTime(delay);

      try {
        await fn(...args);
      } finally {
        runningRef.current = false;
      }
    },
    [fn, delay]
  );

  // Countdown effect
  useEffect(() => {
    if (remainingTime <= 0) return;

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1000) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [remainingTime]);

  return {
    throttledFn,
    isThrottled: remainingTime > 0,
    remainingSeconds: Math.ceil(remainingTime / 1000),
  };
}