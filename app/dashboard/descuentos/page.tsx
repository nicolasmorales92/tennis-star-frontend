import { Ticket, Copy, Tag, Zap } from "lucide-react"

const COUPONS = [
  { code: 'SYROX10', desc: '10% Off', categoria: 'Runner' },
  { code: 'DJSTART', desc: 'Envío Gratis en tu compra', categoria: 'Tennis' },
  { code: 'AUDIO25', desc: '25% Off', marca: 'Puma' },
  { code: 'UPGRADE', desc: '$5000', marca: 'Adidas' },
  { code: 'LOYALTY', desc: '2x1 en service técnico', marca: 'Reebok' }, 
]

export default function DescuentosPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Mis Cupones Syrox</h1>
        <p className="text-slate-500 font-medium">Aplicá estos códigos en tu próximo checkout</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COUPONS.map((c) => (
          <div 
            key={c.code} 
            className="group relative bg-white border-2 border-dashed border-slate-200 p-6 rounded-[2rem] flex flex-col justify-between hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300"
          >
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-50 border-r-2 border-dashed border-slate-200 rounded-full"></div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-50 border-l-2 border-dashed border-slate-200 rounded-full"></div>

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 text-white p-2.5 rounded-2xl group-hover:bg-indigo-600 transition-colors">
                  {c.categoria ? <Zap className="size-5" /> : <Tag className="size-5" />}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                    {c.categoria ? `Categoría: ${c.categoria}` : `Marca: ${c.marca}`}
                  </span>
                  <h4 className="text-xl font-black text-slate-800 leading-tight">
                    {c.desc}
                  </h4>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="font-mono font-bold text-slate-600 px-2 uppercase tracking-tighter">
                {c.code}
              </span>
              <button className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-sm border border-slate-200 hover:bg-slate-900 hover:text-white transition-all active:scale-95">
                Copiar <Copy className="size-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
            <Ticket className="size-6" />
        </div>
        <p className="text-sm text-indigo-900 font-medium">
            <strong>Tip Syrox:</strong> Los cupones de marca no son acumulables con las promociones de membresía Oro.
        </p>
      </div>
    </div>
  )
}