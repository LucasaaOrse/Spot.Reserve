export type UserRole = "ADMIN" | "ORGANIZER" | "GUEST";

export interface Location {
  id: string;
  name: string;
  address: string;
  maxTables: number;
  maxSeatsPerTable: number;
}

export interface EventSummary {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  organizerId: string;
  locationId: string;
}

export interface SeatLayout {
  id: string;
  label: string;
  isOccupied: boolean;
}

export interface TableLayout {
  id: string;
  name: string;
  x: number;
  y: number;
  seats: SeatLayout[];
}

export interface EventLayout {
  event: {
    id: string;
    title: string;
    date: string;
    location: {
      name: string;
      address: string;
    };
    tables: TableLayout[];
  };
}

export interface InvitationResponse {
  created: Array<{ email: string; token: string }>;
  skipped: Array<{ email: string; reason: string }>;
}

export interface SessionResponse {
  token: string;
}

export interface EventCreateInput {
  title: string;
  description?: string;
  date: string;
  locationId: string;
}