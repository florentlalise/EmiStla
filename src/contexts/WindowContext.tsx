"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  ComponentType,
} from "react";
import { Folder, Settings, LucideIcon, NotepadText } from "lucide-react";
import { playSound } from "@/lib/sounds";

export interface WindowConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  height: number;
  width: number;
  component: () => Promise<{ default: ComponentType }>;
}

export const WINDOW_CONFIGS: WindowConfig[] = [
  {
    id: "projects",
    title: "My Projects",
    icon: Folder,
    width: 450,
    height: 310,
    component: () => import("@/features/windows/projects/ProjectsWindow"),
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    width: 690,
    height: 520,
    component: () => import("@/features/windows/settings/SettingsWindow"),
  },
  {
    id: "notepad",
    title: "Notepad",
    icon: NotepadText,
    width: 830,
    height: 520,
    component: () => import("@/features/windows/notepad/NotepadWindow"),
  },
];

interface WindowContextType {
  openWindows: Set<string>;
  isWindowOpen: (windowId: string) => boolean;
  openWindow: (windowId: string) => void;
  closeWindow: (windowId: string) => void;
  focusedWindow: string | null;
  focusWindow: (windowId: string) => void;
  windowConfigs: WindowConfig[];
  getWindowConfig: (windowId: string) => WindowConfig;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export function WindowProvider({ children }: { children: ReactNode }) {
  const [openWindows, setOpenWindows] = useState<Set<string>>(new Set());
  const [focusedWindow, setFocusedWindow] = useState<string | null>(null);

  const isWindowOpen = (windowId: string) => openWindows.has(windowId);

  const openWindow = (windowId: string) => {
    setOpenWindows((prev) => new Set(prev).add(windowId));
    setFocusedWindow(windowId);
  };

  const closeWindow = (windowId: string) => {
    setOpenWindows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(windowId);
      playSound("click3");
      return newSet;
    });

    if (focusedWindow === windowId) {
      const remaining = Array.from(openWindows).filter((id) => id !== windowId);
      setFocusedWindow(
        remaining.length > 0 ? remaining[remaining.length - 1] : null
      );
    }
  };

  const focusWindow = (windowId: string) => {
    setFocusedWindow(windowId);
  };

  const getWindowConfig = (windowId: string) => {
    return (
      WINDOW_CONFIGS.find((config) => config.id === windowId) ||
      WINDOW_CONFIGS[0]
    );
  };

  return (
    <WindowContext.Provider
      value={{
        openWindows,
        isWindowOpen,
        openWindow,
        closeWindow,
        focusedWindow,
        focusWindow,
        windowConfigs: WINDOW_CONFIGS,
        getWindowConfig,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindows() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error("useWindows must be used within WindowProvider");
  }
  return context;
}
