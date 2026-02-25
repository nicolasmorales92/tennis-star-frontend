"use client"

import React, { useEffect, useState } from "react"
import { apiService } from "@/lib/api"
import {
  Package,
  Layers,
  Plus,
  Loader2,
  Pencil,
  Trash2,
  OctagonAlert
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function ProductosPage() {
  const [productos, setProductos] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [editingId, setEditingId] = useState<number | null>(null)
  const [productToDelete, setProductToDelete] = useState<any>(null)
  
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    genero: "",
    marca: "",
    categoriaId: "",
    stock: "",
    color: "",
    talle: "",
    status: true
  })

  const fetchData = async () => {
    try {
      const [prodData, catData] = await Promise.all([
        apiService.getProductos(),
        apiService.getCategorias()
      ])
      setProductos(prodData)
      setCategorias(catData)
    } catch (error) {
      toast({ title: "Error", description: "No se pudo cargar la información"})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleNuevoProducto = () => {
    setEditingId(null)
    setFormData({
      name: "", description: "", price: "", genero: "",
      marca: "", categoriaId: "", stock: "", color: "",
      talle: "", status: true
    })
    setIsModalOpen(true)
  }

  const handleEditarClick = (prod: any) => {
    setEditingId(prod.id)
    setFormData({
      name: prod.name,
      description: prod.description || "",
      price: prod.price.toString(),
      genero: prod.genero,
      marca: prod.marca,
      categoriaId: prod.categoriaId.toString(),
      stock: prod.stock.toString(),
      color: prod.color,
      talle: prod.talle.toString(),
      status: prod.status
    })
    setIsModalOpen(true)
  }

  const openDeleteModal = (prod: any) => {
    setProductToDelete(prod)
    setIsDeleteModalOpen(true)
  }

  const confirmEliminar = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      await apiService.deleteProducto(productToDelete.id)
      toast({ title: "Eliminado", description: "El producto fue borrado." })
      fetchData()
      setIsDeleteModalOpen(false)
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" })
    } finally {
      setIsDeleting(false)
      setProductToDelete(null)
    }
  }

  const handleSaveProducto = async () => {
    setIsSubmitting(true)
    try {
      const dataToSend = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        talle: Number(formData.talle),
        categoriaId: Number(formData.categoriaId),
      }

      if (editingId) {
        await apiService.updateProducto(editingId, dataToSend)
        toast({ title: "¡Actualizado!", description: "Producto modificado con éxito" })
      } else {
        await apiService.createProducto(dataToSend)
        toast({ title: "¡Éxito!", description: "Producto creado correctamente" })
      }
      
      setIsModalOpen(false)
      fetchData()
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Revisa los campos", 
        variant: "destructive" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 className="animate-spin size-10" />
      <p>Sincronizando inventario...</p>
    </div>
  )

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 uppercase">Productos</h1>
          <p className="text-slate-500 font-medium">Gestión de inventario Tennis Star</p>
        </div>

        <Button 
          onClick={handleNuevoProducto}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 px-6 shadow-lg"
        >
          <Plus className="mr-2 size-5" /> Nuevo Producto
        </Button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl rounded-[32px] border-none shadow-2xl overflow-y-auto max-h-[95vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {editingId ? "Editar Producto" : "Información del Producto a crear"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <span className="font-bold ml-1">Nombre del Producto *</span>
                <Input 
                  placeholder="Ej: Nike Runner 4000" 
                  className="h-12 rounded-2xl border-slate-200"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <span className="font-bold ml-1">Descripción</span>
                <Textarea 
                  placeholder="Descripción detallada..." 
                  className="rounded-2xl border-slate-200 min-h-[80px]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <span className="font-bold ml-1">Género *</span>
                  <Select 
                    value={formData.genero} 
                    onValueChange={(val) => setFormData({...formData, genero: val})}
                  >
                    <SelectTrigger className="h-12 rounded-2xl">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hombre">Hombre</SelectItem>
                      <SelectItem value="mujer">Mujer</SelectItem>
                      <SelectItem value="nino">Niñ@</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <span className="font-bold ml-1">Marca *</span>
                  <Input 
                    placeholder="Ej: Puma" 
                    className="h-12 rounded-2xl border-slate-200"
                    value={formData.marca}
                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <span className="font-bold ml-1">Categoría *</span>
                  <Select 
                    value={formData.categoriaId} 
                    onValueChange={(val) => setFormData({...formData, categoriaId: val})}
                  >
                    <SelectTrigger className="h-12 rounded-2xl">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <span className="font-bold ml-1">Precio (AR$) *</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="h-12 rounded-2xl border-slate-200"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-5 rounded-[24px]">
                <div className="grid gap-2">
                  <span className="font-bold text-xs uppercase text-slate-500">Talle *</span>
                  <Input 
                    type="number" 
                    placeholder="42" 
                    className="bg-white rounded-xl h-11"
                    value={formData.talle}
                    onChange={(e) => setFormData({...formData, talle: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <span className="font-bold text-xs uppercase text-slate-500">Color *</span>
                  <Input 
                    placeholder="Rojo" 
                    className="bg-white rounded-xl h-11"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <span className="font-bold text-xs uppercase text-slate-500">Stock *</span>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    className="bg-white rounded-xl h-11"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                onClick={handleSaveProducto} 
                disabled={isSubmitting}
                className="w-full bg-slate-900 h-14 rounded-2xl text-lg font-bold"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : editingId ? "Guardar Cambios" : "Crear Producto"}
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
              <DialogTitle className="text-xl font-bold text-slate-900">¿Eliminar producto?</DialogTitle>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                Estás por borrar <span className="font-bold text-slate-800">"{productToDelete?.name}"</span>. 
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="flex-1 rounded-2xl h-12 border-slate-200"
              >
                No, volver
              </Button>
              <Button 
                onClick={confirmEliminar} 
                disabled={isDeleting}
                className="flex-1 rounded-2xl h-12 bg-rose-500 hover:bg-rose-600 text-white font-bold"
              >
                {isDeleting ? <Loader2 className="animate-spin size-4" /> : "Sí, eliminar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 text-slate-400 text-xs uppercase tracking-widest">
              <th className="px-6 py-5 font-bold">Producto</th>
              <th className="px-6 py-5 font-bold text-right">Precio</th>
              <th className="px-6 py-5 font-bold">Categoría</th>
              <th className="px-6 py-5 font-bold">Marca</th>
              <th className="px-6 py-5 font-bold text-center">Stock</th>
              <th className="px-6 py-5 font-bold text-center">Estado</th>
              <th className="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {productos.map((prod: any) => (
              <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors group text-sm">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {prod.imagen ? (
                        <img 
                          src={Array.isArray(prod.imagen) ? prod.imagen[0] : prod.imagen} 
                          alt={prod.name} 
                          className="size-full object-cover"
                        />
                      ) : (
                        <Package className="size-6 text-slate-300" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{prod.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono italic">Ref: {prod.color} - T:{prod.talle}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">
                  ${prod.price?.toLocaleString('es-AR')}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight flex items-center w-fit gap-1">
                    <Layers className="size-3" /> {prod.categoria?.name || 'General'}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-500">
                  {prod.marca}
                </td>
                <td className="px-6 py-4 text-center font-mono font-bold text-slate-600">
                  {prod.stock}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${prod.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    {prod.status ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditarClick(prod)}
                      className="p-2 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"
                      title="Editar"
                    >
                      <Pencil className="size-5" />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(prod)}
                      className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}