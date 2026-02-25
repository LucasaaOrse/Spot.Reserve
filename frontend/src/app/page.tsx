"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MapPin, Send, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { mockEvents, mockLayout, mockLocations } from "@/lib/mock-data";

export default function HomePage() {
  const [eventId, setEventId] = useState(mockEvents[0].id);
  const [emails, setEmails] = useState("ana@email.com\nbruno@email.com");

  const selectedEvent = useMemo(() => mockEvents.find((event) => event.id === eventId) ?? mockEvents[0], [eventId]);
  const selectedLocation = useMemo(
    () => mockLocations.find((location) => location.id === selectedEvent.locationId) ?? mockLocations[0],
    [selectedEvent.locationId],
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-6 md:p-10">
      <header className="space-y-2">
        <Badge className="bg-emerald-100 text-emerald-700">Preview baseado no backend Fastify</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Spot Reserve • Frontend Next.js (proposta)</h1>
        <p className="text-sm text-slate-600">
          Estruturei as telas com base nas rotas do backend: autenticação, gestão de eventos do organizador, convites e
          visualização de layout de mesas/assentos.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sessão</CardTitle>
            <CardDescription>POST /sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="email" defaultValue="organizer@spot.com" />
            <Input placeholder="password" type="password" defaultValue="123456" />
            <Button className="w-full">Entrar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evento ativo</CardTitle>
            <CardDescription>GET /events e GET /events/:id/layout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={eventId}
              onChange={(event) => setEventId(event.target.value)}
            >
              {mockEvents.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            <div className="space-y-1 text-sm text-slate-600">
              <p className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {new Date(selectedEvent.date).toLocaleString("pt-BR")}
              </p>
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {selectedLocation.name}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Convites</CardTitle>
            <CardDescription>POST /events/:eventId/invitations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea rows={4} value={emails} onChange={(event) => setEmails(event.target.value)} />
            <Button variant="secondary" className="w-full gap-2">
              <Send className="h-4 w-4" />
              Simular envio
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Layout do evento</CardTitle>
            <CardDescription>
              Inspirado em GET /events/:eventId/layout e fluxo de reserva/troca de assento para convidados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid-layout relative h-[360px] overflow-hidden rounded-lg border bg-white">
              {mockLayout.event.tables.map((table) => (
                <div key={table.id} className="absolute" style={{ left: table.x, top: table.y }}>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-slate-300 bg-slate-100 text-xs font-semibold">
                    {table.name}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {table.seats.map((seat) => (
                      <div
                        key={seat.id}
                        className={`rounded px-2 py-1 text-center text-[10px] font-medium ${
                          seat.isOccupied ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {seat.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo da API</CardTitle>
            <CardDescription>Rotas-chave cobertas no frontend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1">
              <Ticket className="h-4 w-4" /> POST /events/:eventId/reservations
            </p>
            <p className="rounded-md bg-slate-100 px-2 py-1">PATCH /events/:eventId/reservations/me</p>
            <p className="rounded-md bg-slate-100 px-2 py-1">POST /invitations/accept</p>
            <p className="rounded-md bg-slate-100 px-2 py-1">CRUD de /locations</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
