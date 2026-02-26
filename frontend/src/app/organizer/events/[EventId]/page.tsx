"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  ChevronLeft, LayoutDashboard, LogOut, Send,
  Users, Table2, CheckCircle, Loader2, Plus,
  MapPin, Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  getEventLayout, sendInvitations, createEventTables,
} from "@/lib/api"
import type { EventLayout } from "@/lib/types"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

export default function OrganizerEventDetailPage() {
  const params = useParams<{ eventId: string }>()
  const eventId = params.eventId
  const { data: session } = useSession()
  const token = session?.accessToken as string | undefined
  const router = useRouter()

  const [layout, setLayout] = useState<EventLayout | null>(null)
  const [loadingLayout, setLoadingLayout] = useState(true)

  // Invites
  const [emails, setEmails] = useState("")
  const [sendingInvites, setSendingInvites] = useState(false)

  // Tables
  const [showAddTable, setShowAddTable] = useState(false)
  const [tableName, setTableName] = useState("")
  const [coordX, setCoordX] = useState("50")
  const [coordY, setCoordY] = useState("50")
  const [addingTable, setAddingTable] = useState(false)

  async function loadLayout() {
    try {
      const data = await getEventLayout(eventId, token)
      setLayout(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar layout.")
    } finally {
      setLoadingLayout(false)
    }
  }

  useEffect(() => {
    loadLayout()
  }, [eventId, token])

  const { totalSeats, occupiedSeats } = useMemo(() => {
    if (!layout) return { totalSeats: 0, occupiedSeats: 0 }
    const seats = layout.event.tables.flatMap((t) => t.seats)
    return {
      totalSeats: seats.length,
      occupiedSeats: seats.filter((s) => s.isOccupied).length,
    }
  }, [layout])

  async function handleSendInvites() {
    if (!token) return
    const normalizedEmails = emails.split(/[\s,]+/).map((e) => e.trim()).filter(Boolean)
    if (normalizedEmails.length === 0) {
      toast.error("Insira ao menos um e-mail.")
      return
    }
    setSendingInvites(true)
    try {
      const result = await sendInvitations(eventId, normalizedEmails, token)
      toast.success(`${result.created.length} convite(s) enviado(s). ${result.skipped.length} ignorado(s).`)
      setEmails("")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar convites.")
    } finally {
      setSendingInvites(false)
    }
  }

  async function handleAddTable(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setAddingTable(true)
    try {
      await createEventTables(token, eventId, [{
        name: tableName,
        coord_x: Number(coordX),
        coord_y: Number(coordY),
      }])
      toast.success("Mesa adicionada com sucesso!")
      setTableName("")
      setShowAddTable(false)
      await loadLayout()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar mesa.")
    } finally {
      setAddingTable(false)
    }
  }

  const occupancyPct = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0
  const eventDate = layout
    ? new Date(layout.event.date).toLocaleString("pt-BR", {
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : ""

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-100 px-6 h-16 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/organizer")}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors text-sm"
          >
            <ChevronLeft size={16} />
            Voltar
          </button>
          <div className="w-px h-5 bg-slate-200" />
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <LayoutDashboard size={16} />
            </div>
            Event<span className="text-indigo-600">Pro</span>
          </Link>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 hover:text-red-500"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut size={15} className="mr-1" />
          Sair
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {loadingLayout ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Carregando evento...
          </div>
        ) : !layout ? (
          <p className="text-slate-500 text-center py-20">Evento não encontrado.</p>
        ) : (
          <>
            {/* Event header */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-indigo-600 mb-1">
                Gerenciar Evento
              </p>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                {layout.event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-indigo-500" />
                  {eventDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-indigo-500" />
                  {layout.event.location.name} — {layout.event.location.address}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">Mesas</p>
                <p className="text-3xl font-black text-slate-900">{layout.event.tables.length}</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">Total de assentos</p>
                <p className="text-3xl font-black text-slate-900">{totalSeats}</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">Ocupação</p>
                <p className="text-3xl font-black text-slate-900">
                  {occupiedSeats}
                  <span className="text-sm text-slate-400 font-normal">/{totalSeats}</span>
                </p>
                <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              {/* Left panel: Invites + Add table */}
              <div className="lg:col-span-2 space-y-4">

                {/* Invites */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="h-[3px] bg-gradient-to-r from-indigo-600 to-violet-500" />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Send size={14} className="text-indigo-600" />
                      </div>
                      <h2 className="font-bold text-slate-800">Enviar convites</h2>
                    </div>
                    <Textarea
                      rows={4}
                      value={emails}
                      onChange={(e) => setEmails(e.target.value)}
                      placeholder={"ana@email.com\nbruno@email.com\ncarlos@email.com"}
                      className="text-sm resize-none mb-3"
                    />
                    <p className="text-[11px] text-slate-400 mb-3">
                      Um e-mail por linha. O link de convite é gerado automaticamente.
                    </p>
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                      onClick={handleSendInvites}
                      disabled={sendingInvites}
                    >
                      {sendingInvites ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send size={14} className="mr-2" />
                          Enviar convites
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Add table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                          <Table2 size={14} className="text-slate-600" />
                        </div>
                        <h2 className="font-bold text-slate-800">Mesas</h2>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg gap-1 text-xs"
                        onClick={() => setShowAddTable(!showAddTable)}
                      >
                        <Plus size={12} />
                        Adicionar
                      </Button>
                    </div>

                    {showAddTable && (
                      <form onSubmit={handleAddTable} className="space-y-3 pt-3 border-t border-slate-100">
                        <Input
                          placeholder="Nome da mesa (ex: Mesa 1)"
                          value={tableName}
                          onChange={(e) => setTableName(e.target.value)}
                          required
                          className="text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-slate-400 font-medium">Posição X</label>
                            <Input
                              type="number"
                              value={coordX}
                              onChange={(e) => setCoordX(e.target.value)}
                              className="text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400 font-medium">Posição Y</label>
                            <Input
                              type="number"
                              value={coordY}
                              onChange={(e) => setCoordY(e.target.value)}
                              className="text-sm mt-1"
                            />
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm"
                          disabled={addingTable}
                        >
                          {addingTable ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirmar mesa"}
                        </Button>
                      </form>
                    )}

                    {layout.event.tables.length === 0 && !showAddTable && (
                      <p className="text-xs text-slate-400 text-center py-2">
                        Nenhuma mesa adicionada ainda.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right panel: Layout visual */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800">Layout do salão</h2>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-200" />
                        Livre
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-rose-100 border border-rose-200" />
                        Ocupado
                      </span>
                    </div>
                  </div>

                  {layout.event.tables.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                      Adicione mesas para ver o layout.
                    </div>
                  ) : (
                    <div className="grid-layout relative h-[400px] overflow-hidden">
                      {layout.event.tables.map((table) => (
                        <div
                          key={table.id}
                          className="absolute"
                          style={{ left: table.x, top: table.y }}
                        >
                          {/* Table circle */}
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 shadow-sm">
                            {table.name}
                          </div>
                          {/* Seats grid */}
                          <div className="mt-2 grid grid-cols-2 gap-1">
                            {table.seats.map((seat) => (
                              <div
                                key={seat.id}
                                className={`rounded px-2 py-0.5 text-center text-[10px] font-medium border ${
                                  seat.isOccupied
                                    ? "bg-rose-50 text-rose-600 border-rose-100"
                                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                }`}
                              >
                                {seat.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
