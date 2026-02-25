"use client"

import { useEffect, useState } from "react"
import { apiService } from "@/lib/api"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Package, Tag, Layers, Loader2 } from "lucide-react"

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function EstadisticasPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiService.getStats();
        console.log("Data recibida del back:", res); 
        setData(res);
      } catch (error) {
        console.error("Error cargando estadísticas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-4">
      <Loader2 className="animate-spin size-10" />
      <p className="font-medium">Cocinando tus estadísticas...</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Métricas de SyroxTech</h1>
        <p className="text-slate-500 font-medium">Análisis de rendimiento real</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[450px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Package className="size-5" />
            </div>
            <h3 className="font-bold text-slate-800">Productos Top</h3>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.topProductos || []} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={80} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[450px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Layers className="size-5" />
            </div>
            <h3 className="font-bold text-slate-800">Distribución por Categorías</h3>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.topCategorias || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent, value }) => {
                    const porcentaje = percent ? `${(percent * 100).toFixed(0)}%` : '0%';
                    return `${name} (${porcentaje}) - ${value}`;
                  }}
                  labelLine={true}
                >
                  {data?.topCategorias?.map((_: any, i: number) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={((value: any) => [`${value} ventas`, 'Cantidad']) as any}
                  contentStyle={{
                    borderRadius: '15px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[450px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Tag className="size-5" />
            </div>
            <h3 className="font-bold text-slate-800">Marcas</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {data?.topMarcas?.length > 0 ? data.topMarcas.map((m: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700 text-sm">{m.name}</span>
                <span className="bg-white px-2 py-1 rounded-lg text-xs font-black text-indigo-600 shadow-sm">{m.value} vtas</span>
              </div>
            )) : <p className="text-center text-slate-400 mt-10">Sin datos de marcas</p>}
          </div>
        </div>

      </div>
    </div>
  )
}