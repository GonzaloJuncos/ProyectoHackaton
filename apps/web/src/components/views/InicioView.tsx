"use client";

import React from "react";
import BarChart from "@/components/BarChart";
import KpiCard from "@/components/KpiCard";
import { useApp } from "@/context/AppContext";
import { KPIS_MOCK, PAGOS_POR_MES } from "@/lib/mock";

const inicial = (nombre: string) =>
  nombre.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function InicioView() {
  const {
    proveedores,
    transacciones,
    billetera,
    setTab,
    setModalNuevaFacturaAbierto,
  } = useApp();

  const provPorId = (id: string) => proveedores.find((p) => p.id === id);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Panel de control</h1>
          <p className="text-xs text-[#8ba7ab] mt-0.5">
            Gestioná tus proveedores y pagos en USDC sobre Solana devnet, con aprobación multisig y evidencia inmutable.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalNuevaFacturaAbierto(true)}
            className="rounded-xl bg-[#3fd0a8] px-4 py-2 text-xs font-bold text-[#08262c] shadow-xs hover:brightness-105"
          >
            + Nueva Factura
          </button>
          <span className="rounded-xl border border-[#164953] bg-[#0a2c34] px-3 py-2 text-xs text-[#8ba7ab]">
            Últimos 30 días
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS_MOCK.map((k) => (
          <KpiCard key={k.titulo} kpi={k} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Columna principal */}
        <div className="space-y-6 xl:col-span-2">
          <section className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-[#164953] pb-3">
              <h2 className="font-semibold text-white">Pagos en USDC (Historial)</h2>
              <button
                onClick={() => setTab("blockchain")}
                className="text-xs font-semibold text-[#3fd0a8] hover:underline"
              >
                Ver conciliación →
              </button>
            </div>
            <BarChart datos={PAGOS_POR_MES} />
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-[#164953] pb-2">
                <h2 className="font-semibold text-white">Últimas transacciones</h2>
                <button
                  onClick={() => setTab("blockchain")}
                  className="text-xs font-semibold text-[#3fd0a8] hover:underline"
                >
                  Ver todas →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-left text-[11px] text-[#8ba7ab]">
                    <tr>
                      <th className="pb-2">Fecha</th>
                      <th className="pb-2">Proveedor</th>
                      <th className="pb-2">Monto</th>
                      <th className="pb-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#133d47]/70">
                    {transacciones.slice(0, 5).map((t) => (
                      <tr key={t.id} className="hover:bg-[#0c313a] text-white/90">
                        <td className="py-2.5 text-xs text-[#8ba7ab]">{t.fecha}</td>
                        <td className="py-2.5 font-medium">{provPorId(t.proveedorId)?.nombre || t.proveedorId}</td>
                        <td className="py-2.5 font-mono text-xs text-[#3fd0a8]">${t.montoUSDC.toLocaleString("es-AR")}</td>
                        <td className="py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              t.estado === "completada"
                                ? "bg-[#0f3d37] text-[#3fd0a8] border border-[#3fd0a8]/30"
                                : "bg-[#3d2f0f] text-[#f59e0b] border border-[#f59e0b]/30"
                            }`}
                          >
                            {t.estado === "completada" ? "Completado" : "En proceso"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-[#164953] pb-2">
                <h2 className="font-semibold text-white">Proveedores frecuentes</h2>
                <button
                  onClick={() => setTab("proveedores")}
                  className="text-xs font-semibold text-[#3fd0a8] hover:underline"
                >
                  Gestionar →
                </button>
              </div>
              <ul className="space-y-3">
                {proveedores.slice(0, 4).map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#113a43] text-xs font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                      {inicial(p.nombre)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{p.nombre}</p>
                      <p className="text-[10px] text-[#8ba7ab]">
                        {p.pais} · {p.pagos} pagos · ${p.totalUSDC.toLocaleString("es-AR")}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#0f3d37] px-2 py-0.5 text-[10px] font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                      Activo
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Billetera de la Empresa */}
        <section className="h-fit rounded-2xl border border-[#164953] bg-[#07242b] p-5 text-white shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-[#164953] pb-3">
            <h2 className="font-semibold">Billetera de Empresa</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-[#0f3d37] px-2.5 py-0.5 text-[10px] font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3fd0a8] animate-pulse" />
              Devnet
            </span>
          </div>

          <p className="text-3xl font-bold">${billetera.balanceUSDC.toLocaleString("es-AR")}.00</p>
          <p className="text-xs text-[#8ba7ab] mt-0.5">Saldo disponible en USDC</p>

          <button
            onClick={() => {
              setTab("pagos");
              setModalNuevaFacturaAbierto(true);
            }}
            className="mt-4 w-full rounded-xl bg-[#3fd0a8] py-2.5 text-xs font-bold text-[#08262c] hover:brightness-105 transition"
          >
            + Cargar y Pagar Factura
          </button>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => setTab("blockchain")}
              className="rounded-xl border border-[#164953] bg-[#0a2c34] py-2 text-xs font-medium hover:border-[#3fd0a8]/50 text-center transition"
            >
              Ver Conciliación
            </button>
            <button
              onClick={() => setTab("proveedores")}
              className="rounded-xl border border-[#164953] bg-[#0a2c34] py-2 text-xs font-medium hover:border-[#3fd0a8]/50 text-center transition"
            >
              Directorio
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-[#0a2c34] p-3 text-xs text-[#8ba7ab] space-y-1 border border-[#164953]">
            <p className="font-semibold text-white">Reglas del Multisig 2/3:</p>
            <p className="text-[11px] text-[#6f9095]">
              Cualquier pago requiere 2 firmas (Jefe, Supervisor o Administrador). La frase semilla nunca toca el servidor.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
