"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Plus, ArrowLeft, ArrowRight, RotateCw, Search } from "lucide-react";
import { useBrowserStore } from "@/stores/useBrowserStore";

export default function BrowserWindow() {
  const {
    tabs,
    activeTabId,
    pendingUrl,
    addTab,
    removeTab,
    setActiveTab,
    updateTab,
    clearPendingUrl,
    initializeBrowser,
  } = useBrowserStore();

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    initializeBrowser();
  }, [initializeBrowser]);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const isValidUrl = (str: string): boolean => {
    try {
      new URL(str.startsWith("http") ? str : `https://${str}`);
      return str.includes(".");
    } catch {
      return false;
    }
  };

  const handleNavigate = useCallback(
    (input: string) => {
      if (!input.trim()) return;

      let url: string;
      if (isValidUrl(input)) {
        url = input.startsWith("http") ? input : `https://${input}`;
      } else {
        url = `https://www.bing.com/search?q=${encodeURIComponent(input)}`;
      }

      updateTab(activeTabId, { url, title: input.slice(0, 20) });
      setInputValue("");
    },
    [activeTabId, updateTab]
  );

  // Handle pending URLs after browser is initialized
  useEffect(() => {
    if (pendingUrl && tabs.length > 0) {
      handleNavigate(pendingUrl);
      clearPendingUrl();
    }
  }, [pendingUrl, clearPendingUrl, handleNavigate, tabs.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNavigate(inputValue);
    }
  };

  const addNewTab = () => {
    const newTab = {
      id: Date.now().toString(),
      url: "about:blank",
      title: "New Tab",
    };
    addTab(newTab);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;

    removeTab(tabId);
  };

  const refreshTab = () => {
    if (activeTab) {
      const iframe = document.getElementById(
        `iframe-${activeTabId}`
      ) as HTMLIFrameElement;
      if (iframe) {
        iframe.src = iframe.src;
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-black/20">
      {/* Tabs bar */}
      <div className="flex items-center bg-white/5 border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 border-r border-white/10 cursor-pointer min-w-[150px] max-w-[200px] transition-colors ${
              activeTabId === tab.id
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white/80"
            }`}
          >
            <span className="flex-1 truncate text-sm">{tab.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className="hover:bg-white/10 rounded p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addNewTab}
          className="px-3 py-2 h-full hover:bg-white/10 border-r border-white/10 text-white/60 hover:text-white transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Navigation bar */}
      <div className="flex items-center gap-2 p-2 bg-white/5 border-b border-white/10">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
          title="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => window.history.forward()}
          className="p-2 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
          title="Forward"
        >
          <ArrowRight size={18} />
        </button>
        <button
          onClick={refreshTab}
          className="p-2 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
          title="Refresh"
        >
          <RotateCw size={18} />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-white/10 rounded px-3 py-1.5">
          <Search size={16} className="text-white/40" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeTab?.url || "Search or enter URL"}
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex relative bg-transparent">
        {tabs.map(
          (tab) =>
            tab.url !== "about:blank" && (
              <div key={tab.id} className="flex-1 bg-white">
                <iframe
                  id={`iframe-${tab.id}`}
                  src={tab.url === "about:blank" ? "" : tab.url}
                  className={`absolute overflow-hidden inset-0 w-full h-full border-none ${
                    activeTabId === tab.id ? "block" : "hidden"
                  }`}
                  title={tab.title}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              </div>
            )
        )}
      </div>
    </div>
  );
}
