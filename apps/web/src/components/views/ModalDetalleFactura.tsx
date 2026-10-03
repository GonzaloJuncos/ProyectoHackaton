"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Rol } from "@/lib/types";

const ROLES_APROBADORES: Rol[] = ["jefe", "supervisor", "administrador"];

export default function ModalDetalleFactura() {
  const {
    facturaSeleccionada,
    setFacturaSeleccionada,
    rol,
    firmarFactura,
    ejecutarPago,
    proveedores,
    notificar,
  } = useApp();

  const [copiado, setCopiado] = useState<string | null>(null);
  const [pagando, setPagando] = useState(false);

  if (!facturaSeleccionada) return null;

  const proveedor = proveedores.find((p) => p.id === facturaSeleccionada.proveedorId);
  const firmasRequeridas = 2;
  const totalFirmas = facturaSeleccionada.firmas.length;
  const tieneQuorum = totalFirmas >= firmasRequeridas;
  const puedeFirmar =
    facturaSeleccionada.estado === "pendiente" &&
    ROLES_APROBADORES.includes(rol) &&
    !facturaSeleccionada.firmas.includes(rol);
  const yaFirmo = facturaSeleccionada.firmas.includes(rol);

  const copiarTexto = (txt: string, tipo: string) => {
    navigator.clipboard.writeText(txt);
    setCopiado(tipo);
    notificar(`${tipo} copiado al portapapeles.`);
    setTimeout(() => setCopiado(null), 2000);
  };

  const handlePagar = () => {
    setPagando(true);
    setTimeout(() => {
      ejecutarPago(facturaSeleccionada.id);
      setPagando(false);
    }, 1200);
  };

  const agente = facturaSeleccionada.verificacionAgente;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05161b]/80 backdrop-blur-sm p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#164953] bg-[#0a2c34] p-6 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="flex items-start justify-between border-b border-[#164953] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#3fd0a8] bg-[#0f3d37] px-2 py-0.5 rounded border border-[#3fd0a8]/30">
                {facturaSeleccionada.numeroOC}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                  facturaSeleccionada.estado === "pagada"
                    ? "bg-[#0f3d37] text-[#3fd0a8] border border-[#3fd0a8]/30"
                    : facturaSeleccionada.estado === "aprobada"
                    ? "bg-[#0f2d3d] text-[#38bdf8] border border-[#38bdf8]/30"
                    : facturaSeleccionada.estado === "rechazada"
                    ? "bg-[#3d1414] text-[#ef4444] border border-[#ef4444]/30"
                    : "bg-[#3d2f0f] text-[#f59e0b] border border-[#f59e0b]/30"
                }`}
              >
                {facturaSeleccionada.estado}
              </span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-white">
              {facturaSeleccionada.descripcion}
            </h2>
            <p className="text-xs text-[#8ba7ab]">
              Proveedor: <strong className="text-white">{proveedor?.nombre}</strong> ({proveedor?.pais}) · Fecha: {facturaSeleccionada.fecha || "Reciente"}
            </p>
          </div>
          <button
            onClick={() => setFacturaSeleccionada(null)}
            className="rounded-lg p-1.5 text-[#8ba7ab] hover:bg-[#07242b] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Monto y Wallet */}
        <div className="my-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#164953] bg-[#07242b] p-4">
            <span className="text-xs text-[#8ba7ab]">Monto a liquidar</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white">
                ${facturaSeleccionada.montoUSDC.toLocaleString("es-AR")}
              </span>
              <span className="text-xs font-semibold text-[#3fd0a8] bg-[#08262c] px-1.5 py-0.5 rounded border border-[#3fd0a8]/20">
                USDC (devnet)
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[#164953] bg-[#07242b] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8ba7ab]">Wallet destino</span>
              <button
                onClick={() => copiarTexto(proveedor?.wallet || "", "Wallet")}
                className="text-[11px] font-medium text-[#3fd0a8] hover:underline"
              >
                {copiado === "Wallet" ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
            <p className="mt-1 font-mono text-xs text-white/90 break-all">
              {proveedor?.wallet}
            </p>
          </div>
        </div>

        {/* Huella Criptográfica (Memo Hash) */}
        <div className="mb-5 rounded-xl border border-[#164953] bg-[#07242b] p-3.5 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-white flex items-center gap-1.5">
              🔒 Hash de Factura (Embebido en Memo Solana)
            </span>
            <button
              onClick={() => copiarTexto(facturaSeleccionada.facturaHash || "", "Hash")}
              className="text-[11px] text-[#3fd0a8] font-medium hover:underline"
            >
              {copiado === "Hash" ? "✓ Copiado" : "Copiar Hash"}
            </button>
          </div>
          <p className="font-mono text-[11px] text-[#8ba7ab] break-all select-all">
            {facturaSeleccionada.facturaHash || "No generado"}
          </p>
          <p className="mt-1 text-[10px] text-[#6f9095]">
            Garantiza que la factura comercial no pueda ser modificada tras su aprobación.
          </p>
        </div>

        {/* Sección Multisig 2/3 */}
        <div className="mb-5 rounded-xl border border-[#164953] bg-[#07242b] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🛡 Aprobación Multisig (Squads 2/3)</span>
                <span className="rounded-full bg-[#0a2c34] px-2 py-0.5 text-xs font-semibold text-[#8ba7ab] border border-[#164953]">
                  {totalFirmas} de {firmasRequeridas} firmas
                </span>
              </h3>
              <p className="text-xs text-[#8ba7ab]">
                Se requieren 2 firmas de Jefe, Supervisor o Administrador.
              </p>
            </div>

            {puedeFirmar && (
              <button
                onClick={() => firmarFactura(facturaSeleccionada.id)}
                className="flex items-center gap-1.5 rounded-xl bg-[#3fd0a8] px-4 py-2 text-xs font-bold text-[#08262c] shadow-xs hover:brightness-105"
              >
                ✍ Firmar como {rol.toUpperCase()}
              </button>
            )}
          </div>

          {/* Chips de estado de firmas */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {ROLES_APROBADORES.map((r) => {
              const firmado = facturaSeleccionada.firmas.includes(r);
              return (
                <div
                  key={r}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 ${
                    firmado
                      ? "border-[#3fd0a8]/40 bg-[#0f3d37] text-[#3fd0a8]"
                      : "border-[#164953] bg-[#0a2c34] text-[#6f9095]"
                  }`}
                >
                  <span className="text-base">{firmado ? "✔" : "○"}</span>
                  <div>
                    <p className="font-semibold capitalize text-white">{r}</p>
                    <p className="text-[10px] text-[#8ba7ab]">
                      {firmado ? "Firma registrada" : "Pendiente"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {yaFirmo && facturaSeleccionada.estado === "pendiente" && (
            <p className="mt-3 text-xs text-[#3fd0a8] bg-[#0f3d37] border border-[#3fd0a8]/30 px-3 py-1.5 rounded-lg font-medium">
              ✓ Ya registraste tu firma como {rol}. Esperando la segunda firma de otro responsable.
            </p>
          )}

          {rol === "empleado" && (
            <p className="mt-3 text-xs text-[#f59e0b] bg-[#3d2f0f] border border-[#f59e0b]/30 p-2.5 rounded-lg">
              ℹ Rol Empleado: tenés permiso de carga pero no de firma (principio de segregación de funciones).
            </p>
          )}
        </div>

        {/* Sección Agente Verificador de IA (RF-06) */}
        <div className="mb-5 rounded-xl border border-[#164953] bg-[#07242b] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3fd0a8]/20 text-[#3fd0a8] text-xs">
                ✦
              </span>
              Agente Verificador de Pagos (Auditoría Automática)
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                agente?.estado === "aprobado"
                  ? "bg-[#0f3d37] text-[#3fd0a8] border border-[#3fd0a8]/30"
                  : agente?.estado === "rechazado"
                  ? "bg-[#3d1414] text-[#ef4444] border border-[#ef4444]/30"
                  : "bg-[#3d2f0f] text-[#f59e0b] border border-[#f59e0b]/30"
              }`}
            >
              {agente?.estado === "aprobado"
                ? "Verificación Exitosa"
                : agente?.estado === "rechazado"
                ? "Rechazada por Agente"
                : "En espera de quorum"}
            </span>
          </div>

          <p className="text-xs text-[#8ba7ab] mb-3">
            El agente audita las reglas de negocio antes de liberar el despacho on-chain.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-[#0a2c34] p-2 border border-[#164953]">
              <span className="text-[#3fd0a8]">{agente?.ocValida ? "✔" : "✕"}</span>
              <span className="text-[#8ba7ab]">Orden de Compra válida</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[#0a2c34] p-2 border border-[#164953]">
              <span className="text-[#3fd0a8]">{agente?.proveedorValido ? "✔" : "✕"}</span>
              <span className="text-[#8ba7ab]">Proveedor y wallet auditados</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[#0a2c34] p-2 border border-[#164953]">
              <span className="text-[#3fd0a8]">{agente?.sinDuplicados ? "✔" : "✕"}</span>
              <span className="text-[#8ba7ab]">Sin duplicados en el ledger</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[#0a2c34] p-2 border border-[#164953]">
              <span className="text-[#3fd0a8]">{agente?.montoValido ? "✔" : "✕"}</span>
              <span className="text-[#8ba7ab]">Monto congruente</span>
            </div>
          </div>

          {agente?.detalles && (
            <p className="mt-3 text-xs text-[#8ba7ab] italic bg-[#0a2c34] p-2.5 rounded-lg border border-[#164953]">
              "{agente.detalles}"
            </p>
          )}
        </div>

        {/* Estado final y Ejecución del Pago */}
        {facturaSeleccionada.estado === "pagada" ? (
          <div className="rounded-xl bg-[#07242b] p-4 text-white border border-[#164953]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#3fd0a8] flex items-center gap-1.5">
                  ● PAGO LIQUIDADO EN SOLANA DEVNET
                </p>
                <p className="mt-1 font-mono text-xs text-white/80 break-all">
                  Tx: {facturaSeleccionada.txHash}
                </p>
              </div>
              <a
                href={`https://explorer.solana.com/tx/${facturaSeleccionada.txHash}?cluster=devnet`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-[#3fd0a8] px-3.5 py-2 text-xs font-bold text-[#08262c] hover:brightness-110 shrink-0"
              >
                Ver en Solana Explorer ↗
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between border-t border-[#164953] pt-4">
            <p className="text-xs text-[#8ba7ab]">
              {tieneQuorum && agente?.estado === "aprobado"
                ? "Listo para ejecutar transferencia USDC."
                : "Faltan firmas o validación del agente para habilitar pago."}
            </p>

            <button
              disabled={!tieneQuorum || agente?.estado !== "aprobado" || pagando}
              onClick={handlePagar}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold transition shadow-xs ${
                tieneQuorum && agente?.estado === "aprobado" && !pagando
                  ? "bg-[#3fd0a8] text-[#08262c] hover:brightness-105 cursor-pointer"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              {pagando ? (
                <>
                  <span className="animate-spin">⚙</span> Enviando a Solana Devnet...
                </>
              ) : (
                <>🚀 Despachar Pago USDC (Devnet)</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
