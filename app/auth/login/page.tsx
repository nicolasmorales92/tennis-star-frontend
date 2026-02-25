"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { apiService } from "@/lib/api" 

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const data = await apiService.login({ email, password })


      const token = data.access_token || data.token
      if (token) localStorage.setItem("token", token)

      if (data.user || data.usuario) {
        const user = data.user || data.usuario
        localStorage.setItem("userName", user.name || "Usuario")
        localStorage.setItem("userEmail", user.email || "")
        localStorage.setItem("userRole", user.rol || "vendedor")
      }

      toast({
        title: "¡Inicio de sesión exitoso!",
        description: "Bienvenido al panel de Tennis Star 🎾",
      })

      router.push("/dashboard")
      router.refresh()
      
    } catch (error: any) {
      const message = error.response?.data?.message || "Credenciales incorrectas o problema técnico."
      
      toast({
        variant: "destructive",
        title: "Error al ingresar",
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-gray-200">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Tennis Star
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresá a tu panel de gestión
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="tu@email.com" 
                required 
                disabled={loading}
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                type="password" 
                id="password" 
                name="password" 
                required 
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm font-medium leading-none">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <Link href="#" className="font-medium text-slate-600 hover:text-slate-900 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            <Button 
              asChild 
              variant="outline" 
              className="w-full border-slate-200 hover:bg-slate-50 py-6"
              disabled={loading}
            >
              <Link href="/auth/register">
                Crear una cuenta nueva
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}