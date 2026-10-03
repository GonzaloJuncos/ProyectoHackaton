"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function ModalNuevaFactura() {
  const {
    modalNuevaFacturaAbierto,
    setModalNuevaFacturaAbierto,
    proveedores,
    agregarFactura,
    importarFacturasCSV,
  } = useApp();

  const [modo, setModo] = useState<"manual" | "csv">("manual");
  const [numeroOC, setNumeroOC] = useState("");
  const [proveedorId, setProveedorId] = useState(proveedores[0]?.id || "");
  const [montoUSDC, setMontoUSDC] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nombreArchivo, setNombreArchivo] = useState("");

  if (!modalNuevaFacturaAbierto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroOC || !proveedorId || !montoUSDC) return;

    agregarFactura({
      numeroOC: numeroOC.trim(),
      proveedorId,
      montoUSDC: parseFloat(montoUSDC),
      descripcion: descripcion.trim() || "Factura comercial de servicios/bienes",
    });

    setModalNuevaFacturaAbierto(false);
    setNumeroOC("");
    setMontoUSDC("");
    setDescripcion("");
    setNombreArchivo("");
  };

  const cargarDemoCSV = () => {
    const facturasDemo = [
      {
        numeroOC: "OC-2026-110",
        proveedorId: proveedores[0]?.id || "p1",
        montoUSDC: 2850,
        descripcion: "Lote de sensores y plaquetas importadas",
      },
      {
        numeroOC: "OC-2026-111",
        proveedorId: proveedores[1]?.id || "p2",
        montoUSDC: 1420,
        descripcion: "Mantenimiento servidores cloud y hosting",
      },
      {
        numeroOC: "OC-2026-112",
        proveedorId: proveedores[2]?.id || "p3",
        montoUSDC: 5300,
        descripcion: "Suministro materias primas Q4",
      },
    ];
    importarFacturasCSV(facturasDemo);
    setModalNuevaFacturaAbierto(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05161b]/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#164953] bg-[#0a2c34] p-6 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="mb-4 flex items-center justify-between border-b border-[#164953] pb-3">
          <div>
            <h2 className="text-lg font-bold text-white">Carga de Factura</h2>
            <p className="text-xs text-[#8ba7ab]">
              Genera automáticamente el hash SHA-256 para el memo on-chain en Solana devnet.
            </p>
          </div>
          <button
            onClick={() => setModalNuevaFacturaAbierto(false)}
            className="rounded-lg p-1.5 text-[#8ba7ab] hover:bg-[#07242b] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Selector de modo */}
        <div className="mb-5 flex rounded-xl border border-[#164953] bg-[#07242b] p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setModo("manual")}
            className={`flex-1 rounded-lg py-2 transition ${
              modo === "manual"
                ? "bg-[#3fd0a8] text-[#08262c] font-bold shadow-xs"
                : "text-[#8ba7ab] hover:text-white"
            }`}
          >
            ✍ Carga Manual
          </button>
          <button
            type="button"
            onClick={() => setModo("csv")}
            className={`flex-1 rounded-lg py-2 transition ${
              modo === "csv"
                ? "bg-[#3fd0a8] text-[#08262c] font-bold shadow-xs"
                : "text-[#8ba7ab] hover:text-white"
            }`}
          >
            📊 Importar CSV
          </button>
        </div>

        {modo === "manual" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#8ba7ab]">
                  N° Orden de Compra (OC)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. OC-1055"
                  value={numeroOC}
                  onChange={(e) => setNumeroOC(e.target.value)}
                  className="w-full rounded-xl border border-[#164953] bg-[#07242b] px-3 py-2 text-xs text-white outline-none focus:border-[#3fd0a8]/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#8ba7ab]">
                  Proveedor
                </label>
                <select
                  value={proveedorId}
                  onChange={(e) => setProveedorId(e.target.value)}
                  className="w-full rounded-xl border border-[#164953] bg-[#07242b] px-3 py-2 text-xs text-white outline-none focus:border-[#3fd0a8]/50"
                >
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} ({p.pais})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#8ba7ab]">
                Monto en USDC
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={montoUSDC}
                  onChange={(e) => setMontoUSDC(e.target.value)}
                  className="w-full rounded-xl border border-[#164953] bg-[#07242b] px-3 py-2 pr-16 text-xs font-semibold text-white outline-none focus:border-[#3fd0a8]/50"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-[#8ba7ab]">
                  USDC
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#8ba7ab]">
                Descripción / Concepto
              </label>
              <input
                type="text"
                placeholder="ej. Insumos electrónicos y repuestos"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full rounded-xl border border-[#164953] bg-[#07242b] px-3 py-2 text-xs text-white outline-none focus:border-[#3fd0a8]/50"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#8ba7ab]">
                Archivo de Factura (PDF / XML)
              </label>
              <div className="flex items-center gap-2">
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#164953] bg-[#07242b] px-3 py-3 text-xs text-[#8ba7ab] hover:border-[#3fd0a8]/50 hover:text-white transition">
                  <span>📄 {nombreArchivo || "Seleccionar comprobante..."}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setNombreArchivo(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
                {nombreArchivo && (
                  <span className="rounded-full bg-[#0f3d37] px-2 py-1 text-xs font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                    Hash listo
                  </span>
                )}
              </div>
              <p className="mt-1 text-[10px] text-[#6f9095]">
                El hash criptográfico de este archivo quedará grabado en la red Solana como evidencia inmutable.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#164953] pt-4">
              <button
                type="button"
                onClick={() => setModalNuevaFacturaAbierto(false)}
                className="rounded-xl px-4 py-2 text-xs font-medium text-[#8ba7ab] hover:bg-[#07242b] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#3fd0a8] px-5 py-2 text-xs font-bold text-[#08262c] shadow-xs hover:brightness-105"
              >
                Cargar Factura
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 py-2">
            <div className="rounded-2xl border-2 border-dashed border-[#164953] bg-[#07242b] p-6 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a2c34] text-[#3fd0a8]">
                📁
              </div>
              <p className="text-xs font-semibold text-white">
                Arrastrá un archivo CSV de facturas
              </p>
              <p className="mt-1 text-[10px] text-[#6f9095]">
                Columnas requeridas: <code>numeroOC, proveedorId, montoUSDC, descripcion</code>
              </p>
              <label className="mt-4 inline-block cursor-pointer rounded-xl border border-[#164953] bg-[#0a2c34] px-4 py-2 text-xs font-medium text-white hover:border-[#3fd0a8]/50">
                Examinar archivos
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={() => cargarDemoCSV()}
                />
              </label>
            </div>

            <div className="rounded-2xl bg-[#07242b] p-4 text-xs border border-[#164953]/70">
              <p className="font-semibold text-white">¿Querés probar rápido para la demo?</p>
              <p className="mt-1 text-[#8ba7ab]">
                Podés importar un lote de prueba de 3 facturas con 1 solo click:
              </p>
              <button
                type="button"
                onClick={cargarDemoCSV}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3fd0a8] py-2.5 font-bold text-[#08262c] hover:brightness-105"
              >
                ⚡ Cargar 3 Facturas Demo desde CSV
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalNuevaFacturaAbierto(false)}
                className="rounded-xl px-4 py-2 text-xs font-medium text-[#8ba7ab] hover:bg-[#07242b]"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
