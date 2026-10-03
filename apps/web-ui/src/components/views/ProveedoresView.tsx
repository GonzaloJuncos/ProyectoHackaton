"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Proveedor } from "@/lib/types";
import { KPIS_PROVEEDORES } from "@/lib/mock";
import Sparkline from "@/components/Sparkline";

// Provincias con colores de badges / banderas
const PROVINCIA_FLAGS: Record<string, { bg: string; text: string }> = {
  "Buenos Aires": { bg: "bg-sky-500/20", text: "text-sky-400" },
  "Córdoba": { bg: "bg-rose-500/20", text: "text-rose-400" },
  "Santa Fe": { bg: "bg-red-500/20", text: "text-red-400" },
  "Mendoza": { bg: "bg-amber-500/20", text: "text-amber-400" },
};

export default function ProveedoresView() {
  const {
    proveedores,
    proveedorSeleccionado,
    setProveedorSeleccionado,
    setTab,
    notificar,
  } = useApp();

  const [filtroProvincia, setFiltroProvincia] = useState("Todas");
  const [filtroEmpresa, setFiltroEmpresa] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [panelLateralAbierto, setPanelLateralAbierto] = useState(true);

  // Estado del OCR
  const [ocrPaso, setOcrPaso] = useState<number>(3); // 3 = Datos detectados
  const [ocrConfirmado, setOcrConfirmado] = useState(false);

  // Filtrado de la tabla
  const proveedoresFiltrados = proveedores.filter((p) => {
    if (filtroProvincia !== "Todas" && p.provincia !== filtroProvincia) return false;
    if (filtroEmpresa !== "Todas" && p.nombre !== filtroEmpresa) return false;
    if (filtroEstado !== "Todos") {
      if (filtroEstado === "Al día" && p.estadoPago !== "al_dia") return false;
      if (filtroEstado === "Pendiente" && p.estadoPago !== "pendiente") return false;
      if (filtroEstado === "Vencido" && p.estadoPago !== "vencido") return false;
      if (filtroEstado === "En revisión" && p.estadoPago !== "en_revision") return false;
    }
    return true;
  });

  const limpiarFiltros = () => {
    setFiltroProvincia("Todas");
    setFiltroEmpresa("Todas");
    setFiltroEstado("Todos");
  };

  const prov = proveedorSeleccionado || proveedores[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. TÍTULO Y RANGO DE FECHAS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Proveedores</h1>
          <p className="text-xs text-[#8ba7ab] mt-0.5">
            Gestioná proveedores, facturas y estados de pago
          </p>
        </div>

        {/* Date Filter selector */}
        <button className="flex items-center gap-2 rounded-xl border border-[#164953] bg-[#0a2c34] px-3 py-1.5 text-xs text-[#8ba7ab] shadow-xs hover:border-[#3fd0a8]/40 transition">
          <svg className="h-3.5 w-3.5 text-[#3fd0a8]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white font-medium">01/06/2025 - 30/06/2025</span>
          <span className="text-[10px]">▾</span>
        </button>
      </div>

      {/* 2. KPI CARDS CON SPARKLINES */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Proveedores activos */}
        <div className="flex items-center justify-between rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#113a43] text-[#3fd0a8] border border-[#1d5b68]/40">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-white">24</p>
              <p className="text-[11px] text-[#8ba7ab]">Proveedores activos</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#3fd0a8]">↑ 2%</span>
            <div className="mt-1">
              <Sparkline data={[18, 20, 22, 21, 23, 22, 24]} color="#3fd0a8" width={65} height={20} />
            </div>
          </div>
        </div>

        {/* Card 2: Pagado */}
        <div className="flex items-center justify-between rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#113a43] text-[#3fd0a8] border border-[#1d5b68]/40">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="2" y1="10" x2="22" y2="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-white">$ 18.450.000</p>
              <p className="text-[11px] text-[#8ba7ab]">Pagado</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#3fd0a8]">↑ 12%</span>
            <div className="mt-1">
              <Sparkline data={[14, 15, 16, 17, 17.5, 18.45]} color="#3fd0a8" width={65} height={20} />
            </div>
          </div>
        </div>

        {/* Card 3: Pendiente */}
        <div className="flex items-center justify-between rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#113a43] text-[#f59e0b] border border-[#1d5b68]/40">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="12 7 12 12 15 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-white">$ 3.240.000</p>
              <p className="text-[11px] text-[#8ba7ab]">Pendiente</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#f59e0b]">↑ 5%</span>
            <div className="mt-1">
              <Sparkline data={[2.9, 3.1, 3.0, 3.15, 3.24]} color="#f59e0b" width={65} height={20} />
            </div>
          </div>
        </div>

        {/* Card 4: Facturas por revisar */}
        <div className="flex items-center justify-between rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#113a43] text-[#3fd0a8] border border-[#1d5b68]/40">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-white">12</p>
              <p className="text-[11px] text-[#8ba7ab]">Facturas por revisar</p>
            </div>
          </div>
          <div className="text-right">
            <div className="mt-4">
              <Sparkline data={[10, 14, 11, 13, 12]} color="#3fd0a8" width={65} height={20} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. FILTROS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#8ba7ab]">Provincia:</span>
            <select
              value={filtroProvincia}
              onChange={(e) => setFiltroProvincia(e.target.value)}
              className="rounded-xl border border-[#164953] bg-[#0a2c34] px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-[#3fd0a8]/50"
            >
              <option value="Todas">Todas</option>
              <option value="Buenos Aires">Buenos Aires</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Santa Fe">Santa Fe</option>
              <option value="Mendoza">Mendoza</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8ba7ab]">Empresa:</span>
            <select
              value={filtroEmpresa}
              onChange={(e) => setFiltroEmpresa(e.target.value)}
              className="rounded-xl border border-[#164953] bg-[#0a2c34] px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-[#3fd0a8]/50"
            >
              <option value="Todas">Todas</option>
              {Array.from(new Set(proveedores.map((p) => p.nombre))).map((nombre) => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8ba7ab]">Estado de pago:</span>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="rounded-xl border border-[#164953] bg-[#0a2c34] px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-[#3fd0a8]/50"
            >
              <option value="Todos">Todos</option>
              <option value="Al día">Al día</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Vencido">Vencido</option>
              <option value="En revisión">En revisión</option>
            </select>
          </div>
        </div>

        <button
          onClick={limpiarFiltros}
          className="flex items-center gap-1.5 text-xs text-[#8ba7ab] hover:text-[#3fd0a8] transition"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Limpiar filtros</span>
        </button>
      </div>

      {/* 4. TABLA PRINCIPAL + PANEL LATERAL (PROVEEDOR SELECCIONADO) */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Tabla (8 cols si panel abierto, 12 cols si cerrado) */}
        <div className={`${panelLateralAbierto ? "xl:col-span-8" : "xl:col-span-12"} rounded-2xl border border-[#164953] bg-[#0a2c34] shadow-sm overflow-hidden transition-all duration-200`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#164953] bg-[#07242b] text-[11px] text-[#8ba7ab]">
                <tr>
                  <th className="py-3 px-3.5">Provincia</th>
                  <th className="py-3 px-3.5">Empresa / Proveedor</th>
                  <th className="py-3 px-3.5">CUIT</th>
                  <th className="py-3 px-2 text-center">Facturas</th>
                  <th className="py-3 px-3.5">Total facturado</th>
                  <th className="py-3 px-3.5">Deuda / saldo pendiente</th>
                  <th className="py-3 px-3.5">Próximo vencimiento</th>
                  <th className="py-3 px-3.5">Estado de pago</th>
                  <th className="py-3 px-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#133d47]/70">
                {proveedoresFiltrados.map((p) => {
                  const seleccionado = prov?.id === p.id;
                  const provInfo = PROVINCIA_FLAGS[p.provincia || "Buenos Aires"] || { bg: "bg-sky-500/20", text: "text-sky-400" };

                  return (
                    <tr
                      key={p.id}
                      onClick={() => {
                        setProveedorSeleccionado(p);
                        setPanelLateralAbierto(true);
                      }}
                      className={`cursor-pointer transition-colors ${
                        seleccionado
                          ? "bg-[#0d3b44] text-white"
                          : "hover:bg-[#0c313a] text-white/90"
                      }`}
                    >
                      {/* Provincia */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="flex h-3 w-4.5 rounded-xs overflow-hidden border border-white/20">
                            <span className="h-full w-1/3 bg-sky-300" />
                            <span className="h-full w-1/3 bg-white" />
                            <span className="h-full w-1/3 bg-sky-300" />
                          </span>
                          <span className="text-[11px] text-[#8ba7ab]">{p.provincia || "Buenos Aires"}</span>
                        </div>
                      </td>

                      {/* Empresa / Proveedor */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className="font-semibold text-white">{p.nombre}</div>
                        <div className="text-[10px] text-[#6f9095]">{p.rubro || "Insumos y servicios"}</div>
                      </td>

                      {/* CUIT */}
                      <td className="py-3.5 px-3.5 font-mono text-[11px] text-[#8ba7ab] whitespace-nowrap">
                        {p.cuit || "30-71234567-8"}
                      </td>

                      {/* Facturas */}
                      <td className="py-3.5 px-2 text-center font-semibold text-white whitespace-nowrap">
                        {p.facturasCount || p.pagos}
                      </td>

                      {/* Total facturado */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className="font-semibold text-white">
                          ${(p.totalFacturado || p.totalUSDC * 1000).toLocaleString("es-AR")}
                        </div>
                        <div className="text-[9px] text-[#6f9095] uppercase">{p.moneda || "ARS"}</div>
                      </td>

                      {/* Deuda / saldo pendiente */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className={`font-semibold ${p.deudaPendiente && p.deudaPendiente > 0 ? "text-white" : "text-[#6f9095]"}`}>
                          ${(p.deudaPendiente || 0).toLocaleString("es-AR")}
                        </div>
                        <div className="text-[9px] text-[#6f9095] uppercase">{p.moneda || "ARS"}</div>
                      </td>

                      {/* Próximo vencimiento */}
                      <td className="py-3.5 px-3.5 text-[11px] text-[#8ba7ab] whitespace-nowrap">
                        {p.proximoVencimiento || "22/06/2025"}
                      </td>

                      {/* Estado de pago badge */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        {p.estadoPago === "al_dia" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#0f3d37] px-2.5 py-0.5 text-[10px] font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                            <span>●</span> Al día
                          </span>
                        )}
                        {p.estadoPago === "pendiente" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#3d2f0f] px-2.5 py-0.5 text-[10px] font-bold text-[#f59e0b] border border-[#f59e0b]/30">
                            <span>🕒</span> Pendiente
                          </span>
                        )}
                        {p.estadoPago === "vencido" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#3d1414] px-2.5 py-0.5 text-[10px] font-bold text-[#ef4444] border border-[#ef4444]/30">
                            <span>▲</span> Vencido
                          </span>
                        )}
                        {p.estadoPago === "en_revision" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#0f2d3d] px-2.5 py-0.5 text-[10px] font-bold text-[#38bdf8] border border-[#38bdf8]/30">
                            <span>📄</span> En revisión
                          </span>
                        )}
                        {!p.estadoPago && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#0f3d37] px-2.5 py-0.5 text-[10px] font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                            <span>●</span> Al día
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-2 text-center text-[#8ba7ab] hover:text-white">
                        <button className="p-1 hover:bg-[#113a43] rounded">•••</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel lateral: Proveedor Seleccionado (4 cols) */}
        {panelLateralAbierto && prov && (
          <div className="xl:col-span-4 rounded-2xl border border-[#164953] bg-[#0a2c34] p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-right-3 duration-200">
            {/* Header del panel */}
            <div className="flex items-center justify-between border-b border-[#164953] pb-3">
              <span className="text-xs font-semibold text-[#8ba7ab]">Proveedor seleccionado</span>
              <button
                onClick={() => setPanelLateralAbierto(false)}
                className="text-[#8ba7ab] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Avatar y Datos del Proveedor */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#113a43] text-sm font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                  {prov.nombre.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">{prov.nombre}</h3>
                  <p className="text-[11px] text-[#8ba7ab]">{prov.rubro || "Combustibles y lubricantes"}</p>
                </div>
              </div>

              <span className="rounded-full bg-[#0f3d37] px-2.5 py-0.5 text-[10px] font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                Al día
              </span>
            </div>

            {/* Datos de contacto */}
            <div className="rounded-xl bg-[#07242b] p-3 text-xs space-y-2 border border-[#164953]/70">
              <div className="flex items-center gap-2 text-[#8ba7ab]">
                <span className="text-sm">🏛</span>
                <span>Provincia:</span>
                <span className="text-white font-medium">{prov.provincia || "Buenos Aires"}</span>
              </div>
              <div className="flex items-center gap-2 text-[#8ba7ab]">
                <span className="text-sm">💳</span>
                <span>CUIT:</span>
                <span className="font-mono text-white">{prov.cuit || "30-71234567-8"}</span>
              </div>
              <div className="flex items-start gap-2 text-[#8ba7ab]">
                <span className="text-sm">👤</span>
                <div>
                  <p className="text-white">{prov.email || "ventas@petroleo.com.ar"}</p>
                  <p className="text-[11px] text-[#6f9095]">{prov.telefono || "+54 11 4321-9876"}</p>
                </div>
              </div>
            </div>

            {/* Resumen financiero */}
            <div className="space-y-2 text-xs">
              <p className="font-semibold text-white">Resumen financiero</p>
              <div className="space-y-1.5 rounded-xl bg-[#07242b] p-3 border border-[#164953]/70">
                <div className="flex justify-between items-center text-[#8ba7ab]">
                  <span className="flex items-center gap-1.5">📄 Total facturado</span>
                  <span className="font-bold text-white">
                    ${(prov.totalFacturado || 4320000).toLocaleString("es-AR")} ARS
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#8ba7ab]">
                  <span className="flex items-center gap-1.5 text-[#3fd0a8]">💳 Pagado</span>
                  <span className="font-bold text-[#3fd0a8]">
                    ${(prov.totalFacturado ? prov.totalFacturado - (prov.deudaPendiente || 0) : 3480000).toLocaleString("es-AR")} ARS
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#8ba7ab]">
                  <span className="flex items-center gap-1.5 text-[#f59e0b]">🕒 Deuda / pendiente</span>
                  <span className="font-bold text-[#f59e0b]">
                    ${(prov.deudaPendiente || 840000).toLocaleString("es-AR")} ARS
                  </span>
                </div>
              </div>
            </div>

            {/* Facturas vinculadas */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#8ba7ab]">
                <span>📄 Facturas</span>
                <span className="font-bold text-white text-sm">{prov.facturasCount || 8}</span>
              </div>
              <button
                onClick={() => setTab("pagos")}
                className="text-xs font-semibold text-[#3fd0a8] hover:underline"
              >
                Ver todas →
              </button>
            </div>

            {/* Historial de pagos */}
            <div className="space-y-2 text-xs">
              <p className="font-semibold text-white">Historial de pagos</p>
              <div className="space-y-1.5">
                {(prov.historialPagos || [
                  { fecha: "12/06/2025", monto: 1200000, estado: "Pagado" },
                  { fecha: "05/06/2025", monto: 980000, estado: "Pagado" },
                  { fecha: "28/05/2025", monto: 760000, estado: "Pagado" },
                  { fecha: "15/05/2025", monto: 540000, estado: "Pagado" },
                ]).map((h, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-[#07242b] px-3 py-2 border border-[#164953]/60">
                    <div className="flex items-center gap-2 text-[11px] text-[#8ba7ab]">
                      <span>📅</span>
                      <span>{h.fecha}</span>
                    </div>
                    <span className="font-mono font-semibold text-white text-[11px]">
                      ${h.monto.toLocaleString("es-AR")}
                    </span>
                    <span className="rounded-full bg-[#0f3d37] px-2 py-0.5 text-[9px] font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                      {h.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setTab("pagos")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3fd0a8] py-2.5 text-xs font-bold text-[#08262c] shadow-xs hover:brightness-105 transition"
              >
                <span>📄</span> Ver facturas
              </button>
              <button
                onClick={() => {
                  setTab("pagos");
                  notificar("Seleccioná la factura a liquidar.");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#164953] bg-[#07242b] py-2.5 text-xs font-semibold text-white hover:border-[#3fd0a8]/50 transition"
              >
                <span>💳</span> Registrar pago
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. SECCIÓN INFERIOR: ESCANEAR FACTURA (IA + OCR) */}
      <div className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#113a43] text-[#3fd0a8] border border-[#3fd0a8]/40 shrink-0">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Escanear factura</h2>
            <p className="text-xs text-[#8ba7ab]">
              La IA de Logis lee la factura, extrae la información y la convierte en datos estructurados.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Columna 1: Upload Box + Stepper (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#164953] bg-[#07242b] p-6 text-center hover:border-[#3fd0a8]/50 transition cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a2c34] text-[#3fd0a8] mb-3">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-white">Sacá una foto o subí la factura</p>
              <p className="text-[10px] text-[#6f9095] mt-1">Formatos: JPG, PNG, PDF | Máx. 10 MB</p>
            </div>

            {/* Stepper visual */}
            <div className="flex items-center justify-between text-[10px] text-[#8ba7ab] px-1">
              <div className="flex flex-col items-center gap-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3fd0a8] text-[#08262c] font-bold text-[10px]">
                  ✓
                </span>
                <span>Captura</span>
              </div>
              <div className="h-0.5 flex-1 bg-[#3fd0a8] -mt-3 mx-1" />
              <div className="flex flex-col items-center gap-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3fd0a8] text-[#08262c] font-bold text-[10px]">
                  ✓
                </span>
                <span>Escaneo OCR</span>
              </div>
              <div className="h-0.5 flex-1 bg-[#3fd0a8] -mt-3 mx-1" />
              <div className="flex flex-col items-center gap-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3fd0a8] text-[#08262c] font-bold text-[10px]">
                  ✓
                </span>
                <span className="text-[#3fd0a8] font-bold">Datos detectados</span>
              </div>
              <div className="h-0.5 flex-1 bg-[#164953] -mt-3 mx-1" />
              <div className="flex flex-col items-center gap-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#164953] bg-[#07242b] text-[#6f9095] text-[10px]">
                  ○
                </span>
                <span>Confirmar</span>
              </div>
            </div>
          </div>

          {/* Columna 2: Thumbnail Factura Procesada (3 cols) */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[200px] rounded-xl border border-white/20 bg-white p-3 text-slate-800 shadow-md">
              <div className="border-b border-slate-300 pb-2 mb-2 flex justify-between items-center text-[8px] font-mono">
                <div>
                  <p className="font-bold text-slate-900">PETROLEO S.A.</p>
                  <p className="text-slate-500">CUIT: 30-71234567-8</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">FACTURA B</p>
                  <p className="text-slate-500">N° 0003-00456789</p>
                </div>
              </div>
              <div className="space-y-1 text-[7px] text-slate-600 font-mono">
                <div className="h-1 bg-slate-200 rounded w-full" />
                <div className="h-1 bg-slate-200 rounded w-3/4" />
                <div className="h-1 bg-slate-200 rounded w-5/6" />
                <div className="h-1 bg-slate-200 rounded w-1/2" />
              </div>
              <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between items-end">
                <div className="h-6 w-6 bg-slate-300 rounded" />
                <div className="text-right text-[8px] font-bold text-slate-900">
                  <p className="text-[6px] text-slate-500">TOTAL</p>
                  $ 4.319.602,08
                </div>
              </div>

              {/* Badge Procesada con OCR */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0f3d37] px-2.5 py-0.5 text-[9px] font-bold text-[#3fd0a8] border border-[#3fd0a8]/40 shadow-xs">
                ✓ Procesada con OCR
              </div>
            </div>
          </div>

          {/* Columna 3: Datos extraídos de la factura (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white">Datos extraídos de la factura</h3>
              <span className="rounded-full bg-[#0f3d37] px-2 py-0.5 text-[10px] font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                Datos detectados
              </span>
            </div>

            <div className="space-y-1.5 rounded-xl bg-[#07242b] p-3 text-xs border border-[#164953]/70">
              <div className="flex justify-between py-1 border-b border-[#133d47]/50">
                <span className="text-[#8ba7ab]">Número de factura</span>
                <span className="font-mono font-semibold text-white">B - 0003-00456789</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#133d47]/50">
                <span className="text-[#8ba7ab]">Fecha</span>
                <span className="text-white">12/06/2025</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#133d47]/50">
                <span className="text-[#8ba7ab]">CUIT</span>
                <span className="font-mono text-white">30-71234567-8</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#133d47]/50">
                <span className="text-[#8ba7ab]">Proveedor</span>
                <span className="font-semibold text-white">Petróleo S.A.</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#133d47]/50">
                <span className="text-[#8ba7ab]">Subtotal</span>
                <span className="font-mono text-white">$ 3.570.248,00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#133d47]/50">
                <span className="text-[#8ba7ab]">IVA (21%)</span>
                <span className="font-mono text-white">$ 749.354,08</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#133d47]/50">
                <span className="text-white font-bold">Total</span>
                <span className="font-mono font-bold text-[#3fd0a8]">$ 4.319.602,08</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8ba7ab]">Vencimiento</span>
                <span className="text-white">22/06/2025</span>
              </div>
            </div>

            {/* Botones de confirmación y nota informativa */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setOcrConfirmado(true);
                    notificar("Factura B-0003-00456789 confirmada y guardada en el sistema.");
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#3fd0a8] py-2.5 text-xs font-bold text-[#08262c] shadow-xs hover:brightness-105 transition"
                >
                  <span>✓</span> Confirmar y guardar
                </button>
                <button
                  onClick={() => notificar("Modo edición de campos OCR habilitado.")}
                  className="flex items-center gap-1.5 rounded-xl border border-[#164953] bg-[#07242b] px-4 py-2.5 text-xs font-semibold text-white hover:border-[#3fd0a8]/50 transition"
                >
                  <span>✎</span> Editar datos
                </button>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-[#07242b]/60 p-2.5 text-[10px] text-[#8ba7ab] border border-[#164953]/50">
                <span className="text-[#3fd0a8] text-xs">ℹ</span>
                <span>
                  El sistema de Logis utiliza OCR para leer facturas y convertirlas en datos estructurados de forma automática y segura.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
