import { mockEvents, mockLayout, mockLocations } from "./mock-data";
import { EventLayout, EventSummary, InvitationResponse, Location } from "./types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const fallbackMessage = `Erro ao chamar ${path}`;
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(data?.message ?? fallbackMessage);
  }

  return response.json() as Promise<T>;
}

export async function listLocations(token?: string): Promise<Location[]> {
  if (!token) return mockLocations;

  const data = await request<{ locations: Location[] }>("/locations", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data.locations;
}

export async function listOrganizerEvents(token?: string): Promise<EventSummary[]> {
  if (!token) return mockEvents;

  return request<EventSummary[]>("/events", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getEventLayout(eventId: string, token?: string): Promise<EventLayout> {
  if (!token || eventId.startsWith("evt-")) return mockLayout;

  return request<EventLayout>(`/events/${eventId}/layout`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function sendInvitations(
  eventId: string,
  emails: string[],
  token?: string,
): Promise<InvitationResponse> {
  if (!token) {
    return {
      created: emails.map((email, index) => ({ email, token: `mock-token-${index + 1}` })),
      skipped: [],
    };
  }

  return request<InvitationResponse>(`/events/${eventId}/invitations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ emails }),
  });
}
