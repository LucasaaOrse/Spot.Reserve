"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LayoutDashboard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <header className="border-b border-slate-100 px-6 h-16 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-50">
      <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
          <LayoutDashboard size={16} />
        </div>
        Event<span className="text-indigo-600">Pro</span>
      </Link>

      <div className="flex items-center gap-2">
        {session ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-red-500"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut size={15} className="mr-1" />
              Sair
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600"
              onClick={() => router.push("/login")}
            >
              Entrar
            </Button>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              onClick={() => router.push("/register")}
            >
              Criar conta
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
