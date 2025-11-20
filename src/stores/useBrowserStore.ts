import { create } from "zustand";

interface Tab {
  id: string;
  url: string;
  title: string;
}

interface BrowserStore {
  tabs: Tab[];
  activeTabId: string;
  pendingUrl: string | null;

  // Actions
  addTab: (tab: Tab) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<Tab>) => void;
  openLink: (url: string) => void;
  clearPendingUrl: () => void;
  initializeBrowser: () => void;
}

export const useBrowserStore = create<BrowserStore>((set, get) => ({
  tabs: [],
  activeTabId: "",
  pendingUrl: null,

  initializeBrowser: () => {
    const state = get();
    if (state.tabs.length === 0) {
      // If there's a pending URL, use it for the initial tab
      const hasPendingUrl = state.pendingUrl !== null;
      const initialTab: Tab = {
        id: "1",
        url: hasPendingUrl ? state.pendingUrl! : "about:blank",
        title: hasPendingUrl ? "Loading..." : "New Tab",
      };
      set({
        tabs: [initialTab],
        activeTabId: "1",
        // Clear pending URL 
        pendingUrl: null
      });
    }
  },

  addTab: (tab) =>
    set((state) => ({
      tabs: [...state.tabs, tab],
      activeTabId: tab.id,
    })),

  removeTab: (tabId) =>
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.id !== tabId);
      if (newTabs.length === 0) return state;

      let newActiveTabId = state.activeTabId;
      if (state.activeTabId === tabId) {
        const tabIndex = state.tabs.findIndex((t) => t.id === tabId);
        const newActiveIndex = Math.max(0, tabIndex - 1);
        newActiveTabId = newTabs[newActiveIndex].id;
      }

      return { tabs: newTabs, activeTabId: newActiveTabId };
    }),

  setActiveTab: (tabId) => set({ activeTabId: tabId }),

  updateTab: (tabId, updates) =>
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, ...updates } : tab
      ),
    })),

  openLink: (url) => set({ pendingUrl: url }),

  clearPendingUrl: () => set({ pendingUrl: null }),
}));
