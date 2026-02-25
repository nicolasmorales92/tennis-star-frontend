import { apiService } from "@/lib/api"
import { Plus, Award, MoreHorizontal, Box } from "lucide-react"

export default async function MarcasPage() {
  const marcas = await apiService.getMarcas();

  return (
    <div className="max-w-[1000px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Marcas</h1>
          <p className="text-slate-500 font-medium">Distribución de productos por fabricante</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-5 font-semibold">Marca</th>
              <th className="px-6 py-5 font-semibold text-center">Productos</th>
              <th className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {marcas.length > 0 ? (
              marcas.map((marca: any) => (
                <tr key={marca.name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <Award className="size-5" />
                      </div>
                      <span className="font-bold text-slate-800 text-lg">{marca.name}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                      <Box className="size-4" />
                      <span className="font-semibold text-sm">
                        {marca.cantidadProductos} {marca.cantidadProductos === 1 ? 'modelo' : 'modelos'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                      <MoreHorizontal className="size-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-20 text-center text-slate-400">
                  No se detectaron marcas en el inventario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}