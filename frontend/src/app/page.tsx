"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Search,
  Building2,
  CheckCircle,
  Armchair,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

type Location = {
  id: string;
  name: string;
  address: string;
  maxTables: number;
  maxSeatsPerTable: number;
};

type Table = {
  id: string;
  name: string;
  seats: {
    id: string;
    label: string;
    occupied: boolean;
  }[];
};

// ─── Custom Carousel ──────────────────────────────────────────────────────────
function LocationCarousel({ locations, isLoading }: { locations: Location[]; isLoading: boolean }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const go = useCallback(
    (dir: "prev" | "next") => {
      if (animating || locations.length <= 1) return;
      setDirection(dir === "next" ? "right" : "left");
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) =>
          dir === "next" ? (c + 1) % locations.length : (c - 1 + locations.length) % locations.length
        );
        setAnimating(false);
      }, 300);
    },
    [animating, locations.length]
  );

  if (isLoading) {
    return (
      <div className="h-[360px] rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs tracking-widest uppercase font-medium">Carregando espaços</span>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="h-[360px] rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center">
        <span className="text-slate-500 text-sm">Nenhum espaço cadastrado ainda.</span>
      </div>
    );
  }

  const loc = locations[current];

  return (
    <div className="relative select-none">
      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{ opacity: animating ? 0 : 1, transform: animating ? `translateX(${direction === "right" ? "-24px" : "24px"})` : "translateX(0)" }}
      >
        <div className="bg-[#0f0f14] border border-white/[0.06] rounded-2xl overflow-hidden">
          {/* Top bar accent */}
          <div className="h-[3px] bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-800" />

          <div className="p-8">
            {/* Label row */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-indigo-400">
                Espaço disponível
              </span>
              <span className="text-[10px] text-slate-600 font-mono">
                {String(current + 1).padStart(2, "0")} / {String(locations.length).padStart(2, "0")}
              </span>
            </div>

            {/* Name */}
            <h3 className="text-3xl font-black text-white tracking-tight mb-2 leading-none">{loc.name}</h3>

            {/* Address */}
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
              <MapPin size={13} className="text-indigo-400 shrink-0" />
              <span className="truncate">{loc.address}</span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Mesas</p>
                <p className="text-2xl font-black text-white">{loc.maxTables}</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Assentos</p>
                <p className="text-2xl font-black text-white">{loc.maxSeatsPerTable}<span className="text-xs text-slate-500 font-normal">/mesa</span></p>
              </div>
              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-4">
                <p className="text-[9px] uppercase tracking-widest text-indigo-400 mb-1">Capacidade</p>
                <p className="text-2xl font-black text-indigo-300">{loc.maxTables * loc.maxSeatsPerTable}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users size={13} />
                <span>{loc.maxTables * loc.maxSeatsPerTable} pessoas no total</span>
              </div>
              <button className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group">
                Ver detalhes <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {locations.length > 1 && (
        <div className="flex items-center gap-3 mt-5">
          {/* Dots */}
          <div className="flex items-center gap-1.5 flex-1">
            {locations.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (animating || i === current) return;
                  setDirection(i > current ? "right" : "left");
                  setAnimating(true);
                  setTimeout(() => { setCurrent(i); setAnimating(false); }, 300);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-indigo-500" : "w-1.5 bg-slate-700 hover:bg-slate-500"}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => go("prev")}
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => go("next")}
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [location, setLocation] = useState<Location[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`);
        const data = await response.json();
        const locationsList = data.locations || [];
        setLocation(locationsList);

        if (locationsList.length > 0) {
          const tablesResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/locations/${locationsList[0].id}/tables`
          );
          const tablesData = await tablesResponse.json();
          setTables(tablesData.tables || []);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleMainAction() {
    if (!session) { router.push("/login"); return; }
    router.push("/organizer");
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* ── HEADER ── */}
      <header className="border-b border-slate-100 px-6 h-16 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2 font-black text-xl tracking-tight">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <LayoutDashboard size={16} />
          </div>
          Event<span className="text-indigo-600">Pro</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">Espaços</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Como Funciona</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Preços</a>
        </nav>

        <div className="flex items-center gap-2">
          {!session ? (
            <Button variant="ghost" size="sm" className="text-slate-600" onClick={() => router.push("/login")}>Entrar</Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-slate-600" onClick={() => router.push("/organizer")}>Dashboard</Button>
          )}
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 rounded-lg" onClick={handleMainAction}>
            {session ? "Meus Eventos" : "Criar Evento"}
          </Button>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="relative py-24 px-6 overflow-hidden bg-slate-950">
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)", backgroundSize: "60px 60px" }}
          />
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Gestão de Assentos em Tempo Real
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.05]">
              Grandes eventos exigem{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                grande organização.
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mx-auto mb-12">
              Da locação do salão à escolha da cadeira — tudo em uma plataforma.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold"
                onClick={handleMainAction}
              >
                <Search className="mr-2 h-4 w-4" />
                {session ? "Gerenciar Evento" : "Encontrar Espaço"}
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl font-semibold border-white/10 text-slate-300 hover:bg-white/5 hover:text-white bg-transparent">
                Tenho um Convite
              </Button>
            </div>
          </div>
        </section>

        {/* ── DUAL FLOW ── */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <Tabs defaultValue="organizer" className="w-full">
            <div className="flex flex-col items-center mb-16 text-center">
              <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase mb-4">Como você usará a plataforma?</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6">Feito para cada perfil.</h2>
              <TabsList className="grid w-full max-w-xs grid-cols-2 bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="organizer" className="rounded-lg text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Organizador</TabsTrigger>
                <TabsTrigger value="guest" className="rounded-lg text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Convidado</TabsTrigger>
              </TabsList>
            </div>

            {/* ── ORGANIZER TAB ── */}
            <TabsContent value="organizer" className="grid md:grid-cols-2 gap-16 items-center outline-none">
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3">Para organizadores</p>
                  <h3 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
                    Gerencie salões inteiros com facilidade.
                  </h3>
                </div>

                <ul className="space-y-4">
                  {[
                    { label: "Cadastre espaços e salões", desc: "Adicione suas localidades e configure a capacidade." },
                    { label: "Distribua mesas e assentos", desc: "Monte o layout perfeito para cada evento." },
                    { label: "Monitore ocupação em tempo real", desc: "Veja quem confirmou presença na hora." },
                    { label: "Convites com tokens únicos", desc: "Cada convidado recebe um link exclusivo." },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="text-indigo-500 h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl" onClick={handleMainAction}>
                  Começar agora <ArrowRight size={15} className="ml-2" />
                </Button>
              </div>

              {/* ── CAROUSEL ── */}
              <LocationCarousel locations={location} isLoading={isLoading} />
            </TabsContent>

            {/* ── GUEST TAB ── */}
            <TabsContent value="guest" className="grid md:grid-cols-2 gap-16 items-center outline-none">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3">Para convidados</p>
                  <h3 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
                    Escolha seu lugar em segundos.
                  </h3>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Receba seu token de convite, acesse o mapa de assentos e reserve o seu lugar preferido antes que alguém o faça.
                </p>
                <Button variant="outline" className="rounded-xl border-slate-200">
                  Usar meu convite <ArrowRight size={15} className="ml-2" />
                </Button>
              </div>

              {/* Seats preview */}
              <div className="space-y-3">
                {tables.length === 0 && !isLoading && (
                  <p className="text-sm text-slate-400 italic">Nenhuma mesa disponível no momento.</p>
                )}
                {tables.map((table) => {
                  const free = table.seats.filter((s) => !s.occupied).length;
                  return (
                    <Card key={table.id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
                      <CardHeader className="py-3 px-5 flex-row items-center justify-between space-y-0 bg-slate-50/60">
                        <CardTitle className="text-sm font-bold text-slate-700">{table.name}</CardTitle>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${free === 0 ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}`}>
                          {free === 0 ? "Lotada" : `${free} livre${free > 1 ? "s" : ""}`}
                        </span>
                      </CardHeader>
                      <CardContent className="py-3 px-5 flex gap-2 flex-wrap">
                        {table.seats.map((seat) => (
                          <div
                            key={seat.id}
                            title={seat.label}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all
                              ${seat.occupied
                                ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed"
                                : "bg-white text-indigo-500 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50 shadow-sm cursor-pointer"
                              }`}
                          >
                            <Armchair size={14} />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-black text-xl text-white">
            Event<span className="text-indigo-500">Pro</span>
          </div>
          <p className="text-slate-600 text-sm">© 2026 Plataforma de Gestão de Eventos.</p>
          <div className="flex gap-4">
            <button className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacidade</button>
            <button className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Termos</button>
          </div>
        </div>
      </footer>
    </div>
  );
}