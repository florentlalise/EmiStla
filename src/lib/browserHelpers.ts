import { useBrowserStore } from "@/stores/useBrowserStore";

/**
 * Opens a URL in the browser window.
 */
export function openInBrowser(url: string, openWindowFn?: () => void) {
  const { openLink } = useBrowserStore.getState();
  openLink(url);

  // If a function to open the window is provided, call it
  if (openWindowFn) {
    openWindowFn();
  }
}

/**
 * Hook to get the openInBrowser function with automatic window opening
 */
export function useOpenInBrowser() {
  const { openLink } = useBrowserStore();

  return (url: string, openWindowFn?: () => void) => {
    openLink(url);
    if (openWindowFn) {
      openWindowFn();
    }
  };
}
