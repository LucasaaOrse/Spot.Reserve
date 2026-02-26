"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createEvent, listLocations, listOrganizerEvents } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { EventSummary, Location } from "@/lib/types";

export default function OrganizerPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const [title, setTitle] = useState("Novo evento Spot Reserve");
  const [description, setDescription] = useState("Evento criado pelo frontend funcional");
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [locationId, setLocationId] = useState("");

  async function loadData() {
    setLoading(true);
    const token = getToken() ?? undefined;

    try {
      const [eventResponse, locationResponse] = await Promise.all([
        listOrganizerEvents(token),
        listLocations(token),
      ]);
      setEvents(eventResponse);
      setLocations(locationResponse);
      setLocationId((previous) => previous || locationResponse[0]?.id || "");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateEvent(event: FormEvent) {
    event.preventDefault();
    setMessage(null);

    try {
      const token = getToken() ?? undefined;
      await createEvent(
        {
          title,
          description,
          date: new Date(date).toISOString(),
          locationId,
        },
        token,
      );
      await loadData();
      setMessage("Evento criado com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao criar evento.");
    }
  }

  return (
      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Criar evento</CardTitle>
            <CardDescription>POST /events</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleCreateEvent}>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Título" />
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} />
              <Input type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} />
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={locationId}
                onChange={(event) => setLocationId(event.target.value)}
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              <Button className="w-full">Criar evento</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Eventos do organizador</CardTitle>
            <CardDescription>GET /events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? <p className="text-sm text-slate-500">Carregando...</p> : null}
            {!loading && events.length === 0 ? <p className="text-sm text-slate-500">Nenhum evento encontrado.</p> : null}
            {events.map((event) => (
              <div key={event.id} className="rounded-lg border bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-xs text-slate-500">{new Date(event.date).toLocaleString("pt-BR")}</p>
                  </div>
                  <Link className="text-sm font-medium text-blue-600" href={`/organizer/events/${event.id}`}>
                    Ver detalhe
                  </Link>
                </div>
              </div>
            ))}
            {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          </CardContent>
        </Card>
      </section>
  );
}
