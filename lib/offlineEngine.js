const DB_NAME = 'MarginGuardOfflineDB';
const DB_VERSION = 1;

/**
 * Initializes and upgrades the IndexedDB database.
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Store for variation logs created offline
      if (!db.objectStoreNames.contains('pending_variations')) {
        db.createObjectStore('pending_variations', { keyPath: 'id', autoIncrement: true });
      }

      // Store for estimations generated offline
      if (!db.objectStoreNames.contains('pending_estimations')) {
        db.createObjectStore('pending_estimations', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves a record to a specified store in IndexedDB.
 */
export async function saveOfflineItem(storeName, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.add({ ...data, createdAt: new Date().toISOString() });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves all pending records from a specified store.
 */
export async function getOfflineItems(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Removes a synced item from IndexedDB by its local ID.
 */
export async function deleteOfflineItem(storeName, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Flushes the queue by attempting to sync pending records to Supabase once online.
 */
export async function syncPendingQueue(supabase) {
  if (!navigator.onLine) return { syncedCount: 0, status: 'offline' };

  const pendingVariations = await getOfflineItems('pending_variations');
  let syncedCount = 0;

  for (const item of pendingVariations) {
    const { id, ...record } = item;
    const { error } = await supabase.from('variation_logs').insert([record]);

    if (!error) {
      await deleteOfflineItem('pending_variations', id);
      syncedCount++;
    }
  }

  return { syncedCount, status: 'synced' };
}