"use client";

import { ComponentType, useEffect, useState } from "react";
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

  const [loadedComponents, setLoadedComponents] = useState<
    Map<string, ComponentType>
  >(new Map());

  // Eagerly load all window components on mount
  useEffect(() => {
    const loadComponents = async () => {
      const componentMap = new Map<string, ComponentType>();

      await Promise.all(
        windowConfigs.map(async (config) => {
          const loadedModule = await config.component();
          componentMap.set(config.id, loadedModule.default);
        })
      );

      setLoadedComponents(componentMap);
    };

    loadComponents();
  }, [windowConfigs]);

  return (
    <main>
      <div className="flex flex-col min-h-screen min-w-screen relative _halftone">
        <Wallpaper />
        <div className="z-10">
          <Navbar />
        </div>

        <Dock />

        {windowConfigs.map((config) => {
          const WindowComponent = loadedComponents.get(config.id);

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
              initialPosition={config.initialPosition}
            >
              {WindowComponent ? (
                <WindowComponent />
              ) : (
                <div className="p-6 text-white/60">Loading...</div>
              )}
            </DraggableWindow>
          );
        })}
      </div>
    </main>
  );
}
