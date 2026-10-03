import { Kpi } from "@/lib/types";

export default function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{kpi.titulo}</p>
      <p className="mt-1 text-2xl font-bold">{kpi.valor}</p>
      <p className={`mt-1 text-xs font-medium ${kpi.positiva ? "text-emerald-600" : "text-red-600"}`}>
        {kpi.positiva ? "↗" : "↘"} {kpi.variacion}
      </p>
    </div>
  );
}
