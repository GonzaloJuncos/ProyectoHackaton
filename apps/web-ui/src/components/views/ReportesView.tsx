"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function ReportesView() {
  const { notificar } = useApp();

  const [rangoFecha, setRangoFecha] = useState("01/06/2025 - 30/06/2025");
  const [subtab, setSubtab] = useState("resumen");
  const [modalProgramar, setModalProgramar] = useState(false);
  const [emailProgramado, setEmailProgramado] = useState("finanzas@logis.com");
  const [frecuencia, setFrecuencia] = useState("Semanal");

  const exportarExcel = () => {
    notificar("Exportando balance consolidado a Excel (.xlsx)...");
    setTimeout(() => notificar("Archivo Logis_Reporte_Junio2025.xlsx descargado."), 1000);
  };

  const exportarPdf = () => {
    notificar("Generando reporte de auditoría fiscal en PDF...");
    setTimeout(() => notificar("Archivo Logis_Auditoria_Devnet.pdf descargado."), 1000);
  };

  const copiarTx = (tx: string) => {
    navigator.clipboard?.writeText(tx);
    notificar(`Tx Signature ${tx} copiada al portapapeles.`);
  };

  const SUBTABS_REPORTES = [
    { id: "resumen", label: "Resumen general" },
    { id: "flujo", label: "Flujo de caja" },
    { id: "deuda", label: "Deuda pendiente" },
    { id: "gastos", label: "Gastos por proveedor" },
    { id: "blockchain", label: "Blockchain" },
    { id: "conciliacion", label: "Conciliación" },
    { id: "fiscal", label: "Fiscal e impuestos" },
  ];

  // Datos para gráfico de Flujo de Caja
  const FLUJO_MESES = [
    { mes: "Jun 2025", vencimientos: 5.5, pagos: 6.8, usdc: 3.2, banco: 4.8 },
    { mes: "Jul 2025", vencimientos: 6.2, pagos: 7.4, usdc: 3.8, banco: 5.1 },
    { mes: "Ago 2025", vencimientos: 4.8, pagos: 5.9, usdc: 2.9, banco: 4.2 },
    { mes: "Sep 2025", vencimientos: 7.1, pagos: 6.5, usdc: 4.1, banco: 4.9 },
    { mes: "Oct 2025", vencimientos: 3.9, pagos: 4.8, usdc: 2.2, banco: 3.6 },
    { mes: "Nov 2025", vencimientos: 5.8, pagos: 6.1, usdc: 3.5, banco: 4.4 },
  ];

  // Transacciones relevantes de la tabla
  const TRANSACCIONES_RELEVANTES = [
    {
      fecha: "12/06/2025 14:32",
      proveedor: "Petróleo S.A.",
      factura: "B - 0003-00456789",
      tipo: "Pago",
      monto: "1.200,00",
      moneda: "USDC",
      tx: "4f3Q...8kL2",
      txCompleta: "4f3Qr8jKm1nL9pRt2vW5xYz7aBc3dEf4gHj6kL2",
      tc: "$ 1.000,00",
      estado: "Confirmada",
    },
    {
      fecha: "10/06/2025 09:15",
      proveedor: "Menta SRL",
      factura: "B - 0002-00345678",
      tipo: "Pago",
      monto: "980,00",
      moneda: "USDC",
      tx: "7gh2...k9Lm",
      txCompleta: "7gh2kM5nL9pRt2vW5xYz7aBc3dEf4gHj6k9Lm",
      tc: "$ 1.000,00",
      estado: "Confirmada",
    },
    {
      fecha: "05/06/2025 16:48",
      proveedor: "Tinta Global",
      factura: "B - 0001-00543210",
      tipo: "Pago",
      monto: "760,00",
      moneda: "USDC",
      tx: "3nP9...dQ4Z",
      txCompleta: "3nP9dQ4ZaBc3dEf4gHj6kL24f3Qr8jKm1nL",
      tc: "$ 1.000,00",
      estado: "Confirmada",
    },
    {
      fecha: "28/05/2025 11:20",
      proveedor: "Fondo Oscuro",
      factura: "B - 0003-00123456",
      tipo: "Pago",
      monto: "540,00",
      moneda: "USDC",
      tx: "9mK4...pR7T",
      txCompleta: "9mK4LpR7TaBc3dEf4gHj6kL24f3Qr8jKm1nL",
      tc: "$ 1.000,00",
      estado: "Confirmada",
    },
    {
      fecha: "22/05/2025 13:05",
      proveedor: "Transporte Norte",
      factura: "B - 0002-00987654",
      tipo: "Pago",
      monto: "920,00",
      moneda: "USDC",
      tx: "2vL7...nM3X",
      txCompleta: "2vL7nM3XaBc3dEf4gHj6kL24f3Qr8jKm1nL",
      tc: "$ 1.000,00",
      estado: "Confirmada",
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans text-white">
      {/* ============================================================ */}
      {/* ENCABEZADO Y CONTROLES SUPERIORES */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Reportes</h1>
          <p className="text-sm text-[#8caab1]">
            Información financiera, fiscal y de blockchain en un solo lugar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Fecha */}
          <button
            onClick={() => notificar("Seleccioná el rango de fechas en el calendario.")}
            className="flex items-center gap-2 rounded-lg border border-[#164b54] bg-[#07252c] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0c3842] transition"
          >
            <svg className="h-4 w-4 text-[#3fd0a8]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{rangoFecha}</span>
            <svg className="h-3.5 w-3.5 text-[#8caab1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Filtros avanzados */}
          <button
            onClick={() => notificar("Filtros avanzados desplegados.")}
            className="flex items-center gap-1.5 rounded-lg border border-[#164b54] bg-[#07252c] px-3 py-1.5 text-xs font-medium text-[#3fd0a8] hover:bg-[#0c3842] transition"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filtros avanzados</span>
          </button>

          {/* Excel */}
          <button
            onClick={exportarExcel}
            className="flex items-center gap-1.5 rounded-lg border border-[#164b54] bg-[#07252c] px-2.5 py-1.5 text-xs font-medium text-[#8caab1] hover:text-white hover:bg-[#0c3842] transition"
          >
            <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Excel</span>
          </button>

          {/* PDF */}
          <button
            onClick={exportarPdf}
            className="flex items-center gap-1.5 rounded-lg border border-[#164b54] bg-[#07252c] px-2.5 py-1.5 text-xs font-medium text-[#8caab1] hover:text-white hover:bg-[#0c3842] transition"
          >
            <svg className="h-3.5 w-3.5 text-rose-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>PDF</span>
          </button>

          {/* Programar envío */}
          <button
            onClick={() => setModalProgramar(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#164b54] bg-[#07252c] px-2.5 py-1.5 text-xs font-medium text-[#8caab1] hover:text-white hover:bg-[#0c3842] transition"
          >
            <svg className="h-3.5 w-3.5 text-[#3fd0a8]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Programar envío</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5 CARDS DE MÉTRICAS (KPIs SUPERIORES) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* KPI 1 */}
        <div className="relative overflow-hidden rounded-xl border border-[#164b54] bg-[#07242b] p-4 shadow-md">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-semibold text-[#8caab1]">Total facturado</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00e0b7]/15 text-[#00e0b7]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-4a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-white tracking-tight">$ 18.450.000</div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px]">
            <span className="font-semibold text-emerald-400">↑ 12%</span>
            <span className="text-[#8caab1]">vs. periodo anterior</span>
          </div>
          {/* Sparkline mini */}
          <div className="mt-2 h-4 w-full">
            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path d="M0 15 Q25 5, 50 12 T100 3" fill="none" stroke="#00e0b7" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="relative overflow-hidden rounded-xl border border-[#164b54] bg-[#07242b] p-4 shadow-md">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-semibold text-[#8caab1]">Total pagado</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-white tracking-tight">$ 14.980.000</div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px]">
            <span className="font-semibold text-emerald-400">↑ 8%</span>
            <span className="text-[#8caab1]">vs. periodo anterior</span>
          </div>
          {/* Sparkline mini */}
          <div className="mt-2 h-4 w-full">
            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path d="M0 18 Q30 10, 60 14 T100 6" fill="none" stroke="#06b6d4" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="relative overflow-hidden rounded-xl border border-[#164b54] bg-[#07242b] p-4 shadow-md">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-semibold text-[#8caab1]">Pagos en USDC (Solana)</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-white tracking-tight">42%</div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px]">
            <span className="font-semibold text-emerald-400">↑ 15%</span>
            <span className="text-[#8caab1] font-mono">$ 6.291.000 USDC</span>
          </div>
          {/* Sparkline mini */}
          <div className="mt-2 h-4 w-full">
            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path d="M0 16 Q35 14, 70 8 T100 2" fill="none" stroke="#f59e0b" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="relative overflow-hidden rounded-xl border border-[#164b54] bg-[#07242b] p-4 shadow-md">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-semibold text-[#8caab1]">Ahorro en comisiones</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-white tracking-tight">$ 320.000</div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px]">
            <span className="font-semibold text-emerald-400">↑ 28%</span>
            <span className="text-[#8caab1]">estimado</span>
          </div>
          {/* Sparkline mini */}
          <div className="mt-2 h-4 w-full">
            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path d="M0 17 Q25 15, 60 9 T100 3" fill="none" stroke="#10b981" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="relative overflow-hidden rounded-xl border border-[#164b54] bg-[#07242b] p-4 shadow-md">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-semibold text-[#8caab1]">Días promedio de pago (DPO)</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/15 text-amber-300">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-white tracking-tight">28 días</div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px]">
            <span className="font-semibold text-emerald-400">↓ 17%</span>
            <span className="text-[#8caab1]">6 días menos</span>
          </div>
          {/* Sparkline mini */}
          <div className="mt-2 h-4 w-full">
            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path d="M0 5 Q30 9, 65 14 T100 18" fill="none" stroke="#fbbf24" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BARRA DE SUBTABS */}
      {/* ============================================================ */}
      <div className="flex gap-2 overflow-x-auto border-b border-[#164b54] pb-2 scrollbar-none">
        {SUBTABS_REPORTES.map((t) => {
          const activo = subtab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSubtab(t.id)}
              className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                activo
                  ? "bg-[#0b5563] text-[#3fd0a8] shadow-sm font-semibold border border-[#3fd0a8]/30"
                  : "bg-[#07252c] text-[#8caab1] hover:bg-[#0c3842] hover:text-white border border-[#164b54]/50"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* FILA 1 DE REPORTES: FLUJO DE CAJA, PAGOS POR MONEDA Y GASTOS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Card A: Flujo de caja (vencimientos vs. liquidez) - 6 cols */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Flujo de caja (vencimientos vs. liquidez)</h2>
              </div>
              <button
                onClick={() => notificar("Abriendo detalle de flujo de caja...")}
                className="text-xs font-medium text-[#3fd0a8] hover:underline"
              >
                Ver detalle →
              </button>
            </div>

            {/* Leyenda */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#8caab1]">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#2563eb]" />
                <span>Vencimientos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#00e0b7]" />
                <span>Pagos realizados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#8b5cf6]" />
                <span>Liquidez USDC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#06b6d4]" />
                <span>Liquidez bancaria</span>
              </div>
            </div>

            {/* Gráfico de Barras SVG Agrupadas */}
            <div className="mt-6 flex h-48 items-end gap-3 pt-4">
              {/* Eje Y */}
              <div className="flex h-full flex-col justify-between pb-6 text-[9px] font-mono text-[#8caab1]">
                <span>8M</span>
                <span>6M</span>
                <span>4M</span>
                <span>2M</span>
                <span>0</span>
              </div>

              {/* Contenedor de Barras por Mes */}
              <div className="flex h-full flex-1 items-end justify-between border-b border-[#164b54] pb-2">
                {FLUJO_MESES.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="flex items-end gap-1">
                      {/* Vencimientos */}
                      <div
                        className="w-2.5 rounded-t-xs bg-[#2563eb] transition-all hover:brightness-125"
                        style={{ height: `${(item.vencimientos / 8) * 130}px` }}
                        title={`Vencimientos: $${item.vencimientos}M`}
                      />
                      {/* Pagos realizados */}
                      <div
                        className="w-2.5 rounded-t-xs bg-[#00e0b7] transition-all hover:brightness-125"
                        style={{ height: `${(item.pagos / 8) * 130}px` }}
                        title={`Pagos: $${item.pagos}M`}
                      />
                      {/* Liquidez USDC */}
                      <div
                        className="w-2.5 rounded-t-xs bg-[#8b5cf6] transition-all hover:brightness-125"
                        style={{ height: `${(item.usdc / 8) * 130}px` }}
                        title={`USDC: $${item.usdc}M`}
                      />
                      {/* Liquidez bancaria */}
                      <div
                        className="w-2.5 rounded-t-xs bg-[#06b6d4] transition-all hover:brightness-125"
                        style={{ height: `${(item.banco / 8) * 130}px` }}
                        title={`Banco: $${item.banco}M`}
                      />
                    </div>
                    <span className="text-[10px] text-[#8caab1]">{item.mes}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card B: Pagos por moneda - 3 cols */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg lg:col-span-3 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white mb-3">Pagos por moneda</h2>

            {/* Donut Chart SVG con Centro Informativo */}
            <div className="relative mx-auto my-2 flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Fondo círculo */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0e353f" strokeWidth="12" />
                {/* USDC: 42% -> 42 * 2.387 = 100.2 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#00e0b7"
                  strokeWidth="12"
                  strokeDasharray="100.2 238.7"
                  strokeDashoffset="0"
                />
                {/* ARS: 38% -> 38 * 2.387 = 90.7 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#0284c7"
                  strokeWidth="12"
                  strokeDasharray="90.7 238.7"
                  strokeDashoffset="-100.2"
                />
                {/* USD: 15% -> 15 * 2.387 = 35.8 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="12"
                  strokeDasharray="35.8 238.7"
                  strokeDashoffset="-190.9"
                />
                {/* Otros: 5% -> 5 * 2.387 = 11.9 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#64748b"
                  strokeWidth="12"
                  strokeDasharray="11.9 238.7"
                  strokeDashoffset="-226.7"
                />
              </svg>
              {/* Texto en el centro del Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-white tracking-tight">$ 14.980.000</span>
                <span className="text-[9px] text-[#8caab1]">Total pagado</span>
              </div>
            </div>

            {/* Leyenda con valores */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#00e0b7]" />
                  <span className="text-[11px] text-[#8caab1]">USDC (Solana)</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">42%</span>
                  <span className="ml-1 text-[10px] text-[#8caab1] font-mono">$ 6.291.000</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0284c7]" />
                  <span className="text-[11px] text-[#8caab1]">ARS (Transferencia)</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">38%</span>
                  <span className="ml-1 text-[10px] text-[#8caab1] font-mono">$ 5.692.000</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                  <span className="text-[11px] text-[#8caab1]">USD (Banco)</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">15%</span>
                  <span className="ml-1 text-[10px] text-[#8caab1] font-mono">$ 2.247.000</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#64748b]" />
                  <span className="text-[11px] text-[#8caab1]">Otros</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">5%</span>
                  <span className="ml-1 text-[10px] text-[#8caab1] font-mono">$ 750.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card C: Gastos por categoría - 3 cols */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg lg:col-span-3 flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Gastos por categoría</h2>
              <button
                onClick={() => notificar("Desplegando lista completa de categorías...")}
                className="text-xs font-medium text-[#3fd0a8] hover:underline"
              >
                Ver todas →
              </button>
            </div>

            <div className="space-y-3">
              {[
                { nombre: "Combustibles y lubricantes", pct: 28, monto: "$ 5.166.000", icon: "⛽" },
                { nombre: "Insumos industriales", pct: 18, monto: "$ 3.321.000", icon: "⚙️" },
                { nombre: "Logística y distribución", pct: 16, monto: "$ 2.952.000", icon: "🚚" },
                { nombre: "Servicios de diseño", pct: 12, monto: "$ 2.214.000", icon: "🎨" },
                { nombre: "Impresión y papelería", pct: 10, monto: "$ 1.845.000", icon: "📄" },
                { nombre: "Otros", pct: 16, monto: "$ 2.952.000", icon: "📦" },
              ].map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="truncate text-white font-medium flex items-center gap-1.5">
                      <span>{cat.icon}</span>
                      <span>{cat.nombre}</span>
                    </span>
                    <span className="font-mono text-[#8caab1] font-semibold">{cat.monto}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-[#0a2e36] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#00e0b7]"
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#8caab1] w-7 text-right">{cat.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FILA 2 DE REPORTES: DEUDA PENDIENTE, TOP 5 Y ESTADO FACTURAS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Card D: Deuda pendiente por vencer - 4 cols */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg lg:col-span-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white mb-3">Deuda pendiente por vencer</h2>

            <div className="flex items-center gap-2 text-[10px] text-[#8caab1] mb-4">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#00e0b7]" /> 0 - 30 días</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#eab308]" /> 31 - 60 días</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#f97316]" /> 61 - 90 días</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#ef4444]" /> + 90 días</span>
            </div>

            {/* 4 Barras / Cubos de Vencimiento */}
            <div className="flex h-36 items-end justify-between gap-3 border-b border-[#164b54] pb-2">
              <div className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] font-mono font-bold text-white">$ 2.840.000</span>
                <div className="w-full rounded-t-md bg-[#00e0b7]" style={{ height: "100px" }} />
                <span className="text-[9px] text-[#8caab1] text-center">0 - 30 días</span>
              </div>

              <div className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] font-mono font-bold text-white">$ 1.920.000</span>
                <div className="w-full rounded-t-md bg-[#eab308]" style={{ height: "68px" }} />
                <span className="text-[9px] text-[#8caab1] text-center">31 - 60 días</span>
              </div>

              <div className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] font-mono font-bold text-white">$ 1.280.000</span>
                <div className="w-full rounded-t-md bg-[#f97316]" style={{ height: "45px" }} />
                <span className="text-[9px] text-[#8caab1] text-center">61 - 90 días</span>
              </div>

              <div className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] font-mono font-bold text-white">$ 840.000</span>
                <div className="w-full rounded-t-md bg-[#ef4444]" style={{ height: "30px" }} />
                <span className="text-[9px] text-[#8caab1] text-center">+ 90 días</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card E: Top 5 proveedores por gasto - 4 cols */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Top 5 proveedores por gasto</h2>
              <button
                onClick={() => notificar("Desplegando ranking de proveedores...")}
                className="text-xs font-medium text-[#3fd0a8] hover:underline"
              >
                Ver todas →
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { pos: 1, nombre: "Petróleo S.A.", monto: "$ 5.166.000", pct: 28, logo: "⛽" },
                { pos: 2, nombre: "Menta SRL", monto: "$ 3.321.000", pct: 18, logo: "🌿" },
                { pos: 3, nombre: "Tinta Global", monto: "$ 2.952.000", pct: 16, logo: "🖋️" },
                { pos: 4, nombre: "Fondo Oscuro", monto: "$ 2.214.000", pct: 12, logo: "☕" },
                { pos: 5, nombre: "Transporte Norte", monto: "$ 1.845.000", pct: 10, logo: "🚛" },
              ].map((p) => (
                <div key={p.pos} className="flex items-center gap-3 rounded-lg border border-[#164b54]/50 bg-[#0a2e36] p-2 text-xs">
                  <span className="font-mono text-xs font-bold text-[#8caab1] w-3">{p.pos}</span>
                  <span className="text-base">{p.logo}</span>
                  <div className="flex-1 truncate">
                    <div className="font-medium text-white">{p.nombre}</div>
                    <div className="h-1 w-full rounded-full bg-[#164b54] mt-1 overflow-hidden">
                      <div className="h-full bg-[#00e0b7]" style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold text-white">{p.monto}</div>
                    <div className="text-[10px] text-[#8caab1]">{p.pct}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card F: Estado de las facturas - 4 cols */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg lg:col-span-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white mb-3">Estado de las facturas</h2>

            {/* Donut Chart */}
            <div className="relative mx-auto my-2 flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0e353f" strokeWidth="12" />
                {/* Pagadas: 68% -> 162 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#00e0b7"
                  strokeWidth="12"
                  strokeDasharray="162 238.7"
                  strokeDashoffset="0"
                />
                {/* Pendientes: 21% -> 50 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#eab308"
                  strokeWidth="12"
                  strokeDasharray="50 238.7"
                  strokeDashoffset="-162"
                />
                {/* Vencidas: 7% -> 16.7 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="12"
                  strokeDasharray="16.7 238.7"
                  strokeDashoffset="-212"
                />
                {/* En revisión: 4% -> 9.5 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray="9.5 238.7"
                  strokeDashoffset="-228.7"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-white">85</span>
                <span className="text-[9px] text-[#8caab1]">Total de facturas</span>
              </div>
            </div>

            {/* Leyenda */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between rounded-lg border border-[#164b54]/50 bg-[#0a2e36] px-2.5 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#00e0b7]" />
                  <span className="text-[11px] text-[#8caab1]">Pagadas</span>
                </div>
                <span className="font-semibold text-white">58 (68%)</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#164b54]/50 bg-[#0a2e36] px-2.5 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#eab308]" />
                  <span className="text-[11px] text-[#8caab1]">Pendientes</span>
                </div>
                <span className="font-semibold text-white">18 (21%)</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#164b54]/50 bg-[#0a2e36] px-2.5 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                  <span className="text-[11px] text-[#8caab1]">Vencidas</span>
                </div>
                <span className="font-semibold text-white">6 (7%)</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#164b54]/50 bg-[#0a2e36] px-2.5 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                  <span className="text-[11px] text-[#8caab1]">En revisión</span>
                </div>
                <span className="font-semibold text-white">3 (4%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FILA 3: TABLA DE ÚLTIMAS TRANSACCIONES RELEVANTES */}
      {/* ============================================================ */}
      <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Últimas transacciones relevantes</h2>
          <button
            onClick={() => notificar("Abriendo ledger de transacciones on-chain...")}
            className="text-xs font-medium text-[#3fd0a8] hover:underline"
          >
            Ver historial completo →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#164b54] text-[10px] uppercase text-[#8caab1]">
                <th className="pb-2 font-semibold">Fecha</th>
                <th className="pb-2 font-semibold">Proveedor</th>
                <th className="pb-2 font-semibold">Factura</th>
                <th className="pb-2 font-semibold">Tipo</th>
                <th className="pb-2 font-semibold">Monto</th>
                <th className="pb-2 font-semibold">Moneda</th>
                <th className="pb-2 font-semibold">Tx Signature (Solana)</th>
                <th className="pb-2 font-semibold">Tipo de cambio (ARS)</th>
                <th className="pb-2 font-semibold">Estado</th>
                <th className="pb-2 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#164b54]/50">
              {TRANSACCIONES_RELEVANTES.map((tx, idx) => (
                <tr key={idx} className="hover:bg-[#0a2e36]/60 transition">
                  <td className="py-3 text-[11px] text-[#8caab1] font-mono">{tx.fecha}</td>
                  <td className="py-3 font-medium text-white">{tx.proveedor}</td>
                  <td className="py-3 font-mono text-[11px] text-[#8caab1]">{tx.factura}</td>
                  <td className="py-3">
                    <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-[#00e0b7]">
                      {tx.tipo}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-white">{tx.monto}</td>
                  <td className="py-3 text-[11px] text-[#8caab1] font-semibold">{tx.moneda}</td>
                  <td className="py-3 font-mono text-[11px] text-[#3fd0a8]">
                    <span className="flex items-center gap-1.5">
                      <span>{tx.tx}</span>
                      <button
                        onClick={() => copiarTx(tx.txCompleta)}
                        className="text-[#8caab1] hover:text-white"
                        title="Copiar firma de Solana"
                      >
                        📋
                      </button>
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[11px] text-[#8caab1]">{tx.tc}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {tx.estado}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2 text-[#8caab1]">
                      <a
                        href={`https://explorer.solana.com/tx/${tx.txCompleta}?cluster=devnet`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white"
                        title="Ver en Solana Explorer (Devnet)"
                      >
                        ↗
                      </a>
                      <button onClick={() => notificar(`Opciones de transacción ${tx.factura}`)} className="hover:text-white">
                        •••
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PROGRAMAR ENVÍO */}
      {modalProgramar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-[#164b54] bg-[#07252c] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Programar Envío de Reporte</h3>
            <p className="mt-1 text-xs text-[#8caab1]">
              Configurá la entrega automatizada de métricas financieras y ledger blockchain.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Correo de destino</label>
                <input
                  type="email"
                  value={emailProgramado}
                  onChange={(e) => setEmailProgramado(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-3 py-2 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Frecuencia de entrega</label>
                <select
                  value={frecuencia}
                  onChange={(e) => setFrecuencia(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-3 py-2 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                >
                  <option value="Diario">Diario (al cierre de operaciones)</option>
                  <option value="Semanal">Semanal (todos los lunes a las 09:00)</option>
                  <option value="Mensual">Mensual (primer día hábil del mes)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setModalProgramar(false)}
                className="rounded-lg border border-[#164b54] px-4 py-2 text-xs font-medium text-[#8caab1] hover:bg-[#0c3842]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setModalProgramar(false);
                  notificar(`Reporte programado con frecuencia ${frecuencia} para ${emailProgramado}.`);
                }}
                className="rounded-lg bg-[#00e0b7] px-4 py-2 text-xs font-semibold text-[#07242b] hover:brightness-110"
              >
                Confirmar programación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
