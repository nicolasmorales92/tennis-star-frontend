"use client"

import React, { useEffect, useState } from "react"
import { apiService } from "@/lib/api"
import {
  Tags, Plus, Trash2, Pencil,
  Loader2, AlertCircle, OctagonAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false) // NUEVO
  const [nombreCategoria, setNombreCategoria] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false) // NUEVO
  
  const [editingId, setEditingId] = useState<number | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null) // NUEVO
  
  const { toast } = useToast()

  const fetchCategorias = async () => {
    try {
      const data = await apiService.getCategorias()
      setCategorias(data)
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar las categorías.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategorias()
  }, [])

  const handleNuevaClick = () => {
    setEditingId(null)
    setNombreCategoria("")
    setIsModalOpen(true)
  }

  const handleEditarClick = (cat: any) => {
    setEditingId(cat.id)
    setNombreCategoria(cat.name)
    setIsModalOpen(true)
  }

  // --- LÓGICA DE BORRADO MEJORADA ---
  const openDeleteModal = (cat: any) => {
    setCategoryToDelete(cat)
    setIsDeleteModalOpen(true)
  }

  const confirmEliminar = async () => {
    if (!categoryToDelete) return
    setIsDeleting(true)
    try {
      await apiService.deleteCategoria(categoryToDelete.id)
      toast({ title: "Eliminada", description: `La categoría "${categoryToDelete.name}" fue borrada.` })
      fetchCategorias()
      setIsDeleteModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar. Verificá si tiene productos asociados.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setCategoryToDelete(null)
    }
  }

  const handleSave = async () => {
    if (!nombreCategoria.trim()) return
    setIsSubmitting(true)
    try {
      if (editingId) {
        await apiService.updateCategoria(editingId, { name: nombreCategoria })
        toast({ title: "¡Actualizada!", description: "Categoría modificada correctamente." })
      } else {
        await apiService.createCategoria(nombreCategoria)
        toast({ title: "¡Éxito!", description: `Categoría "${nombreCategoria}" creada.` })
      }
      setNombreCategoria("")
      setIsModalOpen(false)
      fetchCategorias()
    } catch (error) {
      toast({ title: "Error", description: "Hubo un problema con la operación.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-4">
      <Loader2 className="animate-spin size-10" />
      <p className="font-medium">Cargando categorías...</p>
    </div>
  )

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Categorías</h1>
          <p className="text-slate-500 font-medium">Organización del catálogo de Tennis Star</p>
        </div>

        <Button 
          onClick={handleNuevaClick}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-6 h-12 shadow-lg transition-all active:scale-95"
        >
          <Plus className="mr-2 size-5" /> Nueva Categoría
        </Button>
      </div>



      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              {editingId ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Nombre de categoría</Label>
            <Input
              id="name"
              placeholder="Ej: Zapatillas Urbanas"
              className="h-12 mt-2 rounded-2xl border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all"
              value={nombreCategoria}
              onChange={(e) => setNombreCategoria(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl flex-1">Cancelar</Button>
            <Button onClick={handleSave} disabled={isSubmitting || !nombreCategoria.trim()} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex-1 font-bold">
              {isSubmitting ? <Loader2 className="animate-spin size-4" /> : editingId ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[380px] rounded-[32px] border-none shadow-2xl p-8">
          <div className="flex flex-col items-center text-center">
            <div className="size-16 bg-rose-50 rounded-3xl flex items-center justify-center mb-4 text-rose-500">
              <OctagonAlert className="size-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">¿Eliminar categoría?</DialogTitle>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Estás por borrar <span className="font-bold text-slate-800">"{categoryToDelete?.name}"</span>. 
              Esta acción no se puede deshacer.
            </p>
          </div>



          <div className="flex gap-3 mt-8">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)} 
              className="flex-1 rounded-2xl h-12 border-slate-200 hover:bg-slate-50 font-semibold"
            >
              No, volver
            </Button>
            <Button 
              onClick={confirmEliminar} 
              disabled={isDeleting}
              className="flex-1 rounded-2xl h-12 bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-md shadow-rose-100"
            >
              {isDeleting ? <Loader2 className="animate-spin size-4" /> : "Sí, eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <hr className="border-slate-100" />




      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.length > 0 ? (
          categorias.map((cat: any) => (
            <div
              key={cat.id}
              className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                  <Tags className="size-6" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-slate-800 group-hover:text-slate-900">{cat.name}</h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    {cat.cantidadProductos || 0} Modelos
                  </span>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => handleEditarClick(cat)}
                  className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  <Pencil className="size-5" />
                </button>
                <button 
                  onClick={() => openDeleteModal(cat)}
                  className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100">
            <AlertCircle className="size-10 text-slate-200 mb-2" />
            <p className="text-slate-400 font-medium">No hay categorías aún</p>
          </div>
        )}
      </div>
    </div>
  )
}