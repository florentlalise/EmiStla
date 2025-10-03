"use client";

import Image from "next/image";
import { useWallpaper } from "@/contexts/WallpaperContext";

interface WallpaperProps {
  alt?: string;
  className?: string;
}

export default function Wallpaper({
  alt = "Application Wallpaper",
  className = "",
}: WallpaperProps) {
  const { wallpaperUrl, isLoading } = useWallpaper();

  if (isLoading) {
    return null;
  }

  return (
    <Image
      src={wallpaperUrl}
      fill
      alt={alt}
      sizes="100vw"
      className={`-z-10 object-cover ${className}`}
      priority
      quality={100}
      unoptimized
    />
  );
}
