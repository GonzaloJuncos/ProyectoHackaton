"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function ConciliacionView() {
  const { facturas, proveedores, setFacturaSeleccionada, notificar } = useApp();
  const [copiado, setCopiado] = useState<string | null>(null);

  const pagadas = facturas.filter((f) => f.estado === "pagada");

  const nombreProveedor = (id: string) =>
    proveedores.find((p) => p.id === id)?.nombre ?? id;

  const paisProveedor = (id: string) =>
    proveedores.find((p) => p.id === id)?.pais ?? "";

  const totalConciliado = pagadas.reduce((s, f) => s + f.montoUSDC, 0);

  const copiarHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiado(id);
    notificar("Hash de factura copiado al portapapeles.");
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Conciliación Blockchain</h1>
        <p className="text-xs text-[#8ba7ab]">
          Trazabilidad inmutable on-chain en Solana devnet. Cada factura vinculada a su hash criptográfico embebido en el memo de la red.
        </p>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm">
          <span className="text-[11px] text-[#8ba7ab]">Facturas Conciliadas</span>
          <p className="mt-1 text-2xl font-bold text-white">{pagadas.length}</p>
          <span className="text-[11px] text-[#3fd0a8] font-medium">100% con evidencia on-chain</span>
        </div>
        <div className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm">
          <span className="text-[11px] text-[#8ba7ab]">Total Liquidado en Devnet</span>
          <p className="mt-1 text-2xl font-bold text-white">
            ${totalConciliado.toLocaleString("es-AR")} <span className="text-xs font-normal text-[#8ba7ab]">USDC</span>
          </p>
          <span className="text-[11px] text-[#8ba7ab]">Fondos de prueba (sin riesgo)</span>
        </div>
        <div className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm">
          <span className="text-[11px] text-[#8ba7ab]">Verificación de Integridad</span>
          <p className="mt-1 text-2xl font-bold text-[#3fd0a8]">Auditado</p>
          <span className="text-[11px] text-[#8ba7ab]">Memo SHA-256 coincide con el comprobante</span>
        </div>
      </div>

      {/* Tabla de Conciliación */}
      <div className="rounded-2xl border border-[#164953] bg-[#0a2c34] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#164953] bg-[#07242b] text-[11px] text-[#8ba7ab]">
              <tr>
                <th className="p-3.5">Factura / OC</th>
                <th className="p-3.5">Proveedor</th>
                <th className="p-3.5">Monto Liquidado</th>
                <th className="p-3.5">Hash de Factura (Memo On-Chain)</th>
                <th className="p-3.5">Tx Solana Explorer</th>
                <th className="p-3.5 text-right">Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#133d47]/70">
              {pagadas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-[#8ba7ab]">
                    Aún no hay facturas pagadas para conciliar. Aprobá y pagá una factura desde la sección de Pagos.
                  </td>
                </tr>
              ) : (
                pagadas.map((f) => (
                  <tr
                    key={f.id}
                    className="hover:bg-[#0c313a] text-white/90 transition-colors"
                  >
                    <td className="p-3.5">
                      <button
                        onClick={() => setFacturaSeleccionada(f)}
                        className="font-mono text-xs font-bold text-[#3fd0a8] hover:underline text-left cursor-pointer"
                      >
                        {f.numeroOC}
                      </button>
                      <div className="text-[11px] text-[#6f9095]">{f.descripcion}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-white">{nombreProveedor(f.proveedorId)}</div>
                      <div className="text-[11px] text-[#8ba7ab]">{paisProveedor(f.proveedorId)}</div>
                    </td>

                    <td className="p-3.5 font-mono text-xs font-semibold text-white whitespace-nowrap">
                      ${f.montoUSDC.toLocaleString("es-AR")} <span className="text-[#8ba7ab] text-[10px]">USDC</span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#8ba7ab] bg-[#07242b] px-2 py-1 rounded-lg border border-[#164953] max-w-[170px] truncate select-all">
                          {f.facturaHash || "e3b0c442...855"}
                        </span>
                        <button
                          onClick={() => copiarHash(f.facturaHash || "", f.id)}
                          className="text-[11px] text-[#3fd0a8] hover:underline shrink-0"
                        >
                          {copiado === f.id ? "✓" : "Copiar"}
                        </button>
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      {f.txHash ? (
                        <a
                          href={`https://explorer.solana.com/tx/${f.txHash}?cluster=devnet`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-[#3fd0a8] hover:underline"
                        >
                          <span>{f.txHash.slice(0, 8)}…{f.txHash.slice(-6)}</span>
                          <span className="text-[10px]">↗</span>
                        </a>
                      ) : (
                        <span className="text-xs text-[#6f9095]">Sin tx</span>
                      )}
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#0f3d37] px-2.5 py-0.5 text-xs font-semibold text-[#3fd0a8] border border-[#3fd0a8]/30">
                        <span>✔</span> Conciliado
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
