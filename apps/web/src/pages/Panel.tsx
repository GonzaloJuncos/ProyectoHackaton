import { useEffect, useState } from "react";
import { api } from "../api";

interface Conciliacion {
  resumen: {
    totalFacturas: number;
    enAprobacion: number;
    aprobadas: number;
    pagadas: number;
    conProblemas: number;
    totalPagadoUsdc: number;
  };
  pagos: {
    id: string;
    montoUsdc: number;
    destinoWallet: string;
    txSignature: string | null;
    estado: string;
    createdAt: string;
    factura: { numero: string; hashSha256: string; proveedor: { nombre: string; pais: string } };
  }[];
}

export default function Panel() {
  const [data, setData] = useState<Conciliacion | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Conciliacion>("/conciliacion").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">Cargando…</p>;

  const r = data.resumen;
  const cards = [
    { label: "Facturas", valor: r.totalFacturas },
    { label: "Pendientes / en aprobación", valor: r.enAprobacion },
    { label: "Aprobadas sin pagar", valor: r.aprobadas },
    { label: "Pagadas", valor: r.pagadas },
    { label: "Con problemas", valor: r.conProblemas },
    { label: "USDC pagados", valor: r.totalPagadoUsdc.toLocaleString() },
  ];

  return (
    <div>
      <h2>Conciliación</h2>
      <div className="cards">
        {cards.map((c) => (
          <div key={c.label} className="card stat">
            <span className="muted small">{c.label}</span>
            <strong>{c.valor}</strong>
          </div>
        ))}
      </div>

      <h3>Pagos ejecutados</h3>
      <table>
        <thead>
          <tr>
            <th>Factura</th><th>Proveedor</th><th>Monto</th><th>Destino</th>
            <th>Hash factura</th><th>Tx on-chain</th><th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {data.pagos.map((p) => (
            <tr key={p.id}>
              <td>{p.factura.numero}</td>
              <td>{p.factura.proveedor.nombre} <span className="muted">({p.factura.proveedor.pais})</span></td>
              <td>{p.montoUsdc.toLocaleString()} USDC</td>
              <td><code title={p.destinoWallet}>{p.destinoWallet.slice(0, 8)}…</code></td>
              <td><code title={p.factura.hashSha256}>{p.factura.hashSha256.slice(0, 8)}…</code></td>
              <td>
                {p.txSignature ? (
                  <a className="link" href={`https://explorer.solana.com/tx/${p.txSignature}?cluster=devnet`} target="_blank" rel="noreferrer">
                    {p.txSignature.slice(0, 8)}…
                  </a>
                ) : "—"}
              </td>
              <td className="muted">{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
          {data.pagos.length === 0 && (
            <tr><td colSpan={7} className="muted">Todavía no hay pagos ejecutados.</td></tr>
          )}
        </tbody>
      </table>
      <p className="muted small">Cada pago incluye el hash de la factura en un memo on-chain: la evidencia que enlaza factura ↔ transacción es verificable en el explorer.</p>
    </div>
  );
}
