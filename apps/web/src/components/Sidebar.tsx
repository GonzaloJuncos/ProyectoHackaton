"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BILLETERA } from "@/lib/mock";

const icon = (d: string) => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const NAV = [
  { href: "/", label: "Inicio", d: "M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/proveedores", label: "Proveedores", d: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { href: "/facturas", label: "Pagos", d: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
  { href: "/conciliacion", label: "Transacciones", d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
  { href: "/reportes", label: "Reportes", d: "M9 17v-6m4 6V7m4 10v-3M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { href: "/configuracion", label: "Configuración", d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 flex w-56 flex-col border-r bg-card">
      <div className="flex items-center gap-2 px-5 py-4">
        <svg className="h-7 w-7 text-enlace" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2zm0 2.3L6 7.4v7.2l6 3.1 6-3.1V7.4l-6-3.1z" />
        </svg>
        <span className="text-lg font-bold">Logis</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map(({ href, label, d }) => {
          const activo = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activo ? "bg-petroleo/10 text-enlace" : "text-tinta/70 hover:bg-fondo"
              }`}
            >
              {icon(d)}
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-xl bg-oscuro p-4 text-white">
        <p className="text-xs text-white/50">USDC en custodia</p>
        <p className="mt-1 text-lg font-bold">${BILLETERA.balanceUSDC.toLocaleString("es-AR")} USDC</p>
        <p className="mt-1 text-xs text-menta">{BILLETERA.red}</p>
      </div>
    </aside>
  );
}
