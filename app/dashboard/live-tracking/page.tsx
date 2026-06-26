"use client";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("@/components/live-map/LiveMap"), { ssr: false });

export default function LiveTrackingPage() {
  return <LiveMap />;
}
