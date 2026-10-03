"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ItemPago } from "@/lib/types";
import {
  KPIS_PAGOS,
  METODOS_PAGO_STATS,
  PROXIMOS_VENCIMIENTOS,
  ULTIMOS_PAGOS,
} from "@/lib/mock";
import Sparkline from "@/components/Sparkline";

export default function PagosView() {
  const { pagos, registrarNuevoPago, setTab, notificar } = useApp();

  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroProveedor, setFiltroProveedor] = useState("Todos");
  const [filtroMetodo, setFiltroMetodo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  // Estado del form inferior "Registrar pago"
  const [metodoSeleccionado, setMetodoSeleccionado] = useState("Transferencia bancaria");
  const [fechaPago, setFechaPago] = useState("28/06/2025");
  const [procesando, setProcesando] = useState(false);

  // Filtrado de pagos
  const pagosFiltrados = pagos.filter((p) => {
    if (filtroEstado !== "Todos") {
      if (filtroEstado === "Pagado" && p.estado !== "pagado") return false;
      if (filtroEstado === "Pendiente" && p.estado !== "pendiente") return false;
      if (filtroEstado === "Vencido" && p.estado !== "vencido") return false;
    }
    if (filtroProveedor !== "Todos" && p.proveedorNombre !== filtroProveedor) return false;
    if (filtroMetodo !== "Todos" && p.metodoPago !== filtroMetodo) return false;
    if (busqueda.trim() !== "") {
      const q = busqueda.toLowerCase();
      return (
        p.proveedorNombre.toLowerCase().includes(q) ||
        p.facturaRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmarPago = () => {
    setProcesando(true);
    setTimeout(() => {
      registrarNuevoPago({
        fecha: fechaPago,
        proveedorNombre: "Petróleo S.A.",
        proveedorIniciales: "PS",
        colorAvatar: "bg-cyan-500/20 text-cyan-400",
        facturaRef: "F-0003-00456789",
        monto: 4320000,
        moneda: "ARS",
        metodoPago: metodoSeleccionado as any,
        estado: "pagado",
      });
      setProcesando(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. TÍTULO Y FECHA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Pagos</h1>
          <p className="text-xs text-[#8ba7ab] mt-0.5">
            Gestioná tus pagos, vencimientos y conciliaciones
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
        {/* Card 1: Total a pagar */}
        <div className="flex items-center justify-between rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#113a43] text-[#3fd0a8] border border-[#1d5b68]/40">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="2" y1="10" x2="22" y2="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-white">$ 12.480.000</p>
              <p className="text-[11px] text-[#8ba7ab]">Total a pagar</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#3fd0a8]">↑ 12%</span>
            <div className="mt-1">
              <Sparkline data={[10, 11, 10.5, 12, 12.48]} color="#3fd0a8" width={65} height={20} />
            </div>
          </div>
        </div>

        {/* Card 2: Pagos realizados */}
        <div className="flex items-center justify-between rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#113a43] text-[#3fd0a8] border border-[#1d5b68]/40">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-white">$ 8.930.000</p>
              <p className="text-[11px] text-[#8ba7ab]">Pagos realizados</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#3fd0a8]">↑ 18%</span>
            <div className="mt-1">
              <Sparkline data={[6.5, 7.2, 7.8, 8.5, 8.93]} color="#3fd0a8" width={65} height={20} />
            </div>
          </div>
        </div>

        {/* Card 3: Pendientes */}
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
              <p className="text-[11px] text-[#8ba7ab]">Pendientes</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#f59e0b]">↓ 5%</span>
            <div className="mt-1">
              <Sparkline data={[3.8, 3.6, 3.5, 3.3, 3.24]} color="#f59e0b" width={65} height={20} />
            </div>
          </div>
        </div>

        {/* Card 4: En mora */}
        <div className="flex items-center justify-between rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#113a43] text-[#ef4444] border border-[#1d5b68]/40">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-white">$ 840.000</p>
              <p className="text-[11px] text-[#8ba7ab]">En mora</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#ef4444]">↓ 2%</span>
            <div className="mt-1">
              <Sparkline data={[1.1, 0.95, 0.9, 0.86, 0.84]} color="#ef4444" width={65} height={20} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. FILTROS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#8ba7ab]">Estado:</span>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="rounded-xl border border-[#164953] bg-[#0a2c34] px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-[#3fd0a8]/50"
            >
              <option value="Todos">Todos</option>
              <option value="Pagado">Pagado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Vencido">Vencido</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8ba7ab]">Proveedor:</span>
            <select
              value={filtroProveedor}
              onChange={(e) => setFiltroProveedor(e.target.value)}
              className="rounded-xl border border-[#164953] bg-[#0a2c34] px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-[#3fd0a8]/50"
            >
              <option value="Todos">Todos</option>
              {Array.from(new Set(pagos.map((p) => p.proveedorNombre))).map((nombre) => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8ba7ab]">Método de pago:</span>
            <select
              value={filtroMetodo}
              onChange={(e) => setFiltroMetodo(e.target.value)}
              className="rounded-xl border border-[#164953] bg-[#0a2c34] px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-[#3fd0a8]/50"
            >
              <option value="Todos">Todos</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Mercado Pago">Mercado Pago</option>
              <option value="USDC/Cripto">USDC / Cripto</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, factura o referencia..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-56 sm:w-64 rounded-xl border border-[#164953] bg-[#0a2c34] px-3 py-1.5 text-xs text-white placeholder-[#6f9095] outline-none focus:border-[#3fd0a8]/50"
            />
          </div>
          <button
            onClick={() => notificar("Exportando historial de pagos...")}
            className="flex items-center gap-1.5 rounded-xl border border-[#164953] bg-[#0a2c34] px-3 py-1.5 text-xs text-white hover:border-[#3fd0a8]/50 transition"
          >
            <span>⬇</span> Exportar
          </button>
        </div>
      </div>

      {/* 4. TABLA DE PAGOS (8 cols) + COLUMNA RESUMEN DERECHA (4 cols) */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Tabla (8 cols) */}
        <div className="xl:col-span-8 rounded-2xl border border-[#164953] bg-[#0a2c34] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#164953] bg-[#07242b] text-[11px] text-[#8ba7ab]">
                <tr>
                  <th className="py-3 px-3.5">Fecha de pago</th>
                  <th className="py-3 px-3.5">Proveedor</th>
                  <th className="py-3 px-3.5">Factura / Ref.</th>
                  <th className="py-3 px-3.5">Monto</th>
                  <th className="py-3 px-3.5">Método de pago</th>
                  <th className="py-3 px-3.5">Estado</th>
                  <th className="py-3 px-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#133d47]/70">
                {pagosFiltrados.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#0c313a] text-white/90 transition-colors"
                  >
                    {/* Fecha de pago con banderita */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="flex h-3 w-4.5 rounded-xs overflow-hidden border border-white/20">
                          <span className="h-full w-1/3 bg-sky-300" />
                          <span className="h-full w-1/3 bg-white" />
                          <span className="h-full w-1/3 bg-sky-300" />
                        </span>
                        <span className="font-mono text-[11px] text-white/90">{p.fecha}</span>
                      </div>
                    </td>

                    {/* Proveedor con Avatar redondo */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                            p.colorAvatar || "bg-cyan-500/20 text-cyan-400"
                          }`}
                        >
                          {p.proveedorIniciales}
                        </div>
                        <span className="font-semibold text-white">{p.proveedorNombre}</span>
                      </div>
                    </td>

                    {/* Factura / Ref. */}
                    <td className="py-3.5 px-3.5 font-mono text-[11px] text-[#8ba7ab] whitespace-nowrap">
                      {p.facturaRef}
                    </td>

                    {/* Monto */}
                    <td className="py-3.5 px-3.5 font-mono font-semibold text-white whitespace-nowrap">
                      ${p.monto.toLocaleString("es-AR")}
                    </td>

                    {/* Método de pago */}
                    <td className="py-3.5 px-3.5 text-[11px] text-[#8ba7ab] whitespace-nowrap">
                      {p.metodoPago}
                    </td>

                    {/* Estado badge */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      {p.estado === "pagado" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#0f3d37] px-2.5 py-0.5 text-[10px] font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                          <span>✔</span> Pagado
                        </span>
                      )}
                      {p.estado === "pendiente" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#3d2f0f] px-2.5 py-0.5 text-[10px] font-bold text-[#f59e0b] border border-[#f59e0b]/30">
                          <span>🕒</span> Pendiente
                        </span>
                      )}
                      {p.estado === "vencido" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#3d1414] px-2.5 py-0.5 text-[10px] font-bold text-[#ef4444] border border-[#ef4444]/30">
                          <span>▲</span> Vencido
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-2 text-center text-[#8ba7ab] hover:text-white">
                      <button className="p-1 hover:bg-[#113a43] rounded">•••</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Columna Derecha de Resúmenes (4 cols) */}
        <div className="xl:col-span-4 space-y-4">
          {/* Card 1: Resumen de pagos */}
          <div className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#164953] pb-2">
              <span className="font-semibold text-white">Resumen de pagos</span>
              <button
                onClick={() => setTab("reportes")}
                className="text-[11px] font-semibold text-[#3fd0a8] hover:underline"
              >
                Ver detalle →
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[#8ba7ab]">
                <span className="flex items-center gap-1.5">💳 Total pagado</span>
                <span className="font-bold text-white">
                  $ 8.930.000 <span className="text-[#3fd0a8] text-[10px]">↑ 18%</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-[#8ba7ab]">
                <span className="flex items-center gap-1.5 text-[#f59e0b]">🕒 Pendiente</span>
                <span className="font-bold text-white">
                  $ 3.240.000 <span className="text-[#f59e0b] text-[10px]">↓ 5%</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-[#8ba7ab]">
                <span className="flex items-center gap-1.5 text-[#ef4444]">▲ En mora</span>
                <span className="font-bold text-white">
                  $ 840.000 <span className="text-[#ef4444] text-[10px]">↓ 2%</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Próximos vencimientos */}
          <div className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#164953] pb-2">
              <span className="font-semibold text-white">Próximos vencimientos</span>
              <button
                onClick={() => setTab("proveedores")}
                className="text-[11px] font-semibold text-[#3fd0a8] hover:underline"
              >
                Ver todos →
              </button>
            </div>

            <div className="space-y-2.5">
              {PROXIMOS_VENCIMIENTOS.map((v, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${v.color}`}>
                      {v.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white leading-tight">{v.proveedor}</p>
                      <p className="font-mono text-[9px] text-[#6f9095]">{v.ref}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-white">{v.monto}</p>
                    <p className="text-[9px] text-[#8ba7ab]">{v.fecha}</p>
                  </div>
                  <div>
                    {v.estado === "Pendiente" && (
                      <span className="rounded-full bg-[#3d2f0f] px-2 py-0.5 text-[9px] font-bold text-[#f59e0b] border border-[#f59e0b]/30">
                        Pendiente
                      </span>
                    )}
                    {v.estado === "Vencido" && (
                      <span className="rounded-full bg-[#3d1414] px-2 py-0.5 text-[9px] font-bold text-[#ef4444] border border-[#ef4444]/30">
                        Vencido
                      </span>
                    )}
                    {v.estado === "Próximo" && (
                      <span className="rounded-full bg-[#0f2d3d] px-2 py-0.5 text-[9px] font-bold text-[#38bdf8] border border-[#38bdf8]/30">
                        Próximo
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Métodos de pago (Progress Bars) */}
          <div className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm text-xs space-y-3">
            <span className="font-semibold text-white">Métodos de pago</span>
            <div className="space-y-2.5">
              {METODOS_PAGO_STATS.map((m) => (
                <div key={m.nombre} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8ba7ab]">{m.nombre}</span>
                    <span className="font-bold text-white">{m.porcentaje}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#07242b] overflow-hidden">
                    <div
                      className="h-full bg-[#3fd0a8] rounded-full"
                      style={{ width: `${m.porcentaje}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Últimos pagos */}
          <div className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#164953] pb-2">
              <span className="font-semibold text-white">Últimos pagos</span>
              <button
                onClick={() => setTab("blockchain")}
                className="text-[11px] font-semibold text-[#3fd0a8] hover:underline"
              >
                Ver todos →
              </button>
            </div>

            <div className="space-y-2">
              {ULTIMOS_PAGOS.map((u, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-[9px] font-bold">
                      {u.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white leading-tight">{u.proveedor}</p>
                      <p className="text-[9px] text-[#6f9095]">{u.fecha}</p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-white">{u.monto}</span>
                  <span className="rounded-full bg-[#0f3d37] px-2 py-0.5 text-[9px] font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                    Pagado
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. SECCIÓN INFERIOR: REGISTRAR PAGO (IA + MULTISIG / SOLANA) */}
      <div className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#113a43] text-[#3fd0a8] border border-[#3fd0a8]/40 shrink-0">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="2" y1="10" x2="22" y2="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Registrar pago</h2>
            <p className="text-xs text-[#8ba7ab]">
              Subí la factura o cargá los datos manualmente para procesar el pago.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Columna 1: Subir factura (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between rounded-2xl border-2 border-dashed border-[#164953] bg-[#07242b] p-6 text-center">
            <div className="my-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a2c34] text-[#3fd0a8] mb-3">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-white">Subir factura</p>
              <p className="text-[10px] text-[#6f9095] mt-1">Sacá una foto o subí un archivo (PDF, JPG, PNG)</p>
            </div>

            <button
              onClick={() => notificar("Seleccionando comprobante...")}
              className="mt-4 w-full rounded-xl bg-[#3fd0a8] py-2 text-xs font-bold text-[#08262c] shadow-xs hover:brightness-105 transition"
            >
              Seleccionar archivo
            </button>
          </div>

          {/* Columna 2: Datos extraídos por IA (OCR + IA) (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-[#07242b] p-4 border border-[#164953]/70 space-y-3">
            <div className="flex items-center justify-between border-b border-[#164953] pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Datos extraídos por IA</span>
                <span className="rounded-md bg-[#0f3d37] px-2 py-0.5 text-[9px] font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                  OCR + IA
                </span>
              </div>
              <span className="text-[#8ba7ab] cursor-pointer hover:text-white">✕</span>
            </div>

            <div className="flex gap-4 items-center">
              {/* Mini factura thumbnail */}
              <div className="w-24 shrink-0 rounded-lg bg-white p-2 text-slate-800 font-mono text-[7px] shadow-sm">
                <div className="font-bold border-b pb-1 mb-1">PETROLEO S.A.</div>
                <div className="h-1 bg-slate-200 rounded w-full mb-1" />
                <div className="h-1 bg-slate-200 rounded w-3/4 mb-1" />
                <div className="font-bold pt-1 border-t text-[8px]">$ 4.320.000</div>
              </div>

              {/* Campos extraídos */}
              <div className="flex-1 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8ba7ab]">Proveedor</span>
                  <span className="font-semibold text-white">Petróleo S.A.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ba7ab]">CUIT</span>
                  <span className="font-mono text-white">30-71234567-8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ba7ab]">Factura</span>
                  <span className="font-mono text-white">F-0003-00456789</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ba7ab]">Fecha</span>
                  <span className="text-white">12/06/2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ba7ab]">Monto</span>
                  <span className="font-mono font-bold text-[#3fd0a8]">$ 4.320.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ba7ab]">Vencimiento</span>
                  <span className="text-white">22/06/2025</span>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0f3d37] px-2.5 py-0.5 text-[10px] font-bold text-[#3fd0a8] border border-[#3fd0a8]/30">
                <span>✔</span> Datos verificados
              </span>
            </div>
          </div>

          {/* Columna 3: Confirmar y pagar (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-[#07242b] p-4 border border-[#164953]/70 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0f3d37] text-[#3fd0a8] text-xs">
                  ✓
                </span>
                <span className="text-xs font-bold text-white">Confirmar y pagar</span>
              </div>
              <p className="text-[11px] text-[#8ba7ab]">Revisá los datos y confirmá el pago.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-[#8ba7ab] block mb-1">Método de pago</label>
                <select
                  value={metodoSeleccionado}
                  onChange={(e) => setMetodoSeleccionado(e.target.value)}
                  className="w-full rounded-xl border border-[#164953] bg-[#0a2c34] px-3 py-2 text-xs text-white outline-none cursor-pointer focus:border-[#3fd0a8]/50"
                >
                  <option value="Transferencia bancaria">Transferencia bancaria</option>
                  <option value="USDC / Solana devnet">USDC (Solana Devnet · Squads 2/3)</option>
                  <option value="Mercado Pago">Mercado Pago</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#8ba7ab] block mb-1">Fecha de pago</label>
                <div className="flex items-center justify-between rounded-xl border border-[#164953] bg-[#0a2c34] px-3 py-2 text-xs text-white">
                  <span>{fechaPago}</span>
                  <span className="text-[#8ba7ab]">📅</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmarPago}
              disabled={procesando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3fd0a8] py-3 text-xs font-bold text-[#08262c] shadow-xs hover:brightness-105 transition cursor-pointer"
            >
              {procesando ? (
                <>
                  <span className="animate-spin">⚙</span> Procesando...
                </>
              ) : (
                <>
                  <span>🚀</span> Confirmar pago
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
