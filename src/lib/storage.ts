const DB_NAME = "emistla-db";
const DB_VERSION = 2;
const WALLPAPER_STORE = "wallpaper";
const DATA_STORE = "data";
const WALLPAPER_KEY = "custom-wallpaper";
const NOTEPAD_KEY = "notepad-content";

/**
 * Initialize IndexedDB
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create wallpaper store if it doesn't exist
      if (!db.objectStoreNames.contains(WALLPAPER_STORE)) {
        db.createObjectStore(WALLPAPER_STORE);
      }

      // Create data store for text content and other data
      if (!db.objectStoreNames.contains(DATA_STORE)) {
        db.createObjectStore(DATA_STORE);
      }
    };
  });
}

/**
 * Save wallpaper image to IndexedDB
 * @param file - The image file to save
 * @returns Promise that resolves with the blob URL
 */
export async function saveWallpaper(file: File): Promise<string> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([WALLPAPER_STORE], "readwrite");
    const store = transaction.objectStore(WALLPAPER_STORE);

    const request = store.put(file, WALLPAPER_KEY);

    request.onsuccess = () => {
      const blobUrl = URL.createObjectURL(file);
      resolve(blobUrl);
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Load wallpaper image from IndexedDB
 * @returns Promise that resolves with the blob URL or null if no wallpaper is saved
 */
export async function loadWallpaper(): Promise<string | null> {
  try {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([WALLPAPER_STORE], "readonly");
      const store = transaction.objectStore(WALLPAPER_STORE);
      const request = store.get(WALLPAPER_KEY);

      request.onsuccess = () => {
        const file = request.result;
        if (file) {
          const blobUrl = URL.createObjectURL(file);
          resolve(blobUrl);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to load wallpaper:", error);
    return null;
  }
}

/**
 * Delete custom wallpaper from IndexedDB
 */
export async function deleteWallpaper(): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([WALLPAPER_STORE], "readwrite");
    const store = transaction.objectStore(WALLPAPER_STORE);
    const request = store.delete(WALLPAPER_KEY);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Check if a custom wallpaper exists
 */
export async function hasCustomWallpaper(): Promise<boolean> {
  try {
    const wallpaper = await loadWallpaper();
    return wallpaper !== null;
  } catch {
    return false;
  }
}

/**
 * Save notepad content to IndexedDB
 * @param content - The text content to save
 */
export async function saveNotepadContent(content: string): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([DATA_STORE], "readwrite");
    const store = transaction.objectStore(DATA_STORE);
    const request = store.put(content, NOTEPAD_KEY);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Load notepad content from IndexedDB
 * @returns Promise that resolves with the text content or null if nothing is saved
 */
export async function loadNotepadContent(): Promise<string | null> {
  try {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([DATA_STORE], "readonly");
      const store = transaction.objectStore(DATA_STORE);
      const request = store.get(NOTEPAD_KEY);

      request.onsuccess = () => {
        resolve(request.result ?? null);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to load notepad content:", error);
    return null;
  }
}
