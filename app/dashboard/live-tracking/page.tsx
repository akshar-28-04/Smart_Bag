"use client";
import dynamic from "next/dynamic";

const LiveTrackingMap = dynamic(() => import("@/components/map/LiveTrackingMap"), { ssr: false });

export default function LiveTrackingPage() {
  return <LiveTrackingMap />;
}
