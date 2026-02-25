import { apiService } from "@/lib/api"
import {
    User,
    Mail,
    MapPin,
    MoreHorizontal,
    Users
} from "lucide-react"

export default async function ClientesPage() {
    const clientes = await apiService.getUsuarios();
    const getRoleStyle = (rol: string) => {
        const r = rol?.toUpperCase() || 'CLIENTE';
        switch (r) {
            case 'ADMIN':
                return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'VENDEDOR':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'CLIENTE':
                return 'bg-slate-50 text-slate-600 border-slate-100';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    }

    return (
        <div className="max-w-[1100px] mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
                    <p className="text-slate-500 font-medium">Gestión de usuarios y sus ubicaciones</p>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Users className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Total Clientes</p>
                        <p className="text-xl font-bold text-slate-800">{clientes.length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-50 text-slate-400 text-xs uppercase tracking-widest">
                            <th className="px-6 py-5 font-bold">Usuario</th>
                            <th className="px-6 py-5 font-bold">Contacto</th>
                            <th className="px-6 py-5 font-bold">Dirección</th>
                            <th className="px-6 py-5 font-bold text-center">Rol</th>
                            <th className="px-6 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {clientes.length > 0 ? (
                            clientes.map((cliente: any) => (
                                <tr key={cliente.id} className="hover:bg-slate-50/50 transition-colors group">

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm shrink-0">
                                                {cliente.name?.charAt(0) || <User className="size-5" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                                    {cliente.name} {cliente.lastName}
                                                </h4>
                                                <h5 className="text-[11px] text-slate-400 font-mono font-medium">
                                                    ID: {cliente.id}
                                                </h5>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <Mail className="size-4 text-slate-300" />
                                            <span className="font-medium">{cliente.email}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="size-4 text-indigo-400 mt-1" />
                                            <div className="flex flex-col">
                                                <h4 className="text-sm font-bold text-slate-800 leading-tight">
                                                    {cliente.city || 'Ciudad s/e'}
                                                </h4>
                                                <h5 className="text-xs text-slate-500 font-medium italic">
                                                    {cliente.address || 'Sin calle'}
                                                </h5>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black border tracking-wider 
                                            ${getRoleStyle(cliente.rol)}`}>
                                            {cliente.rol}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                                            <MoreHorizontal className="size-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-medium">
                                    No se registran clientes.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}