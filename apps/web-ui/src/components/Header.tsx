"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Rol } from "@/lib/types";

const ROLES: Array<{ id: Rol; label: string }> = [
  { id: "administrador", label: "Admin" },
  { id: "jefe", label: "Jefe" },
  { id: "supervisor", label: "Supervisor" },
  { id: "empleado", label: "Empleado" },
];

export default function Header() {
  const { rol, setRol, nombreUsuario, setModalNuevaFacturaAbierto, toast } = useApp();
  const [menuRolAbierto, setMenuRolAbierto] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#133d47] bg-[#072127]/95 px-6 backdrop-blur-md">
        {/* Barra de búsqueda con ⌘K */}
        <div className="flex w-full max-w-md items-center gap-2.5 rounded-xl border border-[#164953] bg-[#0a2c34] px-3.5 py-2 text-xs text-[#8ba7ab] shadow-inner focus-within:border-[#3fd0a8]/60 transition">
          <svg className="h-4 w-4 text-[#8ba7ab]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar proveedor, CUIT o factura..."
            className="w-full bg-transparent text-xs text-white placeholder-[#6f9095] outline-none"
          />
          <kbd className="rounded bg-[#072127] px-1.5 py-0.5 text-[10px] font-mono text-[#8ba7ab] border border-[#164953]">
            ⌘ K
          </kbd>
        </div>

        {/* Acciones derecha: Notificación + Perfil */}
        <div className="flex items-center gap-4">
          {/* Selector de rol para la demo */}
          <div className="relative">
            <button
              onClick={() => setMenuRolAbierto(!menuRolAbierto)}
              className="flex items-center gap-1.5 rounded-lg border border-[#1a4a55] bg-[#092e36] px-2.5 py-1 text-[11px] font-medium text-[#8ba7ab] hover:border-[#3fd0a8]/50 hover:text-white transition"
              title="Cambiar rol para ensayar la demo de la hackathon"
            >
              <span>Rol:</span>
              <span className="font-bold text-[#3fd0a8] capitalize">{rol}</span>
              <span className="text-[10px]">▾</span>
            </button>

            {menuRolAbierto && (
              <div className="absolute right-0 mt-1.5 w-36 rounded-xl border border-[#1a4a55] bg-[#07242b] p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <p className="px-2 py-1 text-[10px] text-[#6f9095] font-semibold">Simular rol:</p>
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRol(r.id);
                      setMenuRolAbierto(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs transition ${
                      rol === r.id
                        ? "bg-[#3fd0a8] text-[#08262c] font-bold"
                        : "text-[#8ba7ab] hover:bg-[#0c313a] hover:text-white"
                    }`}
                  >
                    <span>{r.label}</span>
                    {rol === r.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botón Campana con punto verde de notificación */}
          <button className="relative rounded-xl p-2 text-[#8ba7ab] hover:bg-[#0c2e36] hover:text-white transition">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-4-5.7V5a2 2 0 10-4 0v.3A6 6 0 006 11v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#3fd0a8] ring-2 ring-[#072127]" />
          </button>

          {/* Perfil de Usuario */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#133d47]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b6b5e] text-[#3fd0a8] border border-[#3fd0a8]/40 shadow-xs">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="text-left text-xs">
              <p className="font-semibold text-white leading-tight">{nombreUsuario}</p>
              <p className="text-[10px] text-[#8ba7ab] capitalize">{rol === "administrador" ? "Administradora" : rol}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Toast Notification flotante */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2 rounded-xl bg-[#08262c] px-4 py-3 text-xs font-semibold text-white shadow-xl border border-[#3fd0a8]/40">
            <span className="text-[#3fd0a8]">●</span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </>
  );
}
