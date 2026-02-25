"use client"

import React, { useState, useEffect } from "react"
import { 
  Package, ShoppingCart, Plus, Ghost, 
  ReceiptText, ArrowRight, Loader2, Trash2, Minus, OctagonAlert 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"

export default function DashboardPage() {

  const [ventas, setVentas] = useState<any[]>([])
  const [productos, setProductos] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({ loggedIn: false, role: '' })
  const { toast } = useToast()


  const [isSubmittingVenta, setIsSubmittingVenta] = useState(false)
  const [isSubmittingProducto, setIsSubmittingProducto] = useState(false)

  //         Modales



  const [isVentaModalOpen, setIsVentaModalOpen] = useState(false)
  const [isProductoModalOpen, setIsProductoModalOpen] = useState(false)


  const [selectedCliente, setSelectedCliente] = useState<string>("")
  const [cart, setCart] = useState<any[]>([])
  const [productSelectorKey, setProductSelectorKey] = useState(0)

  const [productData, setProductData] = useState({
    name: "", description: "", price: "", genero: "",
    marca: "", categoriaId: "", stock: "", color: "",
    talle: "", status: true
  })


  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole') || ''
    
    if (token && (role === 'vendedor' || role === 'admin')) {
      setUser({ loggedIn: true, role: role })
      fetchDashboardData()
    } else {
      setUser({ loggedIn: !!token, role: role })
      setLoading(false)
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [vData, pData, uData, cData] = await Promise.all([
        apiService.getVentas(),
        apiService.getProductos(),
        apiService.getUsuarios(),
        apiService.getCategorias()
      ])
      setVentas(vData.slice(0, 3))
      setProductos(pData)
      setUsuarios(uData)
      setCategorias(cData)
    } catch (error) {
      console.error("Error cargando dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

   //                  CARRITO 



  const addToCart = (productoId: string) => {
    if (!productoId) return
    const prod = productos.find(p => p.id.toString() === productoId)
    if (!prod) return
    const exists = cart.find(item => item.productoId === prod.id)
    if (exists) {
      updateQuantity(prod.id, 1)
    } else {
      setCart(prev => [...prev, { 
        productoId: prod.id, name: prod.name, price: prod.price, 
        cantidad: 1, stock: prod.stock 
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
    setIsSubmittingVenta(true)
    try {
      await apiService.createVentas({
        clienteId: Number(selectedCliente),
        items: cart.map(item => ({ productoId: item.productoId, cantidad: item.cantidad }))
      })
      toast({ title: "Venta registrada", description: "Operación realizada con éxito." })
      setIsVentaModalOpen(false)
      setCart([])
      setSelectedCliente("")
      fetchDashboardData()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo procesar la venta.", variant: "destructive" })
    } finally {
      setIsSubmittingVenta(false)
    }
  }

  const handleSaveProducto = async () => {
    setIsSubmittingProducto(true)
    try {
      const dataToSend = {
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
        talle: Number(productData.talle),
        categoriaId: Number(productData.categoriaId),
      }
      await apiService.createProducto(dataToSend)
      toast({ title: "¡Éxito!", description: "Producto creado correctamente" })
      setIsProductoModalOpen(false)
      fetchDashboardData()
    } catch (error: any) {
      toast({ title: "Error", description: "Revisa los campos obligatorios", variant: "destructive" })
    } finally {
      setIsSubmittingProducto(false)
    }
  }

  //                                         RENDER


  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400 italic font-medium">
      <Loader2 className="animate-spin size-10" />
      Sincronizando panel...
    </div>
  )

  if (user.role !== 'vendedor' && user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="bg-slate-100 p-6 rounded-full text-slate-400"><Ghost className="size-12" /></div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Acceso Restringido</h2>
          <p className="text-slate-500 max-w-sm">Este panel es para uso exclusivo del personal de ventas.</p>
        </div>
        <Button onClick={() => window.location.href='/auth/login'} className="rounded-xl">Iniciar Sesión</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-[1100px] mx-auto pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Inicio</h1>
          <p className="text-slate-500 font-medium italic">Resumen operativo de hoy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 pb-4">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Inventario</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6 text-slate-900">
                <Package className="size-8" />
                <span className="text-2xl font-black italic">Stock</span>
              </div>
              <Button 
                onClick={() => setIsProductoModalOpen(true)}
                className="w-full h-14 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-bold transition-all uppercase text-xs tracking-widest"
              >
                <Plus className="size-4 mr-2" /> Añadir Producto
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 pb-4">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Punto de Venta</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6 text-indigo-600">
                <ShoppingCart className="size-8" />
                <span className="text-sm font-bold text-slate-400 uppercase italic">Caja Abierta</span>
              </div>
              <Button 
                onClick={() => setIsVentaModalOpen(true)}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 uppercase text-xs tracking-widest"
              >
                <Plus className="size-4 mr-2" /> Nueva Venta
              </Button>
            </CardContent>
          </Card>
        </div>


        
        {/* ÚLTIMAS VENTAS */}



        <Card className="lg:col-span-8 border-none shadow-sm rounded-[32px] bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 px-8">
            <CardTitle className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Ventas Recientes</CardTitle>
            <Button variant="ghost" className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:bg-indigo-50" onClick={() => window.location.href='/ventas'}>
              Ver historial <ArrowRight className="size-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6 px-8">
            {ventas.length === 0 ? (
              <div className="min-h-[250px] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-50 rounded-[24px]">
                <ShoppingCart className="size-12 mb-2 opacity-10" />
                <p className="text-sm font-medium italic">Sin actividad reciente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ventas.map((venta) => (
                  <div key={venta.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px] border border-transparent hover:border-slate-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600"><ReceiptText className="size-5" /></div>
                      <div>
                        <p className="font-bold text-slate-900">Orden #{venta.id.toString().padStart(4, '0')}</p>
                        <p className="text-xs text-slate-400 font-medium">{new Date(venta.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl text-slate-900">${venta.total?.toLocaleString()}</p>
                      <span className="text-[9px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Éxito</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>


                     {/*  MODAL NUEVA VENTA */}



      <Dialog open={isVentaModalOpen} onOpenChange={setIsVentaModalOpen}>
        <DialogContent className="max-w-2xl rounded-[32px] border-none shadow-2xl p-10 bg-white overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-6"><DialogTitle className="text-2xl font-bold">Información de la Venta</DialogTitle></DialogHeader>
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="font-bold">Cliente *</Label>
              <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                <SelectTrigger className="h-14 rounded-2xl bg-slate-50/30">
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="font-bold">Añadir Producto *</Label>
              <Select key={productSelectorKey} onValueChange={addToCart}>
                <SelectTrigger className="h-14 rounded-2xl bg-slate-50/30">
                  <SelectValue placeholder="Busca por nombre..." />
                </SelectTrigger>
                <SelectContent>
                  {productos.filter(p => p.stock > 0).map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name} — ${p.price.toLocaleString()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {cart.length > 0 && (
              <div className="space-y-2 pr-2">
                {cart.map(item => (
                  <div key={item.productoId} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div><p className="text-sm font-bold">{item.name}</p></div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-white border rounded-xl p-1 px-2 gap-3">
                        <button onClick={() => updateQuantity(item.productoId, -1)}><Minus className="size-3" /></button>
                        <span className="text-sm font-bold">{item.cantidad}</span>
                        <button onClick={() => updateQuantity(item.productoId, 1)}><Plus className="size-3" /></button>
                      </div>
                      <button onClick={() => setCart(cart.filter(c => c.productoId !== item.productoId))} className="text-rose-500"><Trash2 className="size-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center mb-6">
                <span className="italic text-slate-500">Total Final</span>
                <span className="text-3xl font-black italic">${cart.reduce((acc, i) => acc + (i.price * i.cantidad), 0).toLocaleString()}</span>
              </div>
              <Button onClick={handleCreateVenta} disabled={isSubmittingVenta || !selectedCliente || cart.length === 0} className="w-full h-14 rounded-2xl bg-indigo-600 font-bold">
                {isSubmittingVenta ? <Loader2 className="animate-spin" /> : "Finalizar Venta"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


                {/* MODAL NUEVO PRODUCTO  */}


      <Dialog open={isProductoModalOpen} onOpenChange={setIsProductoModalOpen}>
        <DialogContent className="max-w-2xl rounded-[32px] border-none shadow-2xl p-10 bg-white overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-4"><DialogTitle className="text-2xl font-bold">Crear Nuevo Producto</DialogTitle></DialogHeader>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label className="font-bold">Nombre del Producto *</Label>
              <Input className="h-12 rounded-2xl" value={productData.name} onChange={(e) => setProductData({...productData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold">Género *</Label>
                <Select value={productData.genero} onValueChange={(val) => setProductData({...productData, genero: val})}>
                  <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hombre">Hombre</SelectItem>
                    <SelectItem value="mujer">Mujer</SelectItem>
                    <SelectItem value="nino">Niño/a</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="font-bold">Marca *</Label>
                <Input className="h-12 rounded-2xl" value={productData.marca} onChange={(e) => setProductData({...productData, marca: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold">Categoría *</Label>
                <Select value={productData.categoriaId} onValueChange={(val) => setProductData({...productData, categoriaId: val})}>
                  <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Categoría" /></SelectTrigger>
                  <SelectContent>
                    {categorias.map(cat => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="font-bold">Precio *</Label>
                <Input type="number" className="h-12 rounded-2xl" value={productData.price} onChange={(e) => setProductData({...productData, price: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 bg-slate-50 p-5 rounded-[24px]">
              <div className="grid gap-1"><Label className="text-xs font-bold uppercase text-slate-500">Talle</Label><Input type="number" className="bg-white rounded-xl h-11" value={productData.talle} onChange={(e) => setProductData({...productData, talle: e.target.value})} /></div>
              <div className="grid gap-1"><Label className="text-xs font-bold uppercase text-slate-500">Color</Label><Input className="bg-white rounded-xl h-11" value={productData.color} onChange={(e) => setProductData({...productData, color: e.target.value})} /></div>
              <div className="grid gap-1"><Label className="text-xs font-bold uppercase text-slate-500">Stock</Label><Input type="number" className="bg-white rounded-xl h-11" value={productData.stock} onChange={(e) => setProductData({...productData, stock: e.target.value})} /></div>
            </div>
            <Button onClick={handleSaveProducto} disabled={isSubmittingProducto} className="w-full h-14 bg-slate-900 rounded-2xl font-bold">
              {isSubmittingProducto ? <Loader2 className="animate-spin" /> : "Crear Producto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}