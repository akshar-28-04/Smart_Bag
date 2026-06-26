export type AlertEventType =
  | "gps_connected"
  | "gps_lost"
  | "gps_restored"
  | "sos_activated"
  | "sos_cleared"
  | "entered_home_zone"
  | "exited_home_zone"
  | "entered_school"
  | "exited_school"
  | "device_online"
  | "device_offline";

export interface TimelineEvent {
  id: string;
  type: AlertEventType;
  title: string;
  description: string;
  severity: "success" | "info" | "warning" | "danger";
  icon: string;
  timestamp: number;
}
