"use client";

import { FACTURAS_MOCK, PROVEEDORES_MOCK } from "@/lib/mock";

export default function Conciliacion() {
  const pagadas = FACTURAS_MOCK.filter((f) => f.estado === "pagada");
  const nombreProveedor = (id: string) =>
    PROVEEDORES_MOCK.find((p) => p.id === id)?.nombre ?? id;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Conciliación</h1>
      <p className="mb-6 text-sm text-tinta/60">
        Cada factura vinculada a su pago on-chain. El hash de la factura viaja en el memo de la transacción.
      </p>
      <table className="w-full rounded-lg border bg-card text-sm shadow-sm">
        <thead className="border-b bg-fondo text-left">
          <tr><th className="p-3">Factura / OC</th><th className="p-3">Proveedor</th><th className="p-3">Monto</th><th className="p-3">Tx on-chain</th></tr>
        </thead>
        <tbody>
          {pagadas.map((f) => (
            <tr key={f.id} className="border-b last:border-0">
              <td className="p-3 font-mono text-xs">{f.numeroOC}</td>
              <td className="p-3">{nombreProveedor(f.proveedorId)}</td>
              <td className="p-3">{f.montoUSDC.toLocaleString("es-AR")} USDC</td>
              <td className="p-3">
                <a
                  href={`https://explorer.solana.com/tx/${f.txHash}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-enlace hover:underline"
                >
                  {f.txHash}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
