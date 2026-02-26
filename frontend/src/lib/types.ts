export type UserRole = "ADMIN" | "ORGANIZER" | "GUEST"

export interface Location {
  id: string
  name: string
  address: string
  maxTables: number
  maxSeatsPerTable: number
}

// Evento simples (entidade)
export interface EventSummary {
  id: string
  title: string
  description?: string | null
  date: string
  organizerId: string
  locationId: string
}

// Evento enriquecido retornado pelo GET /events (organizador)
export interface EventWithDetails {
  id: string
  title: string
  description?: string | null
  date: string
  organizerId: string
  locationId: string
  locationName: string
  locationAddress: string
  maxTables: number
  maxSeatsPerTable: number
  tablesCount: number
  invitationsCount: number
  reservationsCount: number
}

export interface SeatLayout {
  id: string
  label: string
  isOccupied: boolean
  isMine: boolean
}

export interface TableLayout {
  id: string
  name: string
  x: number
  y: number
  isFull: boolean
  seats: SeatLayout[]
}

export interface EventLayout {
  event: {
    id: string
    title: string
    date: string
    myReservationSeatId: string | null
    location: {
      name: string
      address: string
    }
    tables: TableLayout[]
  }
}

export interface InvitationPreview {
  invitation: {
    token: string
    email: string
    status: string
  }
  event: {
    id: string
    title: string
    description?: string | null
    date: string
    location: {
      name: string
      address: string
    }
  }
}

export interface InvitationResponse {
  created: Array<{ email: string; token: string }>
  skipped: Array<{ email: string; reason: string }>
}

export interface SessionResponse {
  token: string
}

export interface EventCreateInput {
  title: string
  description?: string
  date: string
  locationId: string
}
