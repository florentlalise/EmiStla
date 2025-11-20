"use client";

import { useState } from "react";
import { fileSystem, type FileSystemItem, type Folder } from "./projectsData";
import { playSound } from "@/lib/sounds";
import { useOpenInBrowser } from "@/lib/browserHelpers";
import { useWindows } from "@/contexts/WindowContext";

function isFolder(item: FileSystemItem): item is Folder {
  return "type" in item && item.type === "folder";
}

export default function ProjectsWindow() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const openInBrowser = useOpenInBrowser();
  const { openWindow } = useWindows();

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderName)) {
        playSound("organic2");
        next.delete(folderName);
      } else {
        playSound("organic3");
        next.add(folderName);
      }
      return next;
    });
  };

  const renderItem = (item: FileSystemItem, depth: number = 0) => {
    if (isFolder(item)) {
      const isExpanded = expandedFolders.has(item.name);
      return (
        <div key={item.name}>
          <div
            className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 cursor-pointer rounded"
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => toggleFolder(item.name)}
          >
            <span className="text-sm">{isExpanded ? "📂" : "📁"}</span>
            <span className="text-sm">{item.name}</span>
          </div>
          {isExpanded && (
            <div>
              {item.children.map((child) => renderItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    } else {
      const isDisabled = item.disabled;
      const handleClick = (e: React.MouseEvent) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }

        // If target is not browser, open in browser window
        if (item.target === "browser") {
          e.preventDefault();
          openInBrowser(item.url, () => openWindow("browser"));
        }
        // Otherwise, let the default behavior
      };

      return (
        <a
          key={item.name}
          href={isDisabled ? undefined : item.url}
          target={item.target}
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-2 py-1 rounded ${
            isDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-white/10 cursor-pointer"
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={handleClick}
        >
          <span className="text-sm">📄</span>
          <span
            className={`text-sm ${!isDisabled && "hover:underline"} ${
              item.name === "404" ? "glitch" : ""
            }`}
            data-text={item.name === "404" ? "§̴̢̛̦̗͉̈́͊̕͜͝¶̵̨̳̺̼̲̽̀͑̚͝∆̷̡̧̛̭̹̗̈́̓͌͝" : undefined}
          >
            {item.name === "404" ? "§̴̢̛̦̗͉̈́͊̕͜͝¶̵̨̳̺̼̲̽̀͑̚͝∆̷̡̧̛̭̹̗̈́̓͌͝" : item.name}
          </span>
        </a>
      );
    }
  };

  return (
    <div className="p-4">
      <div className="space-y-1">
        {fileSystem.map((item) => renderItem(item))}
      </div>
    </div>
  );
}
