"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { acceptInvitation, createReservation, getEventLayout } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { EventLayout } from "@/lib/types";

export default function GuestPage() {
  const [invitationToken, setInvitationToken] = useState("");
  const [eventId, setEventId] = useState("");
  const [layout, setLayout] = useState<EventLayout | null>(null);
  const [selectedSeatId, setSelectedSeatId] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const freeSeats = useMemo(() => {
    if (!layout) return [];
    return layout.event.tables.flatMap((table) => table.seats).filter((seat) => !seat.isOccupied);
  }, [layout]);

  async function handleAcceptInvitation() {
    const token = getToken();
    if (!token) {
      setMessage("Faça login para aceitar o convite.");
      return;
    }

    try {
      const response = await acceptInvitation(token, invitationToken);
      setEventId(response.eventId);
      const loadedLayout = await getEventLayout(response.eventId, token);
      setLayout(loadedLayout);
      setSelectedSeatId(loadedLayout.event.tables[0]?.seats.find((seat) => !seat.isOccupied)?.id ?? "");
      setMessage("Convite aceito com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao aceitar convite.");
    }
  }

  async function handleReserveSeat() {
    const token = getToken();
    if (!token || !eventId || !selectedSeatId) {
      setMessage("Informe evento e assento válidos.");
      return;
    }

    try {
      await createReservation(token, eventId, selectedSeatId);
      setMessage("Assento reservado com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao reservar assento.");
    }
  }

  return (

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Aceitar convite</CardTitle>
            <CardDescription>POST /invitations/accept</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={invitationToken}
              onChange={(event) => setInvitationToken(event.target.value)}
              placeholder="Token de convite"
            />
            <Button className="w-full" onClick={handleAcceptInvitation}>
              Aceitar convite
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Reservar assento</CardTitle>
            <CardDescription>POST /events/:eventId/reservations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={eventId} onChange={(event) => setEventId(event.target.value)} placeholder="Event ID" />
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={selectedSeatId}
              onChange={(event) => setSelectedSeatId(event.target.value)}
            >
              <option value="">Selecione um assento</option>
              {freeSeats.map((seat) => (
                <option key={seat.id} value={seat.id}>
                  {seat.label}
                </option>
              ))}
            </select>
            <Button className="w-full" onClick={handleReserveSeat}>
              Reservar assento
            </Button>
            {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          </CardContent>
        </Card>
      </section>

  );
}
