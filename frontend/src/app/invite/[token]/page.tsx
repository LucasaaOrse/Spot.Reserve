"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Loader2, Mail, Lock, User, LayoutDashboard,
  MapPin, Calendar, CheckCircle, AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { getInvitationPreview, registerGuest } from "@/lib/api"
import type { InvitationPreview } from "@/lib/types"
import { signIn } from "next-auth/react"
import Link from "next/link"

const schema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
})

type FormValues = z.infer<typeof schema>

export default function InvitePage() {
  const params = useParams<{ token: string }>()
  const router = useRouter()
  const token = params.token

  const [preview, setPreview] = useState<InvitationPreview | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", password: "" },
  })

  useEffect(() => {
    getInvitationPreview(token)
      .then(setPreview)
      .catch((err) => setError(err instanceof Error ? err.message : "Convite inválido."))
      .finally(() => setLoadingPreview(false))
  }, [token])

  async function onSubmit(values: FormValues) {
    if (!preview) return
    setIsSubmitting(true)

    try {
      // 1. Cria a conta de GUEST + aceita o convite automaticamente
      await registerGuest({
        name: values.name,
        email: preview.invitation.email,
        password: values.password,
        invitationToken: token,
      })

      // 2. Faz login automático
      const result = await signIn("credentials", {
        email: preview.invitation.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Conta criada, mas houve erro no login. Faça login manualmente.")
        router.push("/login")
        return
      }

      toast.success("Bem-vindo! Agora escolha seu assento.")
      router.push(`/guest/event/${preview.event.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar conta.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading
  if (loadingPreview) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs tracking-widest uppercase font-medium">Verificando convite</span>
        </div>
      </div>
    )
  }

  // Convite inválido
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-[#0f0f14] border border-white/[0.06] rounded-2xl overflow-hidden max-w-md w-full">
          <div className="h-[3px] bg-gradient-to-r from-red-600 to-red-800" />
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-400" size={22} />
            </div>
            <h2 className="text-white font-bold text-lg mb-2">Convite inválido</h2>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <Link href="/">
              <Button className="bg-indigo-600 hover:bg-indigo-500 rounded-xl">
                Voltar ao início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const eventDate = preview ? new Date(preview.event.date).toLocaleString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }) : ""

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      {/* Grid bg */}
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md space-y-4">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-black text-2xl tracking-tight text-white">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <LayoutDashboard size={20} />
            </div>
            Event<span className="text-indigo-400">Pro</span>
          </Link>
        </div>

        {/* Card do evento */}
        {preview && (
          <div className="bg-[#0f0f14] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="h-[3px] bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-800" />
            <div className="p-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold tracking-widest uppercase mb-4">
                <CheckCircle size={11} />
                Você foi convidado
              </div>
              <h2 className="text-white font-black text-2xl leading-tight mb-1">
                {preview.event.title}
              </h2>
              {preview.event.description && (
                <p className="text-slate-500 text-sm mb-4">{preview.event.description}</p>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar size={13} className="text-indigo-400 shrink-0" />
                  <span>{eventDate}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin size={13} className="text-indigo-400 shrink-0" />
                  <span>{preview.event.location.name} — {preview.event.location.address}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card de cadastro */}
        <div className="bg-[#0f0f14] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-white font-bold text-base mb-1">Crie sua conta para confirmar presença</h3>
            <p className="text-slate-500 text-sm mb-5">
              O convite foi enviado para{" "}
              <span className="text-indigo-400 font-medium">{preview?.invitation.email}</span>
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">Seu nome</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            placeholder="Como quer ser chamado"
                            className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Email read-only */}
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                    <Input
                      value={preview?.invitation.email}
                      disabled
                      className="pl-10 bg-white/[0.02] border-white/[0.05] text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[11px] text-slate-600">Definido pelo convite — não pode ser alterado</p>
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">Crie uma senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 h-11 rounded-xl font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Confirmar presença e escolher assento"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center text-sm text-slate-500">
              Já tem conta?{" "}
              <Link href="/login" className="text-indigo-400 font-semibold hover:text-indigo-300">
                Fazer login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
