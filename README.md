# SmartBag

**Know Where Your Child Is. Anytime. Anywhere.**

> A real-time IoT dashboard for a GPS-enabled child safety smart bag.

---

## Overview

SmartBag is a real-time IoT dashboard that pairs with an ESP32 + GPS module placed inside a child's school bag. The device publishes location and SOS data to HiveMQ Cloud via MQTT over TLS. The frontend displays live GPS tracking on a Leaflet map with smooth marker animations, persists data to Firebase Realtime Database, manages safe zones, computes journey analytics, and delivers instant SOS alerts — all without a backend server.

---

## Features

- **Live GPS Tracking** — Marker position updates instantly on every MQTT message with smooth `requestAnimationFrame` animation. Left status panel shows GPS, Speed, SOS, Satellites, Battery, MQTT, WiFi. Bottom floating strip shows GPS/MQTT/Firebase/ESP32 health.

- **SOS Emergency Mode** — When `smartbag/sos=true` arrives, a full-screen animated overlay appears (flashing red background, pulsing SOS badge, siren animation). Auto-hides when `smartbag/sos=false`. Alert pushed to Firebase.

- **Firebase Persistence** — Every MQTT location message is written to Firebase Realtime Database (`child/current`, `child/history`). Firebase listeners update the UI in real-time. Alerts and notifications are also persisted.

- **Collapsible Sidebar** — 7-item navigation (Dashboard, Live Tracking, Safe Zones, Analytics, Alerts, Device Health, Settings) with collapse state persisted in localStorage.

- **Notification Panel** — Bell icon with unread badge. Slide-down drawer lists Firebase notifications with mark-read and clear-all actions.

- **Profile Menu** — Avatar dropdown showing parent info, child/device info, emergency contacts, settings and logout links.

- **Device Health** — Real-time diagnostics: GPS Fix status, satellite count, WiFi/MQTT connection, heartbeat timer, plus Firebase device diagnostics (firmware, uptime, free heap, WiFi RSSI, MQTT latency, GPS HDOP, restart reason).

- **Journey Analytics** — Stores the latest 100 GPS points. Computes distance travelled (Haversine formula), average speed, maximum speed, and journey duration. Speed-over-time and cumulative distance charts render live.

- **Connection Management** — Shows "Connecting to Device" spinner on startup and "Waiting for Device" with troubleshooting tips when disconnected. Auto-retries every 5 seconds.

- **Safe Zones (Geofencing)** — Define virtual boundaries (Home, School, Tuition) with configurable radius. Entry/exit alerts via Firebase.

- **Modern Design** — Fully responsive, dark-mode glassmorphism UI with Framer Motion animations. Consistent `max-w-[1600px]` container on all dashboard pages.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Maps:** Leaflet & React-Leaflet
- **Charts:** Recharts
- **Icons:** Lucide React
- **MQTT Client:** mqtt.js v5 (WebSocket Secure)
- **Database:** Firebase Realtime Database (client SDK)
- **Language:** TypeScript (strict)

---

## Architecture

```
ESP32 (publishes over MQTT/TLS every 5s)
  ↓  smartbag/location  |  smartbag/sos
HiveMQ Cloud Broker
  ↓  WSS (WebSocket Secure)
services/mqtt.ts  (singleton client, auto-reconnect, Firebase bridge)
  ├─→ Firebase: child/current, child/history, child/alerts, child/notifications
  └─→ Events → SmartBagContext → Dashboard Pages
hooks/useFirebase.ts  ←── Firebase listeners (child/current, device, alerts, notifications, analytics)
hooks/useRealtime.ts  ←── Merges MQTT + Firebase state
```

### Data Flow

1. **ESP32** publishes JSON to `smartbag/location` every 5 seconds
2. **MQTT Service** (`services/mqtt.ts`) receives the message and:
   - Emits a "location" event to the React context
   - Writes current position + history to Firebase (when credentials are configured)
3. **SmartBagContext** updates React state from MQTT events
4. **useFirebase** hook listens to Firebase Realtime DB for persistent data
5. **useRealtime** hook merges both sources into a unified state
6. UI components re-render from context

### MQTT Payloads

**Topic:** `smartbag/location`

```json
{
  "latitude": 12.924305,
  "longitude": 77.501243,
  "speed": 0.2,
  "satellites": 8,
  "gpsFix": true,
  "gpsStatus": "FIXED"
}
```

**Topic:** `smartbag/sos`

```
true   → activates SOS overlay + Firebase alert/notification
false  → hides SOS overlay + Firebase alert
```

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A HiveMQ Cloud account (free tier works) with credentials
- (Optional) A Firebase project with Realtime Database for persistence

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
   # MQTT (required)
   NEXT_PUBLIC_MQTT_HOST=your-instance.s1.eu.hivemq.cloud
   NEXT_PUBLIC_MQTT_PORT=8884
   NEXT_PUBLIC_MQTT_USERNAME=your-hivemq-username
   NEXT_PUBLIC_MQTT_PASSWORD=your-hivemq-password

   # Firebase (optional — without these the app runs on MQTT-only mode)
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

### Testing Without Hardware

Use the HiveMQ Cloud Web Client or any MQTT CLI:

```bash
# Location update
mosquitto_pub -h <host> -p 8883 -u <user> -P <pass> \
  -t smartbag/location \
  -m '{"latitude":12.924305,"longitude":77.501243,"speed":1.2,"satellites":8,"gpsFix":true,"gpsStatus":"FIXED"}'

# Trigger SOS
mosquitto_pub -h <host> -p 8883 -u <user> -P <pass> -t smartbag/sos -m "true"

# Clear SOS
mosquitto_pub -h <host> -p 8883 -u <user> -P <pass> -t smartbag/sos -m "false"
```

---

## Project Structure

```
├── types/
│   ├── smartbag.ts              MQTT payloads & SmartBagState
│   ├── firebase.ts              Firebase schema interfaces
│   └── alerts.ts                Alert/timeline event types
├── lib/
│   ├── mqtt.ts                  Re-exports from services/mqtt.ts
│   └── demo-data.ts             Static demo data (safe zones, landing page)
├── services/
│   ├── firebase.ts              Firebase init + all Realtime DB writers/listeners
│   ├── mqtt.ts                  MQTT client singleton (WSS, auto-reconnect, Firebase bridge)
│   └── analytics.ts             Haversine distance + analytics computations
├── hooks/
│   ├── useMQTT.ts               useSmartBag() context hook
│   ├── useFirebase.ts           Firebase real-time listeners hook
│   └── useRealtime.ts           Unified MQTT + Firebase hook
├── context/
│   └── SmartBagContext.tsx       Provider — MQTT state, GPS ring buffer, analytics
├── components/
│   ├── SOSAlertOverlay.tsx       Full-screen animated SOS alert
│   ├── WaitingForDevice.tsx      Disconnected state card
│   ├── sidebar/
│   │   └── Sidebar.tsx          Collapsible sidebar (7 nav items, collapse persisted)
│   ├── profile/
│   │   └── ProfileMenu.tsx      Avatar dropdown with user/device/emergency info
│   ├── notifications/
│   │   └── NotificationPanel.tsx Bell icon, unread badge, Firebase notification drawer
│   ├── live-map/
│   │   └── LiveMap.tsx          Redesigned map: left status panel + Leaflet map + bottom strip
│   ├── device-health/
│   │   └── HealthCards.tsx      Reusable HealthCard & HealthStatusRow components
│   └── map/
│       ├── MiniMap.tsx           Reusable small map
│       ├── RouteHistoryMap.tsx   Static route history viewer
│       └── SafeZonesMap.tsx      Geofence manager
├── app/
│   ├── layout.tsx               Root layout with SmartBagProvider
│   ├── globals.css              Tailwind + glassmorphism + SOS animations
│   ├── page.tsx                 Landing page (hardware spec features)
│   ├── auth/
│   │   ├── login/               Login page
│   │   └── register/            Registration page
│   └── dashboard/
│       ├── layout.tsx           Dashboard shell — Sidebar, ProfileMenu, NotificationPanel, SOS/WFD
│       ├── page.tsx             KPI cards, device status, trip stats
│       ├── live-tracking/       LiveMap (status panel + Leaflet + bottom strip)
│       ├── device-health/       Diagnostics: GPS, MQTT, heartbeat + Firebase device data
│       ├── analytics/           Speed/distance charts, journey stats
│       ├── alerts/              Firebase + MQTT state change alert timeline
│       ├── sos/                 SOS incident view
│       ├── route-history/       Static route viewer
│       ├── safe-zones/          Geofence manager
│       └── settings/            App settings
└── .env.local.example           Environment variable template (MQTT + Firebase)
```

---

## Firebase Schema

The Firebase Realtime Database stores data under the `child/` path:

| Path | Type | Description |
|------|------|-------------|
| `child/current` | `FirebaseChildCurrent` | Latest GPS position, speed, satellites, SOS, connection status |
| `child/history` | `FirebaseHistoryPoint[]` | List of historical GPS points |
| `child/alerts` | `FirebaseAlert[]` | SOS and system alerts |
| `child/notifications` | `FirebaseNotification[]` | Push notification records |
| `child/device` | `FirebaseDevice` | Device diagnostics (firmware, uptime, heap, RSSI, latency, HDOP) |
| `child/analytics` | `FirebaseAnalytics` | Distance, avg/max speed, trip duration |

See `types/firebase.ts` for the full interface definitions.

---

## Hardware Integration

The frontend connects directly to HiveMQ Cloud via WebSocket Secure. The hardware publishes every 5 seconds.

**Hardware Components:**
- ESP32 Microcontroller
- NEO-6M / NEO-8M GPS Module
- SOS Button
- Red / Green LEDs
- Buzzer

The ESP32 firmware publishes to `smartbag/location` (JSON) and `smartbag/sos` (boolean). No backend API server is required — the dashboard is fully MQTT-native with optional Firebase persistence.

---

## Build

```bash
npm run build       # Production build (type-check + compile)
npm run lint        # ESLint
npm run dev         # Development server (Turbopack)
npx tsc --noEmit    # TypeScript type check only
```

---

## License

MIT
