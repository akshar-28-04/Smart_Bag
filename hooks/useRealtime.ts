"use client";
import { useSmartBag } from "@/hooks/useMQTT";
import { useFirebase } from "@/hooks/useFirebase";
import { isFirebaseAvailable } from "@/services/firebase";

export function useRealtime() {
  const mqtt = useSmartBag();
  const firebase = useFirebase();
  const fbAvailable = isFirebaseAvailable();

  return {
    ...mqtt,
    firebase,
    firebaseAvailable: fbAvailable,
  };
}
