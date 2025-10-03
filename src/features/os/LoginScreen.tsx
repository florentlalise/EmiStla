"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";
import Wallpaper from "@/components/ui/Wallpaper";
import { playSound } from "@/lib/sounds";

interface LoginScreenProps {
  onComplete: () => void;
  isComplete: boolean;
}

export default function LoginScreen({
  onComplete,
  isComplete,
}: LoginScreenProps) {
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const hasPlayedSound = useRef(false);

  const handleLogin = () => {
    playSound("click1");
    setHasStarted(true);
  };

  useEffect(() => {
    if (!hasStarted) return;

    const loadingStages = [
      { target: 15, duration: 150 },
      { target: 35, duration: 250 },
      { target: 45, duration: 100 },
      { target: 60, duration: 350 },
      { target: 75, duration: 200 },
      { target: 95, duration: 300 },
      { target: 100, duration: 100 },
    ];

    let currentStage = 0;
    let currentProgress = 0;
    let animationFrameId: number;

    const animateStage = () => {
      if (currentStage >= loadingStages.length) {
        if (!hasPlayedSound.current) {
          hasPlayedSound.current = true;
          playSound("startup");
        }
        setTimeout(onComplete, 300);
        return;
      }

      const stage = loadingStages[currentStage];
      const startProgress = currentProgress;
      const progressDiff = stage.target - startProgress;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / stage.duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const newProgress = startProgress + progressDiff * easeProgress;

        setProgress(newProgress);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          currentProgress = stage.target;
          currentStage++;
          setTimeout(animateStage, Math.random() * 100 + 50);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    animateStage();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [hasStarted, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-700 ${
        isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div>
        <Wallpaper />
        <div className="backdrop-blur-2xl absolute w-full h-full"></div>
      </div>

      <div className="relative flex flex-col items-center justify-center h-full gap-6 z-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-black/60 flex items-center justify-center">
            <User size={48} className="text-white/80" />
          </div>
        </div>

        <h2 className="text-2xl font-medium text-white">Welcome, Guest</h2>

        {!hasStarted ? (
          <button
            onClick={handleLogin}
            className="mt-4 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors backdrop-blur-sm border border-white/20"
          >
            Login
          </button>
        ) : (
          <>
            <div className="w-64 rounded h-1.5 bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white/80 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-white/60">
              {progress < 100 ? "Loading your workspace..." : "Ready!"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
