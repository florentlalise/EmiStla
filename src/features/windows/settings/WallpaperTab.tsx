"use client";

import { useState } from "react";
import { useWallpaper } from "@/contexts/WallpaperContext";
import Button from "@/components/ui/Button";
import { playSound } from "@/lib/sounds";

export default function WallpaperTab() {
  const { isCustomWallpaper, setCustomWallpaper, resetWallpaper } =
    useWallpaper();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      await setCustomWallpaper(file);
    } catch (error) {
      console.error("Failed to upload wallpaper:", error);
      alert("Failed to upload wallpaper");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetWallpaper();
    } catch (error) {
      console.error("Failed to reset wallpaper:", error);
      alert("Failed to reset wallpaper");
    }
  };

  const handleChooseImageClick = () => {
    playSound("click1");
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Wallpaper Settings</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Custom Wallpaper
          </label>
          <p className="text-white/60 text-xs mb-3">
            Upload your own wallpaper image (max 10MB)
          </p>

          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleChooseImageClick}
              disabled={uploading}
              asLabel
            >
              {uploading ? "Uploading..." : "Choose Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </Button>

            {isCustomWallpaper && (
              <Button variant="secondary" onClick={handleReset}>
                Reset to Default
              </Button>
            )}
          </div>
        </div>

        {isCustomWallpaper && (
          <div className="text-xs text-white/40">Using custom wallpaper</div>
        )}
      </div>
    </div>
  );
}
