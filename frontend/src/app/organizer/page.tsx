"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  Plus, Calendar, MapPin, Users, Table2,
  ChevronRight, Loader2, X, LayoutDashboard, LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createEvent, deleteEvent, listLocations, listOrganizerEvents } from "@/lib/api"
import type { EventWithDetails, Location } from "@/lib/types"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

export default function OrganizerPage() {
  const { data: session } = useSession()
  const token = session?.accessToken as string | undefined

  const [events, setEvents] = useState<EventWithDetails[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  )
  const [locationId, setLocationId] = useState("")

  async function loadData() {
    setLoading(true)
    try {
      const [evtsRes, locsRes] = await Promise.all([
        listOrganizerEvents(token),
        listLocations(token),
      ])
      setEvents(evtsRes)
      setLocations(locsRes)
      if (!locationId && locsRes.length > 0) setLocationId(locsRes[0].id)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar dados.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [token])

  async function handleCreateEvent(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    setCreating(true)
    try {
      await createEvent({ title, description, date: new Date(date).toISOString(), locationId }, token)
      toast.success("Evento criado com sucesso!")
      setShowForm(false)
      setTitle("")
      setDescription("")
      await loadData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar evento.")
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(eventId: string, title: string) {
    if (!token) return
    if (!confirm(`Deletar "${title}"? Esta ação não pode ser desfeita.`)) return
    try {
      await deleteEvent(eventId, token)
      toast.success("Evento deletado.")
      await loadData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao deletar evento.")
    }
  }

  const totalInvitations = events.reduce((s, e) => s + e.invitationsCount, 0)
  const totalReservations = events.reduce((s, e) => s + e.reservationsCount, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-100 px-6 h-16 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-50">
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <LayoutDashboard size={16} />
          </div>
          Event<span className="text-indigo-600">Pro</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 hidden md:block">
            Área do Organizador
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-red-500"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut size={15} className="mr-1" />
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-indigo-600 mb-1">
              Painel do Organizador
            </p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Meus Eventos</h1>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} />
            Novo evento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Eventos", value: events.length },
            { label: "Convidados", value: totalInvitations },
            { label: "Reservas", value: totalReservations },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Events list */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Carregando...
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
            <p className="text-slate-400 text-sm mb-4">Nenhum evento criado ainda.</p>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              onClick={() => setShowForm(true)}
            >
              Criar primeiro evento
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {events.map((event) => {
              const eventDate = new Date(event.date).toLocaleString("pt-BR", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })
              const occupancyPct = event.invitationsCount > 0
                ? Math.round((event.reservationsCount / event.invitationsCount) * 100)
                : 0

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 truncate">{event.title}</h3>
                        {event.tablesCount === 0 && (
                          <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                            Sem mesas
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {eventDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {event.locationName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Table2 size={11} />
                          {event.tablesCount}/{event.maxTables} mesas
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {event.reservationsCount}/{event.invitationsCount} confirmados
                        </span>
                      </div>

                      {/* Progress bar */}
                      {event.invitationsCount > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full transition-all"
                              style={{ width: `${occupancyPct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium w-8 text-right">
                            {occupancyPct}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X size={15} />
                      </button>
                      <Link href={`/organizer/events/${event.id}`}>
                        <Button size="sm" variant="outline" className="rounded-xl gap-1 text-xs">
                          Gerenciar
                          <ChevronRight size={13} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal de criar evento */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />

          <div className="relative bg-[#0f0f14] border border-white/[0.06] rounded-2xl overflow-hidden w-full max-w-lg">
            <div className="h-[3px] bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-800" />

            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">Novo evento</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm font-medium block mb-1.5">Título</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nome do evento"
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                    required
                    minLength={5}
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-medium block mb-1.5">Descrição</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição opcional"
                    rows={2}
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-1.5">Data e hora</label>
                    <Input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-1.5">Espaço</label>
                    <select
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="h-9 w-full rounded-md border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id} className="bg-slate-900">
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 text-slate-400 hover:text-white"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                    disabled={creating}
                  >
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar evento"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
