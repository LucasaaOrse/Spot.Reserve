import { mockEvents, mockLayout, mockLocations } from "./mock-data"
import type {
  EventCreateInput,
  EventLayout,
  EventSummary,
  EventWithDetails,
  InvitationPreview,
  InvitationResponse,
  Location,
  SessionResponse,
} from "./types"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"

console.log("API URL:", apiBaseUrl)

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(data?.message ?? `Erro ao chamar ${path}`)
  }

  if (response.status === 204) return {} as T

  return response.json() as Promise<T>
}

// ── AUTH ──────────────────────────────────────────────────────────────────────

export async function authenticate(email: string, password: string): Promise<SessionResponse> {
  return request<SessionResponse>("/sessions", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

// ── USERS ─────────────────────────────────────────────────────────────────────

export async function registerOrganizer(data: {
  name: string
  email: string
  password: string
}): Promise<void> {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function registerGuest(data: {
  name: string
  email: string
  password: string
  invitationToken: string
}): Promise<{ userId: string; eventId: string }> {
  return request("/users/guest", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// ── LOCATIONS ─────────────────────────────────────────────────────────────────

export async function listLocations(token?: string): Promise<Location[]> {
  if (!token) return mockLocations

  const data = await request<{ locations: Location[] }>("/locations", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data.locations
}

// ── EVENTS ────────────────────────────────────────────────────────────────────

export async function createEvent(
  input: EventCreateInput,
  token?: string,
): Promise<{ eventId: string }> {
  if (!token) return { eventId: `evt-local-${Date.now()}` }

  return request<{ eventId: string }>("/events", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  })
}

export async function listOrganizerEvents(token?: string): Promise<EventWithDetails[]> {
  if (!token) return mockEvents as unknown as EventWithDetails[]

  return request<EventWithDetails[]>("/events", {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function deleteEvent(eventId: string, token: string): Promise<void> {
  return request(`/events/${eventId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getEventLayout(eventId: string, token?: string): Promise<EventLayout> {
  if (!token || eventId.startsWith("evt-")) return mockLayout

  return request<EventLayout>(`/events/${eventId}/layout`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── INVITATIONS ───────────────────────────────────────────────────────────────

export async function getInvitationPreview(token: string): Promise<InvitationPreview> {
  return request<InvitationPreview>(`/invitations/preview?token=${token}`)
}

export async function sendInvitations(
  eventId: string,
  emails: string[],
  token?: string,
): Promise<InvitationResponse> {
  if (!token) {
    return {
      created: emails.map((email, i) => ({ email, token: `mock-token-${i + 1}` })),
      skipped: [],
    }
  }

  return request<InvitationResponse>(`/events/${eventId}/invitations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ emails }),
  })
}

export async function acceptInvitation(
  token: string,
  invitationToken: string,
): Promise<{ eventId: string }> {
  return request<{ eventId: string }>("/invitations/accept", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ token: invitationToken }),
  })
}

// ── RESERVATIONS ──────────────────────────────────────────────────────────────

export async function createReservation(
  token: string,
  eventId: string,
  seatId: string,
): Promise<{ reservationId: string }> {
  return request<{ reservationId: string }>(`/events/${eventId}/reservations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ seatId }),
  })
}

export async function switchReservationSeat(
  token: string,
  eventId: string,
  seatId: string,
): Promise<{ reservationId: string }> {
  return request<{ reservationId: string }>(`/events/${eventId}/reservations/me`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ seatId }),
  })
}

export async function cancelReservation(token: string, eventId: string): Promise<void> {
  return request(`/events/${eventId}/reservations/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── EVENT TABLES ──────────────────────────────────────────────────────────────

export async function createEventTables(
  token: string,
  eventId: string,
  tables: { name: string; coord_x: number; coord_y: number }[],
): Promise<{ count: number; seatsPerTable: number; totalTables: number; maxTables: number }> {
  return request(`/events/${eventId}/tables`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tables }),
  })
}
