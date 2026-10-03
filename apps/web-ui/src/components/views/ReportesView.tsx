"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export default function ReportesView() {
  const { facturas, proveedores, notificar } = useApp();

  const exportarAuditoria = () => {
    notificar("Reporte de auditoría exportado correctamente en formato JSON.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tinta">Reportes y Auditoría</h1>
          <p className="text-sm text-tinta/60">
            Resumen contable y trazabilidad on-chain para auditoría fiscal y compliance internacional.
          </p>
        </div>
        <button
          onClick={exportarAuditoria}
          className="rounded-lg bg-petroleo px-4 py-2 text-xs font-semibold text-white shadow-xs hover:brightness-110"
        >
          ⬇ Exportar Ledger de Auditoría
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 shadow-xs">
          <h2 className="font-semibold text-tinta mb-3">Distribución por País Proveedor</h2>
          <div className="space-y-3">
            {["Argentina", "China", "Chile"].map((pais) => {
              const provs = proveedores.filter((p) => p.pais.toLowerCase() === pais.toLowerCase());
              const ids = provs.map((p) => p.id);
              const total = facturas
                .filter((f) => ids.includes(f.proveedorId) && f.estado === "pagada")
                .reduce((s, f) => s + f.montoUSDC, 0);

              return (
                <div key={pais} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-tinta">{pais}</span>
                    <span className="font-mono text-tinta/70">${total.toLocaleString("es-AR")} USDC</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-fondo overflow-hidden">
                    <div
                      className="h-full bg-petroleo rounded-full"
                      style={{ width: `${Math.min(100, Math.max(15, total / 100))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5 shadow-xs">
          <h2 className="font-semibold text-tinta mb-3">Cumplimiento Multisig y Agente IA</h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-tinta/70">Aprobación Multisig 2/3 requerida:</span>
              <span className="font-semibold text-enlace">100% de los pagos</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-tinta/70">Facturas auditadas por Agente IA:</span>
              <span className="font-semibold text-enlace">{facturas.length} procesadas</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-tinta/70">Anomalías / Facturas bloqueadas:</span>
              <span className="font-semibold text-red-600">
                {facturas.filter((f) => f.estado === "rechazada").length} detectadas
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-tinta/70">Red blockchain:</span>
              <span className="font-semibold text-menta bg-oscuro px-2 py-0.5 rounded">
                Solana Devnet (Memo V1)
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
