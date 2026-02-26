"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  LayoutDashboard, LogOut, MapPin, Calendar,
  Armchair, CheckCircle, Loader2, AlertCircle, RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getEventLayout, createReservation, switchReservationSeat, cancelReservation } from "@/lib/api"
import type { EventLayout, SeatLayout, TableLayout } from "@/lib/types"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import Link from "next/link"

export default function GuestEventPage() {
  const params = useParams<{ eventId: string }>()
  const eventId = params.eventId
  const { data: session } = useSession()
  const token = session?.accessToken as string | undefined
  const router = useRouter()

  const [layout, setLayout] = useState<EventLayout | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  async function loadLayout() {
    setLoading(true)
    try {
      const data = await getEventLayout(eventId, token)
      setLayout(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar evento.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) { router.push("/login"); return }
    loadLayout()
  }, [eventId, token])

  const myReservationSeatId = layout?.event.myReservationSeatId ?? null
  const hasReservation = !!myReservationSeatId

  // Seleciona o assento
  function handleSelectSeat(seat: SeatLayout, table: TableLayout) {
    if (seat.isOccupied && !seat.isMine) return
    if (table.isFull && !seat.isMine) return
    setSelectedSeatId(seat.id === selectedSeatId ? null : seat.id)
  }

  async function handleConfirmSeat() {
    if (!token || !selectedSeatId) return
    setSubmitting(true)
    try {
      if (hasReservation) {
        // Troca de assento
        await switchReservationSeat(token, eventId, selectedSeatId)
        toast.success("Assento alterado com sucesso!")
      } else {
        // Nova reserva
        await createReservation(token, eventId, selectedSeatId)
        toast.success("Assento reservado! Até o evento.")
      }
      setSelectedSeatId(null)
      await loadLayout()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao reservar assento.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCancel() {
    if (!token) return
    if (!confirm("Cancelar sua reserva neste evento?")) return
    setCancelling(true)
    try {
      await cancelReservation(token, eventId)
      toast.success("Reserva cancelada.")
      await loadLayout()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cancelar reserva.")
    } finally {
      setCancelling(false)
    }
  }

  const eventDate = layout
    ? new Date(layout.event.date).toLocaleString("pt-BR", {
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : ""

  // Encontra o label do assento selecionado / reservado
  const allSeats = layout?.event.tables.flatMap((t) => t.seats) ?? []
  const myCurrentSeat = allSeats.find((s) => s.isMine)
  const selectedSeat = allSeats.find((s) => s.id === selectedSeatId)
  const selectedTable = layout?.event.tables.find((t) =>
    t.seats.some((s) => s.id === selectedSeatId)
  )

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

      <main className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Carregando evento...
          </div>
        ) : !layout ? (
          <p className="text-center text-slate-500 py-20">Evento não encontrado.</p>
        ) : (
          <>
            {/* Event info */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-indigo-600 mb-1">
                Escolha seu assento
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

            {/* My reservation banner */}
            {hasReservation && myCurrentSeat && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-indigo-900">
                      Sua reserva: {myCurrentSeat.label}
                    </p>
                    <p className="text-xs text-indigo-600">
                      Selecione outro assento para trocar, ou cancele abaixo.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50 rounded-xl text-xs"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Cancelar reserva"}
                </Button>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Tables */}
              <div className="lg:col-span-2 space-y-4">
                {layout.event.tables.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center shadow-sm">
                    <AlertCircle size={24} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">
                      Nenhuma mesa configurada ainda. Aguarde o organizador.
                    </p>
                  </div>
                ) : (
                  layout.event.tables.map((table) => {
                    const freeCount = table.seats.filter((s) => !s.isOccupied).length

                    return (
                      <div
                        key={table.id}
                        className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                          table.isFull
                            ? "border-slate-100 opacity-60"
                            : "border-slate-100 hover:shadow-md"
                        }`}
                      >
                        {/* Table header */}
                        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/60">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                              <Armchair size={13} className="text-slate-500" />
                            </div>
                            <span className="font-bold text-slate-700 text-sm">{table.name}</span>
                          </div>
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                              table.isFull
                                ? "bg-red-50 text-red-500 border border-red-100"
                                : freeCount === 1
                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            }`}
                          >
                            {table.isFull ? "Mesa cheia" : `${freeCount} livre${freeCount > 1 ? "s" : ""}`}
                          </span>
                        </div>

                        {/* Seats grid */}
                        <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {table.seats.map((seat) => {
                            const isSelected = seat.id === selectedSeatId
                            const isMyReserved = seat.isMine
                            const isBlockedOther = seat.isOccupied && !seat.isMine
                            const isDisabled = isBlockedOther || (table.isFull && !seat.isMine)

                            return (
                              <button
                                key={seat.id}
                                disabled={isDisabled}
                                onClick={() => handleSelectSeat(seat, table)}
                                title={seat.label}
                                className={`
                                  h-11 rounded-xl flex flex-col items-center justify-center gap-0.5
                                  text-[10px] font-semibold transition-all border
                                  ${isMyReserved
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200"
                                    : isSelected
                                    ? "bg-indigo-50 text-indigo-600 border-indigo-300 shadow-sm"
                                    : isDisabled
                                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                                  }
                                `}
                              >
                                <Armchair size={13} />
                                <span>{seat.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Right panel: Confirm */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
                  <div className="h-[3px] bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-800" />
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 mb-4">Sua seleção</h3>

                    {/* Legenda */}
                    <div className="space-y-2 mb-5">
                      {[
                        { color: "bg-indigo-600", label: "Meu assento atual", border: "border-indigo-600" },
                        { color: "bg-indigo-50", label: "Selecionado", border: "border-indigo-300" },
                        { color: "bg-white", label: "Disponível", border: "border-slate-200" },
                        { color: "bg-slate-50", label: "Ocupado", border: "border-slate-100" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-md ${item.color} border ${item.border} shrink-0`} />
                          <span className="text-xs text-slate-500">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-4 mb-4">
                      {selectedSeatId ? (
                        <div className="bg-indigo-50 rounded-xl p-3 text-sm">
                          <p className="text-indigo-400 text-[10px] uppercase tracking-widest font-semibold mb-1">
                            Assento selecionado
                          </p>
                          <p className="font-bold text-indigo-900">
                            {selectedTable?.name} — {selectedSeat?.label}
                          </p>
                        </div>
                      ) : hasReservation ? (
                        <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-500 text-center">
                          Selecione outro assento para trocar
                        </div>
                      ) : (
                        <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-500 text-center">
                          Toque em um assento disponível
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl mb-2"
                      disabled={!selectedSeatId || submitting}
                      onClick={handleConfirmSeat}
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : hasReservation ? (
                        "Trocar assento"
                      ) : (
                        "Confirmar reserva"
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-slate-400 text-xs gap-1"
                      onClick={loadLayout}
                    >
                      <RefreshCw size={12} />
                      Atualizar disponibilidade
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
