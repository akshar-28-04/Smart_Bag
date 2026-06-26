"use client";
import { useState, useEffect, useCallback } from "react";
import {
  listenChildCurrent,
  listenAlerts,
  listenNotifications,
  listenDevice,
  listenAnalytics,
  listenUser,
  listenSafeZones,
  listenHistory,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications,
  clearAlerts,
  clearHistory,
  clearAnalytics,
  addSafeZone,
  updateSafeZone,
  deleteSafeZone,
  isFirebaseAvailable,
} from "@/services/firebase";
import type {
  FirebaseChildCurrent,
  FirebaseAlert,
  FirebaseNotification,
  FirebaseDevice,
  FirebaseAnalytics,
  FirebaseUser,
  FirebaseSafeZone,
  FirebaseHistoryPoint,
} from "@/types/firebase";

const DEFAULT_UID = "default";

export function useFirebase() {
  const [childCurrent, setChildCurrent] = useState<FirebaseChildCurrent | null>(null);
  const [alerts, setAlerts] = useState<FirebaseAlert[]>([]);
  const [notifications, setNotifications] = useState<FirebaseNotification[]>([]);
  const [device, setDevice] = useState<FirebaseDevice | null>(null);
  const [analytics, setAnalytics] = useState<FirebaseAnalytics | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [safeZones, setSafeZones] = useState<FirebaseSafeZone[]>([]);
  const [historyPoints, setHistoryPoints] = useState<FirebaseHistoryPoint[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isFirebaseAvailable()) return;

    setConnected(true);

    const unsub1 = listenChildCurrent(setChildCurrent);
    const unsub2 = listenAlerts(setAlerts);
    const unsub3 = listenNotifications(setNotifications);
    const unsub4 = listenDevice(setDevice);
    const unsub5 = listenAnalytics(setAnalytics);
    const unsub6 = listenUser(DEFAULT_UID, setUser);
    const unsub7 = listenSafeZones(setSafeZones);
    const unsub8 = listenHistory(setHistoryPoints);

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      unsub5();
      unsub6();
      unsub7();
      unsub8();
    };
  }, []);

  const markRead = useCallback((id: string) => markNotificationRead(id), []);
  const markAllRead = useCallback(
    (ids: string[]) => markAllNotificationsRead(ids),
    []
  );
  const clearNotifs = useCallback(
    (ids: string[]) => clearAllNotifications(ids),
    []
  );
  const clearAlertList = useCallback(() => clearAlerts(), []);
  const clearHistoryData = useCallback(() => clearHistory(), []);
  const clearAnalyticsData = useCallback(() => clearAnalytics(), []);
  const addZone = useCallback(
    (zone: Omit<FirebaseSafeZone, "id">) => addSafeZone(zone),
    []
  );
  const editZone = useCallback(
    (id: string, data: Partial<FirebaseSafeZone>) => updateSafeZone(id, data),
    []
  );
  const removeZone = useCallback(
    (id: string) => deleteSafeZone(id),
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    childCurrent,
    alerts,
    notifications,
    device,
    analytics,
    user,
    safeZones,
    historyPoints,
    connected,
    unreadCount,
    markNotificationRead: markRead,
    markAllNotificationsRead: markAllRead,
    clearAllNotifications: clearNotifs,
    clearAlerts: clearAlertList,
    clearHistory: clearHistoryData,
    clearAnalytics: clearAnalyticsData,
    addSafeZone: addZone,
    updateSafeZone: editZone,
    deleteSafeZone: removeZone,
  };
}
