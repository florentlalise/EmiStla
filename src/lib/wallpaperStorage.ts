const DB_NAME = "emistla-db";
const DB_VERSION = 1;
const STORE_NAME = "wallpaper";
const WALLPAPER_KEY = "custom-wallpaper";

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
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
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
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

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
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
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
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
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
