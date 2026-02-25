import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="size-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 italic">
            SyroxTech <span className="text-indigo-600">Tennis</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-slate-600 hover:bg-slate-50">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 shadow-lg shadow-slate-200">
              Registrarse
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <section className="relative w-full py-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 -z-10 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 to-blue-200 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-6 text-center space-y-10">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-slate-900 leading-tight">
                TENNIS <br />
                <span className="text-indigo-600">STAR</span>
              </h1>
              <p className="max-w-lg mx-auto text-lg md:text-xl text-slate-500 font-medium italic">
                "Estamos en cada paso de tu vida."
              </p>
            </div>
            
            <div className="flex flex-col sm:row items-center justify-center gap-6">
              <Link href="/dashboard">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white h-16 px-10 text-xl rounded-2xl group shadow-2xl shadow-indigo-100">
                  Ver Catálogo
                  <ChevronRight className="ml-2 size-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">
                Exclusivo para la comunidad SyroxTech
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-slate-300 text-[11px] uppercase tracking-[0.2em]">
        <p>© 2026 SyroxTech - Tennis Star — Derechos reservados</p>
      </footer>
    </div>
  );
}