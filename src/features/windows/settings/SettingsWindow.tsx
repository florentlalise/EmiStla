"use client";

import { useState } from "react";
import { ImageIcon, Info } from "lucide-react";
import { playSound } from "@/lib/sounds";
import WallpaperTab from "./WallpaperTab";
import AboutTab from "./AboutTab";

type TabId = "wallpaper" | "about";

interface Tab {
  id: TabId;
  label: string;
  icon: typeof ImageIcon;
}

const tabs: Tab[] = [
  { id: "wallpaper", label: "Wallpaper", icon: ImageIcon },
  { id: "about", label: "About", icon: Info },
];

export default function SettingsWindow() {
  const [activeTab, setActiveTab] = useState<TabId>("wallpaper");

  const handleTabClick = (id: TabId) => {
    playSound("click4");
    setActiveTab(id);
  };

  return (
    <div className="flex h-full">
      {/* Menu */}
      <div className="w-48 bg-white/5 border-r border-white/10 p-2">
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 p-6">
        {activeTab === "wallpaper" && <WallpaperTab />}
        {activeTab === "about" && <AboutTab />}
      </div>
    </div>
  );
}
