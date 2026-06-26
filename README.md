# SmartBag
**Know Where Your Child Is. Anytime. Anywhere.**

> A real-time IoT dashboard for a GPS-enabled child safety smart bag.

---

## Overview

SmartBag is a real-time IoT dashboard that pairs with an ESP32 + NEO-6M GPS module placed inside a child's school bag. The device publishes location and SOS data to HiveMQ Cloud via MQTT over TLS. This frontend replaces all mock data with live MQTT data — map markers animate smoothly, SOS alerts trigger full-screen overlays, and analytics are computed from incoming GPS points in real-time.

---

## Features

- **Live GPS Tracking** — Marker position updates instantly on every MQTT message with smooth `requestAnimationFrame` animation. Map centers on first connection only; zoom stays unchanged.

- **SOS Emergency Mode** — When `smartbag/sos=true` arrives, a full-screen animated overlay appears (flashing red background, pulsing SOS badge, siren animation). Auto-hides when `smartbag/sos=false`.

- **Device Health** — Real-time diagnostics: GPS Fix (green/red), satellite count, WiFi/MQTT connection status, heartbeat timer with inter-arrival bar chart.

- **Journey Analytics** — Stores the latest 100 GPS points. Computes distance travelled (Haversine formula), average speed, maximum speed, and journey duration. Speed-over-time and cumulative distance charts render live.

- **Connection Management** — Shows "Connecting to Device" spinner on startup and "Waiting for Device" with troubleshooting tips when disconnected. Auto-retries every 5 seconds.

- **Safe Zones (Geofencing)** — Define virtual boundaries (Home, School, Tuition) with configurable radius.

- **Modern Design** — Fully responsive, dark-mode glassmorphism UI with Framer Motion animations.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Maps:** Leaflet & React-Leaflet
- **Charts:** Recharts
- **Icons:** Lucide React
- **MQTT Client:** mqtt.js v5 (WebSocket Secure)

---

## Architecture

```
ESP32 (publishes over MQTT/TLS every 5s)
  ↓  smartbag/location  |  smartbag/sos
HiveMQ Cloud Broker
  ↓  WSS (WebSocket Secure)
/lib/mqtt.ts  (singleton client, auto-reconnect)
  ↓  events
/context/SmartBagContext.tsx  (100-point ring buffer, Haversine analytics)
  ↓  React Context
Dashboard Pages
```

### MQTT Payloads

**Topic:** `smartbag/location`

```json
{
  "latitude": 12.924305,
  "longitude": 77.501243,
  "speed": 0.2,
  "satellites": 8,
  "gpsFix": true,
  "gpsStatus": "FIXED",
  "maps": "https://maps.google.com/?q=12.924305,77.501243"
}
```

**Topic:** `smartbag/sos`

```
true   → activates SOS overlay
false  → hides SOS overlay
```

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A HiveMQ Cloud account (free tier works) with credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akshar-28-04/Smart_Bag.git
   cd Smart_Bag
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_MQTT_HOST=your-instance.s1.eu.hivemq.cloud
   NEXT_PUBLIC_MQTT_PORT=8884
   NEXT_PUBLIC_MQTT_USERNAME=your-hivemq-username
   NEXT_PUBLIC_MQTT_PASSWORD=your-hivemq-password
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

### Testing Without Hardware

Use the HiveMQ Cloud Web Client or any MQTT CLI to publish test messages:

```bash
# Location update
mosquitto_pub -h <host> -p 8883 -u <user> -P <pass> \
  -t smartbag/location \
  -m '{"latitude":12.924305,"longitude":77.501243,"speed":1.2,"satellites":8,"gpsFix":true,"gpsStatus":"FIXED","maps":"https://maps.google.com/?q=12.924305,77.501243"}'

# Trigger SOS
mosquitto_pub -h <host> -p 8883 -u <user> -P <pass> -t smartbag/sos -m "true"

# Clear SOS
mosquitto_pub -h <host> -p 8883 -u <user> -P <pass> -t smartbag/sos -m "false"
```

---

## Project Structure

```
├── types/
│   └── smartbag.ts              MQTT payloads & state types
├── lib/
│   ├── mqtt.ts                  MQTT client singleton (WSS, auto-reconnect)
│   ├── demo-data.ts             Static demo data (safe zones, landing page)
│   └── types.ts                 Existing application types
├── hooks/
│   └── useMQTT.ts               useSmartBag() context hook
├── context/
│   └── SmartBagContext.tsx       Provider — MQTT state, GPS ring buffer, analytics
├── components/
│   ├── SOSAlertOverlay.tsx       Full-screen animated SOS alert
│   ├── WaitingForDevice.tsx      Disconnected state card
│   └── map/
│       ├── LiveTrackingMap.tsx   Live map with smooth marker + route trail
│       ├── MiniMap.tsx           Reusable small map
│       ├── RouteHistoryMap.tsx   Static route history viewer
│       └── SafeZonesMap.tsx      Geofence manager
├── app/
│   ├── layout.tsx               Root layout with SmartBagProvider
│   ├── globals.css              Tailwind + glassmorphism + SOS animations
│   ├── page.tsx                 Landing page (marketing)
│   ├── auth/
│   │   ├── login/               Login page
│   │   └── register/            Registration page
│   └── dashboard/
│       ├── layout.tsx           Dashboard shell + sidebar + SOS/WFD overlays
│       ├── page.tsx             KPI cards, device status, trip stats
│       ├── live-tracking/       Full live map page
│       ├── device-health/       GPS Fix, satellites, MQTT, heartbeat
│       ├── analytics/           Speed/distance charts, journey stats
│       ├── alerts/              Real-time alert timeline
│       ├── sos/                 SOS incident view
│       ├── route-history/       Static route viewer
│       ├── safe-zones/          Geofence manager
│       └── settings/            App settings
└── .env.local.example           Environment variable template
```

---

## Hardware Integration

The frontend connects directly to HiveMQ Cloud via WebSocket Secure. The hardware publishes every 5 seconds.

**Hardware Components:**
- ESP32 Microcontroller
- NEO-6M GPS Module
- SOS Button
- Red / Green LEDs
- Buzzer

The ESP32 firmware publishes to `smartbag/location` (JSON) and `smartbag/sos` (boolean). No backend API server is required — the dashboard is fully MQTT-native.

---

## Build

```bash
npm run build     # Production build
npm run lint      # ESLint
npm run dev       # Development server
```

---

## License

MIT
