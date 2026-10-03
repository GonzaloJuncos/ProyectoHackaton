interface Punto {
  mes: string;
  valor: number;
}

export default function BarChart({ datos }: { datos: Punto[] }) {
  const max = Math.max(...datos.map((d) => d.valor));
  return (
    <div className="flex h-40 items-end gap-3 pt-4">
      {datos.map((d) => (
        <div key={d.mes} className="flex flex-1 flex-col items-center gap-1.5 group">
          <div
            className="w-full rounded-t-lg bg-[#1b6b5e] transition-all duration-200 group-hover:bg-[#3fd0a8] shadow-xs"
            style={{ height: `${Math.round((d.valor / max) * 100)}%`, minHeight: "8px" }}
            title={`$${d.valor.toLocaleString("es-AR")} USDC`}
          />
          <span className="text-[11px] text-[#8ba7ab] group-hover:text-white transition">
            {d.mes}
          </span>
        </div>
      ))}
    </div>
  );
}
