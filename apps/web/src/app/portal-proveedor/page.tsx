"use client";

import { useEffect, useState } from "react";
import { FACTURAS_MOCK, PROVEEDORES_MOCK, TXS_MOCK } from "@/lib/mock";
import { Proveedor } from "@/lib/types";

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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold">Logis <span className="text-sm font-normal text-gray-500">· Portal de proveedor</span></span>
          <a href="/login" className="text-sm text-gray-500 hover:underline">Salir</a>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">{proveedor.nombre} · {proveedor.pais}</p>
          <p className="mt-1 text-3xl font-bold">${totalCobrado.toLocaleString("es-AR")} <span className="text-base font-normal text-gray-500">USDC cobrados</span></p>
          <p className="mt-1 font-mono text-xs text-gray-400">Tu wallet: {proveedor.wallet}</p>
          <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Cobrás en <strong>USDC</strong> (stablecoin). La conversión a tu moneda local corre por tu cuenta — tu wallet destino es la que figura arriba.
          </div>
        </div>

        {facturasPendientes.length > 0 && (
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold">Facturas en curso</h2>
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-gray-400">
                <tr><th className="pb-2">OC</th><th className="pb-2">Descripción</th><th className="pb-2">Monto</th><th className="pb-2">Estado</th></tr>
              </thead>
              <tbody>
                {facturasPendientes.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="py-2 font-mono text-xs">{f.numeroOC}</td>
                    <td className="py-2">{f.descripcion}</td>
                    <td className="py-2">{f.montoUSDC.toLocaleString("es-AR")} USDC</td>
                    <td className="py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${f.estado === "aprobada" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {f.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold">Pagos recibidos</h2>
          {cobros.length === 0 ? (
            <p className="text-sm text-gray-500">Todavía no recibiste pagos.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-gray-400">
                <tr><th className="pb-2">Fecha</th><th className="pb-2">Monto</th><th className="pb-2">Estado</th><th className="pb-2">Comprobante on-chain</th></tr>
              </thead>
              <tbody>
                {cobros.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="py-2 text-xs text-gray-500">{t.fecha}</td>
                    <td className="py-2 font-medium">{t.montoUSDC.toLocaleString("es-AR")} USDC</td>
                    <td className="py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.estado === "completada" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {t.estado === "completada" ? "Completado" : "En proceso"}
                      </span>
                    </td>
                    <td className="py-2">
                      <a
                        href={`https://explorer.solana.com/tx/${t.txHash}?cluster=devnet`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs text-blue-600 hover:underline"
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
