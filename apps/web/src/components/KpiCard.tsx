import { Kpi } from "@/lib/types";

export default function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-2xl border border-[#164953] bg-[#0a2c34] p-4 shadow-sm">
      <p className="text-[11px] text-[#8ba7ab]">{kpi.titulo}</p>
      <p className="mt-1 text-2xl font-bold text-white">{kpi.valor}</p>
      <p className={`mt-1 text-xs font-semibold ${kpi.positiva ? "text-[#3fd0a8]" : "text-[#ef4444]"}`}>
        {kpi.positiva ? "↗" : "↘"} {kpi.variacion}
      </p>
    </div>
  );
}
