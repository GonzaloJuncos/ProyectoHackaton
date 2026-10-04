"use client";

import { useEffect, useState } from "react";
import { FACTURAS_MOCK, PROVEEDORES_MOCK, TXS_MOCK } from "@/lib/mock";
import { Proveedor } from "@/lib/types";
import LogisLogo from "@/components/LogisLogo";

export default function PortalProveedor() {
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("logis-proveedor");
    setProveedor(PROVEEDORES_MOCK.find((p) => p.id === id) ?? PROVEEDORES_MOCK[0]);
  }, []);

  if (!proveedor) return null;

  const cobros = TXS_MOCK.filter((t) => t.proveedorId === proveedor.id);
  const facturasPendientes = FACTURAS_MOCK.filter(
    (f) => f.proveedorId === proveedor.id && (f.estado === "pendiente" || f.estado === "aprobada")
  );
  const totalCobrado = cobros.filter((t) => t.estado === "completada").reduce((s, t) => s + t.montoUSDC, 0);

  return (
    <div className="min-h-screen bg-fondo">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <LogisLogo className="h-6 w-auto" />
            <span className="text-sm font-normal text-tinta/50">· Portal de proveedor</span>
          </div>
          <a href="/login" className="text-sm text-enlace hover:underline">Salir</a>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <div className="rounded-xl bg-oscuro p-5 text-white shadow-sm">
          <p className="text-sm text-white/60">{proveedor.nombre} · {proveedor.pais}</p>
          <p className="mt-1 text-3xl font-bold">${totalCobrado.toLocaleString("es-AR")} <span className="text-base font-normal text-white/50">USDC cobrados</span></p>
          <p className="mt-1 font-mono text-xs text-white/40">Tu wallet: {proveedor.wallet}</p>
          <div className="mt-3 rounded-lg bg-menta/15 px-3 py-2 text-xs text-menta">
            Cobrás en <strong>USDC</strong> (stablecoin). La conversión a tu moneda local corre por tu cuenta — tu wallet destino es la que figura arriba.
          </div>
        </div>

        {facturasPendientes.length > 0 && (
          <section className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-tinta">Facturas en curso</h2>
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-tinta/40">
                <tr><th className="pb-2">OC</th><th className="pb-2">Descripción</th><th className="pb-2">Monto</th><th className="pb-2">Estado</th></tr>
              </thead>
              <tbody>
                {facturasPendientes.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="py-2 font-mono text-xs">{f.numeroOC}</td>
                    <td className="py-2">{f.descripcion}</td>
                    <td className="py-2">{f.montoUSDC.toLocaleString("es-AR")} USDC</td>
                    <td className="py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${f.estado === "aprobada" ? "bg-petroleo/15 text-enlace" : "bg-amber-100 text-amber-700"}`}>
                        {f.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-tinta">Pagos recibidos</h2>
          {cobros.length === 0 ? (
            <p className="text-sm text-tinta/60">Todavía no recibiste pagos.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-tinta/40">
                <tr><th className="pb-2">Fecha</th><th className="pb-2">Monto</th><th className="pb-2">Estado</th><th className="pb-2">Comprobante on-chain</th></tr>
              </thead>
              <tbody>
                {cobros.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="py-2 text-xs text-tinta/60">{t.fecha}</td>
                    <td className="py-2 font-medium">{t.montoUSDC.toLocaleString("es-AR")} USDC</td>
                    <td className="py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.estado === "completada" ? "bg-menta/20 text-enlace" : "bg-amber-100 text-amber-700"}`}>
                        {t.estado === "completada" ? "Completado" : "En proceso"}
                      </span>
                    </td>
                    <td className="py-2">
                      <a
                        href={`https://explorer.solana.com/tx/${t.txHash}?cluster=devnet`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs text-enlace hover:underline"
                      >
                        {t.txHash.slice(0, 12)}…
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
