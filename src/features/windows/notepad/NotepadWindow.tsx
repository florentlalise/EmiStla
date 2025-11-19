"use client";

import { useState, useEffect } from "react";
import {
  loadNotepadContent,
  saveNotepadContent,
} from "@/lib/storage";

export default function NotepadWindow() {
  const [text, setText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved content from IndexedDB on mount
  useEffect(() => {
    loadNotepadContent().then((savedContent) => {
      if (savedContent) {
        setText(savedContent);
      }
      setIsLoaded(true);
    });
  }, []);

  // Save content to IndexedDB whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveNotepadContent(text);
    }
  }, [text, isLoaded]);

  return (
    <div className="flex flex-col h-full w-full bg-transparent">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 w-full p-4 resize-none border-none outline-none font-mono text-sm leading-relaxed"
        placeholder="Start typing..."
        spellCheck={false}
      />
    </div>
  );
}
