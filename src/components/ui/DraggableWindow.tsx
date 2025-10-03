"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import Draggable from "react-draggable";
import { getNextZIndex } from "@/lib/windowManager";
import { useWindows } from "@/contexts/WindowContext";

interface DraggableWindowProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  windowId: string;
  isFocused: boolean;
  onFocus: () => void;
  width?: number;
  height?: number;
}

export default function DraggableWindow({
  isOpen,
  onClose,
  children,
  windowId,
  isFocused,
  onFocus,
  width = 600,
  height = 400,
}: DraggableWindowProps) {
  const nodeRef = useRef(null);
  const [zIndex, setZIndex] = useState(50);
  const { getWindowConfig } = useWindows();
  const windowConfig = getWindowConfig(windowId);
  const Icon = windowConfig.icon;

  const handleFocus = useCallback(() => {
    setZIndex(getNextZIndex());
    onFocus();
  }, [onFocus]);

  useEffect(() => {
    if (isFocused) {
      setZIndex(getNextZIndex());
    }
  }, [isFocused]);

  if (!isOpen) return null;

  return (
    <Draggable handle=".window-header" nodeRef={nodeRef} onStart={handleFocus}>
      <div
        ref={nodeRef}
        onMouseDown={handleFocus}
        style={{ zIndex, width: `${width}px`, height: `${height}px` }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-md rounded-lg shadow-2xl"
      >
        <div className="window-header flex items-center justify-between h-10 px-4 bg-white/10 rounded-t-lg cursor-move">
          <div className="flex items-center gap-2">
            <Icon size={14} />
            <h2 className="text-xs font-medium">{windowConfig.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <div className="h-[calc(100%-2.5rem)] overflow-auto">{children}</div>
      </div>
    </Draggable>
  );
}
