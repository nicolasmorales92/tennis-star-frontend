"use client"

import React, { useEffect, useState } from "react"
import { apiService } from "@/lib/api"
import { 
  Plus, BadgeDollarSign, Trash2, 
  ShoppingCart, Loader2, Eye, ReceiptText, Minus 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function VentasPage() {
  const [ventas, setVentas] = useState<any[]>([])
  const [productos, setProductos] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const { toast } = useToast()

  const [selectedCliente, setSelectedCliente] = useState<string>("")
  const [cart, setCart] = useState<any[]>([])
  const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null)
  const [productSelectorKey, setProductSelectorKey] = useState(0)

  const fetchData = async () => {
    try {
      const storedRole = localStorage.getItem('userRole')
      setRole(storedRole)
      if (storedRole === 'vendedor' || storedRole === 'admin') {
        const [vData, pData, uData] = await Promise.all([
          apiService.getVentas(),
          apiService.getProductos(),
          apiService.getUsuarios()
        ])
        setVentas(vData)
        setProductos(pData)
        setUsuarios(uData)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const addToCart = (productoId: string) => {
    if (!productoId) return
    const prod = productos.find(p => p.id.toString() === productoId)
    if (!prod) return

    const exists = cart.find(item => item.productoId === prod.id)
    if (exists) {
      updateQuantity(prod.id, 1)
    } else {
      setCart(prev => [...prev, { 
        productoId: prod.id, 
        name: prod.name, 
        price: prod.price, 
        cantidad: 1, 
        stock: prod.stock 
      }])
    }
    setProductSelectorKey(prev => prev + 1)
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productoId === id) {
        const newQty = Math.max(1, Math.min(item.stock, item.cantidad + delta))
        return { ...item, cantidad: newQty }
      }
      return item
    }))
  }

  const handleCreateVenta = async () => {
    if (!selectedCliente || cart.length === 0) return
    setIsSubmitting(true)
    try {
      await apiService.createVentas({
        clienteId: Number(selectedCliente),
        items: cart.map(item => ({ productoId: item.productoId, cantidad: item.cantidad }))
      })
      toast({ title: "Venta Exitosa", description: "Se registró el movimiento correctamente." })
      setIsModalOpen(false)
      setCart([])
      setSelectedCliente("")
      fetchData()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo procesar la venta.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400 font-medium italic">
      <Loader2 className="animate-spin size-10" />
      Sincronizando caja...
    </div>
  )

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Ventas</h1>
          <p className="text-slate-500 font-medium italic">Panel de control de facturación</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm text-right">
             <div>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Facturación Total</p>
               <p className="text-xl font-black text-slate-900">
                 ${ventas.reduce((acc, v) => acc + (v.total || 0), 0).toLocaleString('es-AR')}
               </p>
             </div>
             <div className="p-3 bg-indigo-600 rounded-xl text-white">
               <BadgeDollarSign className="size-6" />
             </div>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="h-16 px-8 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl shadow-xl transition-all font-bold text-lg italic uppercase tracking-tighter">
            <Plus className="mr-2 size-6" /> Nueva Venta
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <th className="px-8 py-5">Orden</th>
              <th className="px-8 py-5">Fecha</th>
              <th className="px-8 py-5">Cliente</th>
              <th className="px-8 py-5 text-right">Monto</th>
              <th className="px-8 py-5 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ventas.map((venta: any) => (
              <tr key={venta.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5 font-mono font-bold text-indigo-600 italic">#{venta.id.toString().padStart(4, '0')}</td>
                <td className="px-8 py-5 text-sm font-medium text-slate-600">{new Date(venta.createdAt).toLocaleDateString()}</td>
                <td className="px-8 py-5 text-sm font-bold text-slate-700">ID: {venta.clienteId}</td>
                <td className="px-8 py-5 text-right font-black text-slate-900 text-lg">${venta.total?.toLocaleString('es-AR')}</td>
                <td className="px-8 py-5 text-center">
                  <button onClick={() => { setVentaSeleccionada(venta); setIsDetailModalOpen(true); }} className="p-2 hover:bg-indigo-50 rounded-xl text-slate-300 hover:text-indigo-600 transition-all">
                    <Eye className="size-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL REDISEÑADO SEGÚN IMAGEN */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl rounded-[32px] border-none shadow-2xl p-10 bg-white">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-slate-900">Nueva Venta</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* SECCIÓN 1: CLIENTE */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-900">Cliente *</Label>
              <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/30 text-slate-400 text-base focus:ring-indigo-500">
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name} (ID: {u.id})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* SECCIÓN 2: PRODUCTOS */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-900">Agregar Producto *</Label>
              <Select key={productSelectorKey} onValueChange={addToCart}>
                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/30 text-slate-400 text-base focus:ring-indigo-500">
                  <SelectValue placeholder="Busca productos..." />
                </SelectTrigger>
                <SelectContent>
                  {productos.filter(p => p.stock > 0).map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.name} — ${p.price.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CARRITO VISUAL (LISTA DEBAJO) */}
            {cart.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Detalle del pedido</Label>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-3">
                  {cart.map(item => (
                    <div key={item.productoId} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{item.name}</span>
                        <span className="text-xs text-slate-500">${item.price.toLocaleString()} c/u</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                          <button onClick={() => updateQuantity(item.productoId, -1)} className="p-1 hover:text-indigo-600"><Minus className="size-4" /></button>
                          <span className="w-8 text-center text-sm font-bold">{item.cantidad}</span>
                          <button onClick={() => updateQuantity(item.productoId, 1)} className="p-1 hover:text-indigo-600"><Plus className="size-4" /></button>
                        </div>
                        <button onClick={() => setCart(cart.filter(c => c.productoId !== item.productoId))} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 className="size-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FOOTER DEL MODAL */}
            <div className="flex flex-col gap-6 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total a pagar:</span>
                <span className="text-3xl font-black text-slate-900">${cart.reduce((acc, i) => acc + (i.price * i.cantidad), 0).toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="h-14 rounded-2xl border-slate-200 font-bold text-slate-600"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateVenta} 
                  disabled={isSubmitting || !selectedCliente || cart.length === 0}
                  className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirmar Venta"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DETALLE (TICKET) */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[40px] border-none p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="p-4 bg-indigo-50 rounded-3xl mb-4 text-indigo-600"><ReceiptText className="size-8" /></div>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Ticket de Venta</DialogTitle>
            <p className="font-mono text-slate-400 text-sm font-bold tracking-widest">ORDEN #{ventaSeleccionada?.id}</p>
          </div>
          <div className="space-y-3 py-4 border-y border-dashed border-slate-200">
            {ventaSeleccionada?.detalles?.map((det: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold"><span className="text-slate-900">{det.cantidad}x</span> {det.producto?.name || 'Producto'}</span>
                <span className="font-black text-slate-900">${(det.precioUnitario * det.cantidad).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Pagado</span>
            <span className="text-3xl font-black text-indigo-600 italic">${ventaSeleccionada?.total?.toLocaleString()}</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}