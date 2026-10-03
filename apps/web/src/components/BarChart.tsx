interface Punto {
  mes: string;
  valor: number;
}

export default function BarChart({ datos }: { datos: Punto[] }) {
  const max = Math.max(...datos.map((d) => d.valor));
  return (
    <div className="flex h-40 items-end gap-3">
      {datos.map((d) => (
        <div key={d.mes} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-emerald-400/80 transition hover:bg-emerald-500"
            style={{ height: `${Math.round((d.valor / max) * 100)}%`, minHeight: "4px" }}
            title={`$${d.valor.toLocaleString("es-AR")} USDC`}
          />
          <span className="text-xs text-gray-500">{d.mes}</span>
        </div>
      ))}
    </div>
  );
}
