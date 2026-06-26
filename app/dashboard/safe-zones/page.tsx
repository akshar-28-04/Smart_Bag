"use client";
import dynamic from "next/dynamic";

const SafeZonesMap = dynamic(() => import("@/components/map/SafeZonesMap"), { ssr: false });

export default function SafeZonesPage() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <SafeZonesMap />
    </div>
  );
}
