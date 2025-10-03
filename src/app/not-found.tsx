"use client";

import { playSound } from "@/lib/sounds";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleReturn = () => {
    playSound("click1");
    router.push("/");
  };

  return (
    <div className="fixed inset-0 bg-[#080808] flex items-center justify-center _halftone-no-after">
      <div className="max-w-3xl w-full px-8 space-y-8">
        <div className="text-[120px] font-light text-white/90">:(</div>

        <div className="space-y-6 text-white/90">
          <p className="text-2xl font-light">
            Your OS ran into a problem and needs to restart. We're just
            collecting some error info, and then we'll restart for you.
          </p>

          <div className="space-y-2">
            <p className="text-xl font-light">{progress}% complete</p>

            <div className="w-64 h-1 bg-white/20 rounded overflow-hidden">
              <div
                className="h-full bg-white/90 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 text-white/70 text-xs font-mono">
          <div className="space-y-1">
            <p>If you call a support person, give them this info:</p>
            <p className="text-white/90">Stop code: PAGE_NOT_FOUND</p>
          </div>
        </div>

        <div className="h-12">
          {progress === 100 && (
            <button
              onClick={handleReturn}
              className="mt-4 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors backdrop-blur-sm border border-white/20"
            >
              Return to safety
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
