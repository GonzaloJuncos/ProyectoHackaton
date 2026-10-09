import { useEffect, useState } from "react";
import { api } from "../api";

interface AuditEntry {
  id: string;
  entidad: string;
  entidadId: string;
  accion: string;
  detalle: Record<string, unknown> | null;
  txSignature: string | null;
  createdAt: string;
  actor: { nombre: string; rol: string } | null;
}

const ACCION_LABEL: Record<string, string> = {
  cargada: "cargada",
  editada: "editada",
  wallet_vinculada: "wallet vinculada",
  multisig_creado: "multisig creado",
  propuesta_creada: "propuesta creada",
  firmada: "firmada",
  verificada: "verificada por agente",
  pagada: "pagada",
  rechazada: "rechazada",
};

const CHECK_LABEL: Record<string, string> = {
  ocCoincide: "coincide con OC",
  proveedorRegistrado: "proveedor activo",
  montoOk: "monto válido",
  sinDuplicados: "sin duplicados",
};

export default function Historial() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<AuditEntry[]>("/audit-log").then(setLogs).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;

  const detalleAgente = (l: AuditEntry) => {
    if (l.accion !== "verificada" || !l.detalle) return null;
    return (
      <div className="muted small">
        {Object.entries(l.detalle).map(([k, v]) => (
          <span key={k} className={v ? "check-ok" : "check-falla"} style={{ marginRight: "0.8rem" }}>
            {v ? "✓" : "✗"} {CHECK_LABEL[k] ?? k}
          </span>
        ))}
      </div>
    );
  };

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
              <td>
                <span className="estado estado-cargada">{ACCION_LABEL[l.accion] ?? l.accion}</span>
                {detalleAgente(l)}
              </td>
              <td>{l.entidad} <code className="muted" title={l.entidadId}>{l.entidadId.slice(0, 8)}…</code></td>
              <td>{l.actor ? `${l.actor.nombre} (${l.actor.rol.toLowerCase()})` : "agente"}</td>
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
