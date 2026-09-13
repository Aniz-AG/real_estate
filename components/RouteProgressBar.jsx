import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

// Lightweight top-of-page progress bar for route transitions — gives instant
// feedback on navigation without a blank white flash between pages.
export default function RouteProgressBar() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    const clearTimers = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };

    const start = () => {
      clearTimers();
      setVisible(true);
      setProgress(12);
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 88) return prev;
          // Slow down as it approaches the ceiling so it never looks "stuck at 100".
          const step = prev < 40 ? 8 : prev < 70 ? 4 : 1.5;
          return Math.min(prev + step, 88);
        });
      }, 200);
    };

    const done = () => {
      clearTimers();
      setProgress(100);
      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
      clearTimers();
    };
  }, [router]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-blue-500 to-primary shadow-[0_0_8px_rgba(29,78,216,0.6)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "150ms" : "250ms",
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
