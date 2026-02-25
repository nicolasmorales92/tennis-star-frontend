import { Crown, Check, Zap, Star } from "lucide-react"

const TIERS = [
  { name: 'Bronce', price: 'Gratis', icon: <Star className="text-orange-400" />, features: ['5% Descuento', 'Soporte vía mail', 'Acceso a foro'], color: 'bg-orange-50' },
  { name: 'Plata', price: '$2.99/mes', icon: <Crown className="text-slate-400" />, features: ['15% Descuento', 'Envíos gratis', 'Soporte 24/7'], color: 'bg-slate-100', popular: true },
  { name: 'Oro', price: '$9.99/mes', icon: <Zap className="text-yellow-500" />, features: ['25% Descuento', 'Preventas exclusivas', 'Regalo mensual'], color: 'bg-yellow-50' },
]

export default function MembresiaPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-10">Tu Membresía Syrox</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => (
          <div key={tier.name} className={`relative p-6 rounded-3xl border-2 ${tier.popular ? 'border-indigo-500 scale-105 shadow-xl' : 'border-slate-100'} ${tier.color}`}>
            {tier.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Más Popular</span>}
            <div className="mb-4">{tier.icon}</div>
            <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
            <p className="text-2xl font-black mb-6">{tier.price}</p>
            <ul className="space-y-3 mb-8">
              {tier.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600"><Check className="size-4 text-green-500" /> {f}</li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-xl font-bold transition ${tier.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}>
              Elegir Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}