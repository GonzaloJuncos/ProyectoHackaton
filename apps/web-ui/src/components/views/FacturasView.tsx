"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { EstadoFactura } from "@/lib/types";

const ESTILO_ESTADO: Record<EstadoFactura, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  aprobada: "bg-petroleo/15 text-enlace",
  pagada: "bg-menta/25 text-enlace",
  rechazada: "bg-red-100 text-red-700",
};

export default function FacturasView() {
  const {
    facturas,
    proveedores,
    rol,
    setFacturaSeleccionada,
    setModalNuevaFacturaAbierto,
  } = useApp();

  const [filtro, setFiltro] = useState<"todas" | EstadoFactura>("todas");
  const [busqueda, setBusqueda] = useState("");

  const nombreProveedor = (id: string) =>
    proveedores.find((p) => p.id === id)?.nombre ?? id;

  const paisProveedor = (id: string) =>
    proveedores.find((p) => p.id === id)?.pais ?? "";

  const filtradas = facturas.filter((f) => {
    if (filtro !== "todas" && f.estado !== filtro) return false;
    if (busqueda.trim() !== "") {
      const q = busqueda.toLowerCase();
      const prov = nombreProveedor(f.proveedorId).toLowerCase();
      const oc = f.numeroOC.toLowerCase();
      const desc = f.descripcion.toLowerCase();
      return prov.includes(q) || oc.includes(q) || desc.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tinta">Facturas y Aprobaciones</h1>
          <p className="text-sm text-tinta/60">
            Flujo de aprobación multisig 2/3 con validación automática por agente de IA y liquidación en USDC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalNuevaFacturaAbierto(true)}
            className="flex items-center gap-1.5 rounded-lg bg-petroleo px-4 py-2 text-xs font-semibold text-white shadow-xs hover:brightness-110"
          >
            <span>+</span> Nueva Factura
          </button>
        </div>
      </div>

      {/* Banner de rol activo */}
      <div className="rounded-xl border border-petroleo/15 bg-petroleo/5 p-3.5 text-xs text-tinta flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-petroleo text-white font-bold text-[10px]">
            {rol.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <span className="font-semibold capitalize">{rol}</span>:{" "}
            {rol === "empleado" ? (
              <span className="text-tinta/70">
                Podés cargar nuevas facturas y proveedores. No contás con permisos de aprobación on-chain.
              </span>
            ) : (
              <span className="text-tinta/70">
                Contás con permisos de firma en el multisig 2/3 (Squads devnet) para liberar pagos autorizados.
              </span>
            )}
          </div>
        </div>
        <span className="text-[11px] text-enlace font-medium hidden sm:inline">
          (Podés cambiar de rol en la barra superior para ensayar la demo)
        </span>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5 text-xs">
          {(["todas", "pendiente", "aprobada", "pagada", "rechazada"] as const).map((est) => (
            <button
              key={est}
              onClick={() => setFiltro(est)}
              className={`rounded-lg px-3 py-1.5 font-medium capitalize transition ${
                filtro === est
                  ? "bg-petroleo text-white shadow-xs"
                  : "bg-card text-tinta/60 border hover:bg-fondo"
              }`}
            >
              {est === "todas" ? "Todas" : est}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por OC o proveedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full sm:w-64 rounded-lg border bg-card px-3 py-1.5 text-xs text-tinta outline-none focus:border-menta"
          />
        </div>
      </div>

      {/* Tabla de Facturas */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-fondo text-xs text-tinta/60">
              <tr>
                <th className="p-3.5">OC</th>
                <th className="p-3.5">Proveedor</th>
                <th className="p-3.5">Descripción</th>
                <th className="p-3.5">Monto</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5">Multisig</th>
                <th className="p-3.5">Agente IA</th>
                <th className="p-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-tinta/50">
                    No se encontraron facturas con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filtradas.map((f) => {
                  const tieneMiFirma = f.firmas.includes(rol);
                  const puedeFirmar =
                    f.estado === "pendiente" &&
                    ["jefe", "supervisor", "administrador"].includes(rol) &&
                    !tieneMiFirma;

                  return (
                    <tr
                      key={f.id}
                      onClick={() => setFacturaSeleccionada(f)}
                      className="border-b last:border-0 hover:bg-fondo/60 transition cursor-pointer"
                    >
                      <td className="p-3.5 font-mono text-xs font-semibold text-tinta">
                        {f.numeroOC}
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-tinta">{nombreProveedor(f.proveedorId)}</div>
                        <div className="text-[11px] text-tinta/50">{paisProveedor(f.proveedorId)}</div>
                      </td>
                      <td className="p-3.5 text-xs text-tinta/70 max-w-[200px] truncate">
                        {f.descripcion}
                      </td>
                      <td className="p-3.5 font-mono text-xs font-semibold text-tinta whitespace-nowrap">
                        ${f.montoUSDC.toLocaleString("es-AR")} <span className="text-[10px] text-tinta/50">USDC</span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                            ESTILO_ESTADO[f.estado]
                          }`}
                        >
                          {f.estado}
                        </span>
                      </td>
                      <td className="p-3.5 text-xs whitespace-nowrap">
                        <span className="font-medium text-tinta">
                          {f.firmas.length}/2 firmas
                        </span>
                        {f.firmas.length > 0 && (
                          <div className="text-[10px] text-tinta/50 capitalize truncate max-w-[120px]">
                            {f.firmas.join(", ")}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            f.verificacionAgente?.estado === "aprobado"
                              ? "bg-menta/20 text-enlace"
                              : f.verificacionAgente?.estado === "rechazado"
                              ? "bg-red-100 text-red-700"
                              : "bg-fondo text-tinta/50 border"
                          }`}
                        >
                          <span>
                            {f.verificacionAgente?.estado === "aprobado"
                              ? "✔"
                              : f.verificacionAgente?.estado === "rechazado"
                              ? "✕"
                              : "⏳"}
                          </span>
                          {f.verificacionAgente?.estado === "aprobado"
                            ? "Auditado"
                            : f.verificacionAgente?.estado === "rechazado"
                            ? "Alerta"
                            : "Pendiente"}
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        {puedeFirmar ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFacturaSeleccionada(f);
                            }}
                            className="rounded-lg bg-petroleo px-2.5 py-1 text-xs font-semibold text-white hover:brightness-110"
                          >
                            Firmar
                          </button>
                        ) : f.estado === "aprobada" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFacturaSeleccionada(f);
                            }}
                            className="rounded-lg bg-menta px-2.5 py-1 text-xs font-semibold text-oscuro hover:brightness-105"
                          >
                            Pagar
                          </button>
                        ) : (
                          <span className="text-xs text-enlace font-medium hover:underline">
                            Ver detalle →
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
