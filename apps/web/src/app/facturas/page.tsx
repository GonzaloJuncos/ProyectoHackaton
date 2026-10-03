"use client";

import { useEffect, useState } from "react";
import { FACTURAS_MOCK, PROVEEDORES_MOCK } from "@/lib/mock";
import { Factura, Rol } from "@/lib/types";

const ROLES_APROBADORES: Rol[] = ["jefe", "supervisor", "administrador"];

const ESTILO_ESTADO: Record<Factura["estado"], string> = {
  pendiente: "bg-amber-100 text-amber-700",
  aprobada: "bg-petroleo/15 text-enlace",
  pagada: "bg-menta/20 text-enlace",
  rechazada: "bg-red-100 text-red-700",
};

export default function Facturas() {
  const [facturas, setFacturas] = useState<Factura[]>(FACTURAS_MOCK);
  const [rol, setRol] = useState<Rol | null>(null);

  useEffect(() => {
    setRol(localStorage.getItem("logis-rol") as Rol | null);
  }, []);

  const nombreProveedor = (id: string) =>
    PROVEEDORES_MOCK.find((p) => p.id === id)?.nombre ?? id;

  const aprobar = (id: string) => {
    if (!rol || !ROLES_APROBADORES.includes(rol)) return;
    setFacturas(
      facturas.map((f) => {
        if (f.id !== id || f.firmas.includes(rol)) return f;
        const firmas = [...f.firmas, rol];
        return { ...f, firmas, estado: firmas.length >= 2 ? "aprobada" : f.estado };
      })
    );
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Facturas</h1>
      <table className="w-full rounded-lg border bg-card text-sm shadow-sm">
        <thead className="border-b bg-fondo text-left">
          <tr>
            <th className="p-3">OC</th><th className="p-3">Proveedor</th><th className="p-3">Monto</th>
            <th className="p-3">Estado</th><th className="p-3">Firmas</th><th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((f) => (
            <tr key={f.id} className="border-b last:border-0">
              <td className="p-3 font-mono text-xs">{f.numeroOC}</td>
              <td className="p-3">{nombreProveedor(f.proveedorId)}</td>
              <td className="p-3">{f.montoUSDC.toLocaleString("es-AR")} USDC</td>
              <td className="p-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILO_ESTADO[f.estado]}`}>
                  {f.estado}
                </span>
              </td>
              <td className="p-3 text-xs">{f.firmas.join(", ") || "—"} ({f.firmas.length}/3)</td>
              <td className="p-3">
                {f.estado === "pendiente" && rol && ROLES_APROBADORES.includes(rol) && !f.firmas.includes(rol) && (
                  <button
                    onClick={() => aprobar(f.id)}
                    className="rounded bg-petroleo px-3 py-1 text-xs font-medium text-white hover:brightness-110"
                  >
                    Firmar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rol === "empleado" && (
        <p className="mt-4 text-sm text-tinta/60">
          Como empleado podés cargar facturas, pero no firmar aprobaciones.
        </p>
      )}
    </div>
  );
}
