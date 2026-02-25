"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home, ShoppingCart,
  Package, Tags,
  Users, BarChart3,
  Percent, Star,
  Bell, Settings,
  HelpCircle, ChevronLeft,
  LogOut, Lock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<{ nombre: string, email: string, rol: string } | null>(null)
  const [loading, setLoading] = useState(true)

  
  const menuItems = [
    { name: "Inicio", href: "/dashboard", icon: Home, roles: ["admin", "vendedor", ""] },
    { name: "Ventas", href: "/dashboard/ventas", icon: ShoppingCart, roles: ["admin", "vendedor"] },
    { name: "Categorías", href: "/dashboard/categorias", icon: Tags, roles: ["admin", "vendedor", ""] },
    { name: "Marcas", href: "/dashboard/marcas", icon: Tags, roles: ["admin", "vendedor", ""] },
    { name: "Productos", href: "/dashboard/productos", icon: Package, roles: ["admin", "vendedor", ""] },
    { name: "Clientes", href: "/dashboard/usuarios", icon: Users, roles: ["admin", "vendedor"] },
    { name: "Estadísticas", href: "/dashboard/stats", icon: BarChart3, roles: ["admin", "vendedor"] },
    { name: "Descuentos", href: "/dashboard/descuentos", icon: Percent, roles: ["admin", "vendedor", ""] },
    { name: "Puntos", href: "/dashboard/puntos", icon: Star, roles: ["admin", "vendedor", ""] },
    { name: "Membresías", href: "/dashboard/membresias", icon: Users, roles: ["admin", "vendedor", ""] },
  ]

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedName = localStorage.getItem("userName") || "Usuario"
    const storedEmail = localStorage.getItem("userEmail") || ""
    const storedRol = localStorage.getItem("userRole") || "" 

    if (token) {
      setIsLoggedIn(true)
      setUserData({ nombre: storedName, email: storedEmail, rol: storedRol })
    } else {
      setIsLoggedIn(false)
      setUserData(null)
    }
    setLoading(false)
  }, [])

  const handleNavigation = (e: React.MouseEvent, item: any) => {
    const userRole = userData?.rol || ""
    const hasPermission = item.roles.includes(userRole)

    if (!hasPermission) {
      e.preventDefault();
      toast({
        title: "Acceso Restringido",
        description: !isLoggedIn 
          ? `Debes iniciar sesión para ver ${item.name}.` 
          : `Tu cuenta de ${userRole} no tiene acceso a esta sección.`,
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    setUserData(null)
    setIsLoggedIn(false)
    router.push("/auth/login")
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Tenis Star </h1>
          <ChevronLeft className="size-5 text-gray-400 cursor-pointer" />
        </div>

        <nav className="flex-1 px-4 overflow-y-auto space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const userRole = userData?.rol || ""
            const hasPermission = item.roles.includes(userRole)
            

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavigation(e, item)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group",
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-slate-700",
                  !hasPermission && "opacity-50 cursor-not-allowed"
                )}
              >
                <item.icon className={cn("size-5", isActive ? "text-slate-900" : "text-gray-400")} />
                <span className="text-[15px]">{item.name}</span>
                {!hasPermission && <Lock className="size-3 ml-auto text-gray-300" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link href="/dashboard/config" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl">
            <Settings className="size-5 text-gray-400" />
            <span className="text-[15px]">Configuración</span>
          </Link>
          <Link href="/dashboard/ayuda" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl">
            <HelpCircle className="size-5 text-gray-400" />
            <span className="text-[15px]">Ayuda</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Inicio</span>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-slate-900 capitalize">
              {pathname.split("/").pop() || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn && userData?.rol && (
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-bold uppercase tracking-wider border border-indigo-100">
                {userData.rol}
              </span>
            )}
            
            <Bell className="size-5 text-gray-400 cursor-pointer hover:text-slate-600" />

            {isLoggedIn && userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <div className="size-9 rounded-full bg-slate-900 border border-slate-200 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-slate-800 transition-all shadow-sm">
                      {userData.nombre.substring(0, 2).toUpperCase()}
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56 mt-2" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-slate-900">{userData.nombre}</p>
                      <p className="text-xs text-slate-500 font-mono">{userData.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/perfil')} className="cursor-pointer">
                    <Users className="mr-2 h-4 w-4 text-slate-400" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div
                className="size-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all"
                onClick={() => router.push('/auth/login')}
                title="Iniciar Sesión"
              >
                <Users className="size-5 text-slate-400" />
              </div>
            )}
          </div>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400 italic font-medium">
              Sincronizando acceso...
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  )
}