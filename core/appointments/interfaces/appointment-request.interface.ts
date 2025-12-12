export interface AppointmentRequest {
  serviceId: string; // UUID
  staffId: string; // UUID
  start: string; // ISO local del usuario "YYYY-MM-DDTHH:mm"
  end: string; // ISO local del usuario "YYYY-MM-DDTHH:mm"
  timeZone: string; // IANA time zone string. E.g., "America/New_York"
  comments?: string; // Optional comments
}
