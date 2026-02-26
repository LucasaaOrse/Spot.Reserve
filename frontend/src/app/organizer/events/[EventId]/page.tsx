"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getEventLayout, sendInvitations } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { EventLayout } from "@/lib/types";

export default function OrganizerEventDetailPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;

  const [layout, setLayout] = useState<EventLayout | null>(null);
  const [emails, setEmails] = useState("ana@email.com\nbruno@email.com");
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken() ?? undefined;
    getEventLayout(eventId, token)
      .then(setLayout)
      .catch((error) => setResult(error instanceof Error ? error.message : "Falha ao carregar layout."));
  }, [eventId]);

  const occupiedSeats = useMemo(() => {
    if (!layout) return 0;
    return layout.event.tables.flatMap((table) => table.seats).filter((seat) => seat.isOccupied).length;
  }, [layout]);

  async function handleSendInvites() {
    const token = getToken() ?? undefined;
    const normalizedEmails = emails
      .split(/\s+/)
      .map((email) => email.trim())
      .filter(Boolean);

    try {
      const response = await sendInvitations(eventId, normalizedEmails, token);
      setResult(`Convites criados: ${response.created.length}. Ignorados: ${response.skipped.length}.`);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Falha ao enviar convites.");
    }
  }

  return (
    
      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Convites</CardTitle>
            <CardDescription>POST /events/:eventId/invitations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea rows={6} value={emails} onChange={(event) => setEmails(event.target.value)} />
            <Button className="w-full" onClick={handleSendInvites}>
              Enviar convites
            </Button>
            {result ? <p className="text-sm text-slate-600">{result}</p> : null}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{layout?.event.title ?? "Layout do evento"}</CardTitle>
            <CardDescription>
              GET /events/:eventId/layout • {occupiedSeats} assentos ocupados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid-layout relative h-[360px] overflow-hidden rounded-lg border bg-white">
              {layout?.event.tables.map((table) => (
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
      </section>
  );
}
