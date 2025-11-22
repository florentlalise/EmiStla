"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import Draggable from "react-draggable";
import { getNextZIndex } from "@/lib/windowManager";
import { useWindows } from "@/contexts/WindowContext";
import { convertToPixels } from "@/lib/utils";

interface DraggableWindowProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  windowId: string;
  isFocused: boolean;
  onFocus: () => void;
  width?: number;
  height?: number;
  initialPosition?: { x: number | string; y: number | string };
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
  initialPosition = { x: 0, y: 0 },
}: DraggableWindowProps) {
  const nodeRef = useRef(null);
  const [zIndex, setZIndex] = useState(50);
  const [size, setSize] = useState({ width, height });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startPosX: number;
    startPosY: number;
    direction: string;
  } | null>(null);
  const { getWindowConfig } = useWindows();
  const windowConfig = getWindowConfig(windowId);
  const Icon = windowConfig.icon;

  const handleFocus = useCallback(() => {
    setZIndex(getNextZIndex());
    onFocus();
  }, [onFocus]);

  useEffect(() => {
    setPosition({
      x: convertToPixels(initialPosition.x),
      y: convertToPixels(initialPosition.y),
    });
  }, [initialPosition]);

  useEffect(() => {
    if (isFocused) {
      setZIndex(getNextZIndex());
    }
  }, [isFocused]);

  useEffect(() => {
    const hasViewportUnits =
      typeof initialPosition.x === "string" ||
      typeof initialPosition.y === "string";

    if (!hasViewportUnits) return;

    const handleResize = () => {
      setPosition({
        x: convertToPixels(initialPosition.x),
        y: convertToPixels(initialPosition.y),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialPosition]);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      handleFocus();

      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: size.width,
        startHeight: size.height,
        startPosX: position.x,
        startPosY: position.y,
        direction,
      };
    },
    [size, position, handleFocus]
  );

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;

      const {
        startX,
        startY,
        startWidth,
        startHeight,
        startPosX,
        startPosY,
        direction,
      } = resizeRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newPosX = startPosX;
      let newPosY = startPosY;

      if (direction.includes("e")) {
        newWidth = Math.max(300, startWidth + deltaX);
      }
      if (direction.includes("w")) {
        const widthDiff = Math.max(300, startWidth - deltaX);
        newWidth = widthDiff;
        newPosX = startPosX + (startWidth - widthDiff);
      }
      if (direction.includes("s")) {
        newHeight = Math.max(200, startHeight + deltaY);
      }
      if (direction.includes("n")) {
        const heightDiff = Math.max(200, startHeight - deltaY);
        newHeight = heightDiff;
        newPosY = startPosY + (startHeight - heightDiff);
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newPosX, y: newPosY });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  if (!isOpen) return null;

  return (
    <Draggable
      handle=".window-header"
      nodeRef={nodeRef}
      onStart={handleFocus}
      position={position}
      onDrag={(_e, data) => {
        setPosition({ x: data.x, y: data.y });
      }}
      disabled={isResizing}
    >
      <div
        ref={nodeRef}
        onMouseDown={handleFocus}
        style={{
          zIndex,
          width: `${size.width}px`,
          height: `${size.height}px`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        className="fixed overflow-hidden bg-black/90 backdrop-blur-md rounded-lg shadow-2xl"
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

        {/* Resize handles */}
        <div
          onMouseDown={(e) => handleResizeStart(e, "e")}
          className="absolute top-0 right-0 w-1 h-full cursor-ew-resize"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, "w")}
          className="absolute top-0 left-0 w-1 h-full cursor-ew-resize"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, "s")}
          className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, "n")}
          className="absolute top-0 left-0 w-full h-1 cursor-ns-resize"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, "se")}
          className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, "sw")}
          className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, "ne")}
          className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, "nw")}
          className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize"
        />
      </div>
    </Draggable>
  );
}
