"use client";

import { useState, useEffect } from "react";
import LoginScreen from "@/features/os/LoginScreen";
import OperatingSystem from "@/features/os/OperatingSystem";
import { WindowProvider } from "@/contexts/WindowContext";
import { WallpaperProvider } from "@/contexts/WallpaperContext";
import { preloadAllSounds } from "@/lib/sounds";

function HomeContent() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    preloadAllSounds();
  }, []);

  return (
    <>
      <OperatingSystem />

      <LoginScreen
        onComplete={() => setIsLoadingComplete(true)}
        isComplete={isLoadingComplete}
      />
    </>
  );
}

export default function Home() {
  return (
    <WallpaperProvider>
      <WindowProvider>
        <HomeContent />
      </WindowProvider>
    </WallpaperProvider>
  );
}
