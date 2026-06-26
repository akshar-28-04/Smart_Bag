import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  push,
  update,
  remove,
  onValue,
  off,
  type DatabaseReference,
  type Unsubscribe,
} from "firebase/database";
import type {
  FirebaseChildCurrent,
  FirebaseHistoryPoint,
  FirebaseAlert,
  FirebaseNotification,
  FirebaseDevice,
  FirebaseAnalytics,
  FirebaseUser,
  FirebaseSafeZone,
} from "@/types/firebase";

let app: FirebaseApp | null = null;
let db: ReturnType<typeof getDatabase> | null = null;

function init(): boolean {
  if (db) return true;
  if (typeof window === "undefined") return false;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!apiKey || !databaseURL || !projectId) {
    console.warn("[Firebase] Missing environment variables");
    return false;
  }

  if (!getApps().length) {
    app = initializeApp({
      apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL,
      projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  } else {
    app = getApps()[0];
  }

  db = getDatabase(app);
  return true;
}

// ── Writers ──────────────────────────────────────────────────────────────────

export function updateChildCurrent(data: Partial<FirebaseChildCurrent>) {
  if (!init()) return;
  const now = Date.now();
  update(ref(db!, "child/current"), { ...data, timestamp: now });
}

export function pushHistory(point: FirebaseHistoryPoint) {
  if (!init()) return;
  push(ref(db!, "child/history"), point);
}

export function pushAlert(alert: FirebaseAlert) {
  if (!init()) return;
  push(ref(db!, "child/alerts"), alert);
}

export function pushNotification(notif: Omit<FirebaseNotification, "id">) {
  if (!init()) return;
  push(ref(db!, "child/notifications"), notif);
}

export function updateDevice(info: Partial<FirebaseDevice>) {
  if (!init()) return;
  update(ref(db!, "child/device"), info);
}

export function updateAnalytics(stats: Partial<FirebaseAnalytics>) {
  if (!init()) return;
  update(ref(db!, "child/analytics"), stats);
}

// ── Readers / Listeners ──────────────────────────────────────────────────────

export function listenChildCurrent(
  cb: (data: FirebaseChildCurrent | null) => void
): Unsubscribe {
  if (!init()) return () => {};
  const r = ref(db!, "child/current");
  const fn = onValue(r, (snap) => cb(snap.val()));
  return () => off(r, "value", fn);
}

export function listenAlerts(cb: (alerts: FirebaseAlert[]) => void): Unsubscribe {
  if (!init()) return () => {};
  const r = ref(db!, "child/alerts");
  const fn = onValue(r, (snap) => {
    const val = snap.val();
    const list: FirebaseAlert[] = val
      ? Object.values(val)
      : [];
    cb(list.sort((a, b) => b.timestamp - a.timestamp));
  });
  return () => off(r, "value", fn);
}

export function listenNotifications(
  cb: (notifs: FirebaseNotification[]) => void
): Unsubscribe {
  if (!init()) return () => {};
  const r = ref(db!, "child/notifications");
  const fn = onValue(r, (snap) => {
    const val = snap.val();
    const list: FirebaseNotification[] = val
      ? Object.entries(val).map(([id, v]) => ({ id, ...(v as Omit<FirebaseNotification, "id">) }))
      : [];
    cb(list.sort((a, b) => b.timestamp - a.timestamp));
  });
  return () => off(r, "value", fn);
}

export function listenDevice(
  cb: (data: FirebaseDevice | null) => void
): Unsubscribe {
  if (!init()) return () => {};
  const r = ref(db!, "child/device");
  const fn = onValue(r, (snap) => cb(snap.val()));
  return () => off(r, "value", fn);
}

export function listenAnalytics(
  cb: (data: FirebaseAnalytics | null) => void
): Unsubscribe {
  if (!init()) return () => {};
  const r = ref(db!, "child/analytics");
  const fn = onValue(r, (snap) => cb(snap.val()));
  return () => off(r, "value", fn);
}

export function markNotificationRead(id: string) {
  if (!init()) return;
  update(ref(db!, `child/notifications/${id}`), { read: true });
}

export function clearAllNotifications(ids: string[]) {
  if (!init()) return;
  ids.forEach((id) => set(ref(db!, `child/notifications/${id}`), null));
}

export function markAllNotificationsRead(ids: string[]) {
  if (!init()) return;
  ids.forEach((id) => update(ref(db!, `child/notifications/${id}`), { read: true }));
}

// ── Clear All Data ──────────────────────────────────────────────────────────

export function clearAlerts() {
  if (!init()) return;
  set(ref(db!, "child/alerts"), null);
}

export function clearHistory() {
  if (!init()) return;
  set(ref(db!, "child/history"), null);
}

export function clearAnalytics() {
  if (!init()) return;
  set(ref(db!, "child/analytics"), null);
}

// ── User ────────────────────────────────────────────────────────────────────

export function listenUser(
  uid: string,
  cb: (data: FirebaseUser | null) => void
): Unsubscribe {
  if (!init()) return () => {};
  const r = ref(db!, `users/${uid}`);
  const fn = onValue(r, (snap) => cb(snap.val()));
  return () => off(r, "value", fn);
}

// ── History ─────────────────────────────────────────────────────────────────

export function listenHistory(
  cb: (points: FirebaseHistoryPoint[]) => void
): Unsubscribe {
  if (!init()) return () => {};
  const r = ref(db!, "child/history");
  const fn = onValue(r, (snap) => {
    const val = snap.val();
    const list: FirebaseHistoryPoint[] = val
      ? Object.values(val)
      : [];
    cb(list);
  });
  return () => off(r, "value", fn);
}

// ── Safe Zones ──────────────────────────────────────────────────────────────

export function listenSafeZones(
  cb: (zones: FirebaseSafeZone[]) => void
): Unsubscribe {
  if (!init()) return () => {};
  const r = ref(db!, "child/safeZones");
  const fn = onValue(r, (snap) => {
    const val = snap.val();
    const list: FirebaseSafeZone[] = val
      ? Object.entries(val).map(([id, v]) => ({ id, ...(v as Omit<FirebaseSafeZone, "id">) }))
      : [];
    cb(list);
  });
  return () => off(r, "value", fn);
}

export function addSafeZone(zone: Omit<FirebaseSafeZone, "id">) {
  if (!init()) return;
  push(ref(db!, "child/safeZones"), zone);
}

export function updateSafeZone(id: string, data: Partial<FirebaseSafeZone>) {
  if (!init()) return;
  update(ref(db!, `child/safeZones/${id}`), data);
}

export function deleteSafeZone(id: string) {
  if (!init()) return;
  set(ref(db!, `child/safeZones/${id}`), null);
}

export function isFirebaseAvailable(): boolean {
  const k = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const d = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  return !!(k && d);
}
