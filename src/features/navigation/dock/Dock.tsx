"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { useWindows } from "@/contexts/WindowContext";
import { WINDOW_CONFIGS } from "@/contexts/WindowContext";
import { playSound } from "@/lib/sounds";

export default function Dock() {
  const { openWindows, openWindow, focusWindow, focusedWindow } = useWindows();

  const windowsList = WINDOW_CONFIGS.map((config) => {
    const Icon = config.icon;
    const isOpen = openWindows.has(config.id);
    const isFocused = focusedWindow === config.id;

    return {
      id: config.id,
      title: config.title,
      icon: <Icon size={20} />,
      isOpen,
      isFocused,
      onClick: () => {
        if (!isOpen) {
          openWindow(config.id);
        } else {
          focusWindow(config.id);
        }
      },
    };
  });

  const handleClick = (onClick: () => void) => {
    playSound("click1");
    onClick();
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 p-2 rounded-[12px] bg-black/70 backdrop-blur-[5px]">
          {windowsList.map((window) => (
            <Tooltip.Root key={window.id}>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => handleClick(window.onClick)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-[8px] transition-colors text-sm ${
                    window.isFocused
                      ? "bg-white/20 outline outline-white/30"
                      : "opacity-60 hover:opacity-100 hover:bg-white/5"
                  }`}
                >
                  {window.icon}
                  {window.isOpen && (
                    <div
                      className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 rounded-full bg-white/80 ${
                        window.isFocused ? "w-3" : "w-1"
                      }`}
                    />
                  )}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="relative px-3 py-2 text-sm rounded-[8px] bg-black/90 backdrop-blur-md border border-white/20 shadow-lg"
                  sideOffset={20}
                >
                  {window.title}
                  <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-black/90 border-b border-r border-white/20" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}
        </div>
      </div>
    </Tooltip.Provider>
  );
}
