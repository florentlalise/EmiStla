"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  loadWallpaper,
  saveWallpaper,
  deleteWallpaper,
} from "@/lib/wallpaperStorage";

interface WallpaperContextType {
  wallpaperUrl: string;
  setCustomWallpaper: (file: File) => Promise<void>;
  resetWallpaper: () => Promise<void>;
  isCustomWallpaper: boolean;
  isLoading: boolean;
}

const DEFAULT_WALLPAPER = "/default_wallpaper.png";

const WallpaperContext = createContext<WallpaperContextType | undefined>(
  undefined
);

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [wallpaperUrl, setWallpaperUrl] = useState<string>(DEFAULT_WALLPAPER);
  const [isCustomWallpaper, setIsCustomWallpaper] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWallpaper()
      .then((url) => {
        if (url) {
          setWallpaperUrl(url);
          setIsCustomWallpaper(true);
        }
      })
      .catch((error) => {
        console.error("Failed to load custom wallpaper:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const setCustomWallpaper = async (file: File) => {
    const url = await saveWallpaper(file);
    setWallpaperUrl(url);
    setIsCustomWallpaper(true);
  };

  const resetWallpaper = async () => {
    await deleteWallpaper();
    setWallpaperUrl(DEFAULT_WALLPAPER);
    setIsCustomWallpaper(false);
  };

  return (
    <WallpaperContext.Provider
      value={{
        wallpaperUrl,
        setCustomWallpaper,
        resetWallpaper,
        isCustomWallpaper,
        isLoading,
      }}
    >
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error("useWallpaper must be used within WallpaperProvider");
  }
  return context;
}
