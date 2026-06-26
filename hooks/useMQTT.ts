"use client";
import { useContext } from "react";
import { SmartBagContext } from "@/context/SmartBagContext";

export function useSmartBag() {
  const ctx = useContext(SmartBagContext);
  if (!ctx) {
    throw new Error("useSmartBag must be used within a SmartBagProvider");
  }
  return ctx;
}
