"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

function getRoleFromToken(token?: string): string | null {
  if (!token) return null
  try {
    const payload = token.split(".")[1]
    return JSON.parse(atob(payload))?.role ?? null
  } catch {
    return null
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    const role = getRoleFromToken(session?.accessToken as string)

    if (role === "ORGANIZER") {
      router.push("/organizer")
    } else if (role === "GUEST") {
      router.push("/")
    } else {
      router.push("/login")
    }
  }, [status, session, router])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs tracking-widest uppercase font-medium">Redirecionando</span>
      </div>
    </div>
  )
}
