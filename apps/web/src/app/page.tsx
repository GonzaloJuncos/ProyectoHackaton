"use client";

import BarChart from "@/components/BarChart";
import KpiCard from "@/components/KpiCard";
import { BILLETERA, KPIS_MOCK, PAGOS_POR_MES, PROVEEDORES_MOCK, TXS_MOCK } from "@/lib/mock";

const inicial = (nombre: string) =>
  nombre.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function Panel() {
  const provPorId = (id: string) => PROVEEDORES_MOCK.find((p) => p.id === id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tinta">Panel de control</h1>
          <p className="text-sm text-tinta/60">
            Gestiona tus proveedores y pagos en USDC, de forma segura y transparente.
          </p>
        </div>
        <button className="rounded-lg border bg-white px-3 py-2 text-sm text-tinta/70">
          Últimos 30 días ▾
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS_MOCK.map((k) => <KpiCard key={k.titulo} kpi={k} />)}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Columna principal */}
        <div className="space-y-6 xl:col-span-2">
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-tinta">Pagos en USDC</h2>
              <a href="#" className="text-xs font-medium text-petroleo">Ver detalles →</a>
            </div>
            <BarChart datos={PAGOS_POR_MES} />
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-tinta">Últimas transacciones</h2>
                <a href="/conciliacion" className="text-xs font-medium text-petroleo">Ver todas →</a>
              </div>
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-tinta/40">
                  <tr><th className="pb-2">Fecha</th><th className="pb-2">Proveedor</th><th className="pb-2">Monto</th><th className="pb-2">Estado</th></tr>
                </thead>
                <tbody>
                  {TXS_MOCK.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="py-2 text-xs text-tinta/60">{t.fecha}</td>
                      <td className="py-2 font-medium">{provPorId(t.proveedorId)?.nombre}</td>
                      <td className="py-2">{t.montoUSDC.toLocaleString("es-AR")}</td>
                      <td className="py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.estado === "completada" ? "bg-menta/20 text-petroleo" : "bg-amber-100 text-amber-700"}`}>
                          {t.estado === "completada" ? "Completado" : "En proceso"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-tinta">Proveedores recientes</h2>
                <a href="/proveedores" className="text-xs font-medium text-petroleo">Ver todos →</a>
              </div>
              <ul className="space-y-3">
                {PROVEEDORES_MOCK.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-menta/25 text-xs font-bold text-petroleo">
                      {inicial(p.nombre)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.nombre}</p>
                      <p className="text-xs text-tinta/60">{p.pagos} pagos · ${p.totalUSDC.toLocaleString("es-AR")}</p>
                    </div>
                    <span className="rounded-full bg-menta/20 px-2 py-0.5 text-xs font-medium text-petroleo">Activo</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Billetera */}
        <section className="h-fit rounded-xl bg-oscuro p-5 text-white shadow-sm">
          <h2 className="mb-4 font-semibold">Tu billetera USDC</h2>
          <p className="text-3xl font-bold">${BILLETERA.balanceUSDC.toLocaleString("es-AR")}.00</p>
          <p className="text-sm text-white/50">USDC</p>
          <button className="mt-4 w-full rounded-lg bg-menta py-2.5 text-sm font-semibold text-oscuro hover:brightness-110">
            Enviar pago
          </button>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button className="rounded-lg border border-white/20 py-2 text-sm font-medium hover:bg-white/10">Recibir</button>
            <button className="rounded-lg border border-white/20 py-2 text-sm font-medium hover:bg-white/10">Historial</button>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm">
            <span className="text-white/50">Red</span>
            <span className="flex items-center gap-1 font-medium">
              <span className="h-2 w-2 rounded-full bg-menta" /> {BILLETERA.red}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
