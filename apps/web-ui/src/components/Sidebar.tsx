"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { TabSeccion } from "@/lib/types";
import LogisLogo from "@/components/LogisLogo";

interface NavItem {
  id: TabSeccion;
  label: string;
  icon: (activo: boolean) => React.ReactNode;
}

const NAV: NavItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    icon: (activo) => (
      <svg className={`h-4.5 w-4.5 ${activo ? "text-oscuro" : "text-tinta/70"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "proveedores",
    label: "Proveedores",
    icon: (activo) => (
      <svg className={`h-4.5 w-4.5 ${activo ? "text-oscuro" : "text-tinta/70"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    id: "pagos",
    label: "Pagos",
    icon: (activo) => (
      <svg className={`h-4.5 w-4.5 ${activo ? "text-oscuro" : "text-tinta/70"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="2" y1="10" x2="22" y2="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "blockchain",
    label: "Blockchain",
    icon: (activo) => (
      <svg className={`h-4.5 w-4.5 ${activo ? "text-oscuro" : "text-tinta/70"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2zm0 2.3L6 7.4v7.2l6 3.1 6-3.1V7.4l-6-3.1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l8-4.5M12 12v8M12 12L4 7.5" />
      </svg>
    ),
  },
  {
    id: "reportes",
    label: "Reportes",
    icon: (activo) => (
      <svg className={`h-4.5 w-4.5 ${activo ? "text-oscuro" : "text-tinta/70"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-4a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "configuracion",
    label: "Configuración",
    icon: (activo) => (
      <svg className={`h-4.5 w-4.5 ${activo ? "text-oscuro" : "text-tinta/70"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { tab, setTab, billetera } = useApp();

  return (
    <aside className="fixed inset-y-0 left-0 flex w-56 flex-col border-r border-[#153f47] bg-[#072127] text-white z-30 select-none">
      {/* Logo superior */}
      <div className="flex items-center px-6 py-6">
        <LogisLogo className="h-7 w-auto" theme="dark" />
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 space-y-1.5 px-3 py-2">
        {NAV.map(({ id, label, icon }) => {
          const activo =
            tab === id ||
            (id === "pagos" && tab === "facturas") ||
            (id === "blockchain" && tab === "conciliacion");

          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-150 ${
                activo
                  ? "bg-[#3fd0a8] text-[#08262c] shadow-sm font-bold"
                  : "text-[#8ba7ab] hover:bg-[#0c2e36] hover:text-white"
              }`}
            >
              {icon(activo)}
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Widget inferior: Billetera USDC */}
      <div className="relative p-3 pb-0 overflow-hidden">
        <div
          onClick={() => setTab("blockchain")}
          className="relative z-10 flex cursor-pointer items-center justify-between rounded-xl border border-[#1b4e57] bg-[#092b32]/90 p-3 shadow-sm backdrop-blur-xs transition hover:border-[#3fd0a8]/50"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3fd0a8]/20 text-[#3fd0a8] text-xs font-bold">
              $
            </div>
            <div>
              <p className="text-[10px] text-[#8ba7ab]">USDC en tu billetera</p>
              <p className="text-xs font-bold text-white">
                ${billetera.balanceUSDC.toLocaleString("es-AR")},00 <span className="text-[10px] font-normal text-[#8ba7ab]">USDC</span>
              </p>
            </div>
          </div>
          <span className="text-xs text-[#8ba7ab]">›</span>
        </div>

        {/* Gráfico 3D isométrico en esquina inferior izquierda como en la captura */}
        <div className="pointer-events-none mt-2 -ml-2 -mb-2 opacity-90">
          <svg width="150" height="110" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.95">
              {/* Cubo principal / cinta isométrica */}
              <polygon points="40,30 75,10 110,30 75,50" fill="#25b497" />
              <polygon points="40,30 75,50 75,85 40,65" fill="#176356" />
              <polygon points="75,50 110,30 110,65 75,85" fill="#1b8572" />
              
              {/* Bloque flotante inferior */}
              <polygon points="75,80 110,60 145,80 110,100" fill="#3fd0a8" />
              <polygon points="75,80 110,100 110,120 75,100" fill="#1f7d6d" />
              <polygon points="110,100 145,80 145,100 110,120" fill="#29a38c" />
              
              {/* Bloque lateral izquierdo */}
              <polygon points="15,65 45,50 70,65 40,80" fill="#1b8572" opacity="0.8" />
              <polygon points="15,65 40,80 40,105 15,90" fill="#0f453c" opacity="0.8" />
              <polygon points="40,80 70,65 70,90 40,105" fill="#15594e" opacity="0.8" />
            </g>
          </svg>
        </div>
      </div>
    </aside>
  );
}
