"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth(requiredRole?: "ORGANIZER" | "GUEST") {
  const { data: session, status } = useSession()
  const router = useRouter()

  const token = session?.accessToken as string | undefined
  const role = session ? getRoleFromToken(token) : null
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    if (requiredRole && role !== requiredRole) {
      // Redireciona para a área correta baseado na role
      if (role === "ORGANIZER") router.push("/dashboard")
      else if (role === "GUEST") router.push("/")
      else router.push("/login")
    }
  }, [isLoading, isAuthenticated, role, requiredRole, router])

  return { token, role, isLoading, isAuthenticated, session }
}

// Decodifica o JWT sem biblioteca (apenas o payload)
function getRoleFromToken(token?: string): string | null {
  if (!token) return null
  try {
    const payload = token.split(".")[1]
    const decoded = JSON.parse(atob(payload))
    return decoded.role ?? null
  } catch {
    return null
  }
}
