import { useEffect, useState } from "react";
import { api } from "../api";

interface AuditEntry {
  id: string;
  entidad: string;
  entidadId: string;
  accion: string;
  txSignature: string | null;
  createdAt: string;
  actor: { nombre: string; rol: string } | null;
}

export default function Historial() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<AuditEntry[]>("/audit-log").then(setLogs).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Historial auditable</h2>
      <table>
        <thead>
          <tr><th>Fecha</th><th>Acción</th><th>Entidad</th><th>Actor</th><th>Tx</th></tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id}>
              <td className="muted">{new Date(l.createdAt).toLocaleString()}</td>
              <td><span className="estado estado-cargada">{l.accion}</span></td>
              <td>{l.entidad} <code className="muted" title={l.entidadId}>{l.entidadId.slice(0, 8)}…</code></td>
              <td>{l.actor ? `${l.actor.nombre} (${l.actor.rol.toLowerCase()})` : "sistema"}</td>
              <td>
                {l.txSignature ? (
                  <a className="link" href={`https://explorer.solana.com/tx/${l.txSignature}?cluster=devnet`} target="_blank" rel="noreferrer">
                    {l.txSignature.slice(0, 8)}…
                  </a>
                ) : "—"}
              </td>
            </tr>
          ))}
          {logs.length === 0 && <tr><td colSpan={5} className="muted">Sin eventos todavía.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
