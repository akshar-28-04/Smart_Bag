"use client";
import dynamic from "next/dynamic";

const SafeZonesMap = dynamic(() => import("@/components/map/SafeZonesMap"), { ssr: false });

export default function SafeZonesPage() {
  return (
    <div className="h-full">
      <SafeZonesMap />
    </div>
  );
}
