"use client";

import { Suspense, lazy, useMemo } from "react";
import Navbar from "@/features/navigation/navbar/Navbar";
import Dock from "@/features/navigation/dock/Dock";
import DraggableWindow from "@/components/ui/DraggableWindow";
import Wallpaper from "@/components/ui/Wallpaper";
import { useWindows } from "@/contexts/WindowContext";

export default function OperatingSystem() {
  const {
    windowConfigs,
    isWindowOpen,
    closeWindow,
    focusedWindow,
    focusWindow,
  } = useWindows();

  return (
    <main>
      <div className="flex flex-col min-h-screen min-w-screen relative _halftone">
        <Wallpaper />
        <div className="z-10">
          <Navbar />
        </div>

        <Dock />

        {windowConfigs.map((config) => {
          const LazyWindow = useMemo(
            () => lazy(config.component),
            [config.component]
          );
          return (
            <DraggableWindow
              key={config.id}
              windowId={config.id}
              isOpen={isWindowOpen(config.id)}
              onClose={() => closeWindow(config.id)}
              isFocused={focusedWindow === config.id}
              onFocus={() => focusWindow(config.id)}
              height={config.height}
              width={config.width}
            >
              <Suspense
                fallback={<div className="p-6 text-white/60">Loading...</div>}
              >
                <LazyWindow />
              </Suspense>
            </DraggableWindow>
          );
        })}
      </div>
    </main>
  );
}
