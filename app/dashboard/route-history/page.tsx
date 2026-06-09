"use client";
import dynamic from "next/dynamic";

const RouteHistoryMap = dynamic(() => import("@/components/map/RouteHistoryMap"), { ssr: false });

export default function RouteHistoryPage() {
  return <RouteHistoryMap />;
}
