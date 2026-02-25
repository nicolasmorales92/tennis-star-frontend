import { Trophy, Gift, ArrowUpCircle } from "lucide-react"

export default function PuntosPage() {
  const puntosActuales = 2450;
  const proximoNivel = 5000;
  const progreso = (puntosActuales / proximoNivel) * 100;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2rem] text-white shadow-xl mb-8">
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest">Nivel 2: Productor</p>
            <h2 className="text-5xl font-black mt-2">{puntosActuales.toLocaleString()} <span className="text-xl font-normal opacity-70">pts</span></h2>
          </div>
          <Trophy className="size-16 text-indigo-200/30" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span>Tu progreso</span>
            <span>{proximoNivel.toLocaleString()} pts para Nivel 3</span>
          </div>
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
            <div className="bg-white h-full transition-all duration-1000" style={{ width: `${progreso}%` }}></div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Próximos Beneficios</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl">
          <Gift className="text-pink-500" />
          <span className="text-slate-600 font-medium">Kit de limpieza de vinilos gratis al llegar a 3000 pts</span>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl opacity-50">
          <ArrowUpCircle className="text-slate-400" />
          <span className="text-slate-400 font-medium">Doble puntaje en compras los fines de semana (Desbloquea Nivel 3)</span>
        </div>
      </div>
    </div>
  )
}