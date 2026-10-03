import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { Proveedor, OrdenCompra, LoteFacturasResultado, EstadoFactura } from "@logis/shared";
import { api } from "../api";

interface FacturaListada {
  id: string;
  numero: string;
  monto: number;
  moneda: string;
  estado: EstadoFactura;
  hashSha256: string;
  origen: string;
  proveedorNombre: string;
  ocNumero: string | null;
  firmasCount: number;
  createdAt: string;
}

const ESTADO_LABEL: Record<string, string> = {
  CARGADA: "cargada",
  EN_APROBACION: "en aprobación",
  APROBADA: "aprobada",
  VERIFICACION_FALLIDA: "verificación fallida",
  RECHAZADA: "rechazada",
  PAGADA: "pagada",
};

// Parsea CSV "numero,proveedor,monto[,oc_numero]" — una factura por línea.
const parseCsv = (texto: string) =>
  texto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.toLowerCase().startsWith("numero,"))
    .map((l) => {
      const [numero = "", proveedor = "", monto = "", ocNumero] = l.split(",").map((s) => s.trim());
      return { numero, proveedor, monto: Number(monto), ocNumero };
    });

export default function Facturas() {
  const [facturas, setFacturas] = useState<FacturaListada[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [ocs, setOcs] = useState<(OrdenCompra & { proveedor?: { nombre: string } })[]>([]);
  const [form, setForm] = useState({ proveedorId: "", ordenCompraId: "", numero: "", monto: "" });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [csvInfo, setCsvInfo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const cargar = async () => {
    const [f, p, o] = await Promise.all([
      api<FacturaListada[]>("/facturas"),
      api<Proveedor[]>("/proveedores"),
      api<(OrdenCompra & { proveedor?: { nombre: string } })[]>("/ordenes-compra"),
    ]);
    setFacturas(f);
    setProveedores(p);
    setOcs(o);
  };

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, []);

  const ocsDelProveedor = useMemo(
    () => ocs.filter((o) => o.proveedorId === form.proveedorId && o.estado === "ABIERTA"),
    [ocs, form.proveedorId]
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await api("/facturas", {
        method: "POST",
        body: JSON.stringify({
          proveedorId: form.proveedorId,
          ordenCompraId: form.ordenCompraId || undefined,
          numero: form.numero,
          monto: Number(form.monto),
        }),
      });
      setForm({ proveedorId: "", ordenCompraId: "", numero: "", monto: "" });
      setMostrarForm(false);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "error al cargar factura");
    } finally {
      setEnviando(false);
    }
  };

  const onCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setCsvInfo(null);
    const filas = parseCsv(await file.text());
    if (filas.length === 0) {
      setError("El CSV no tiene filas válidas. Formato: numero,proveedor,monto[,oc_numero]");
      return;
    }
    const res = await api<LoteFacturasResultado>("/facturas/lote", {
      method: "POST",
      body: JSON.stringify({ filas }),
    }).catch((err) => {
      setError(err.message);
      return null;
    });
    if (res) {
      setCsvInfo(
        `${res.creadas} factura(s) cargada(s)` +
          (res.errores.length
            ? ` · ${res.errores.length} error(es): ${res.errores.map((r) => `línea ${r.fila} (${r.motivo})`).join(", ")}`
            : "")
      );
      await cargar();
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <section>
      <header className="pagina-header">
        <h2>Facturas</h2>
        <div className="acciones">
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onCsv} hidden id="csv-input" />
          <button className="secundario" onClick={() => fileRef.current?.click()}>Importar CSV</button>
          <button onClick={() => setMostrarForm(!mostrarForm)}>
            {mostrarForm ? "Cancelar" : "+ Nueva factura"}
          </button>
        </div>
      </header>

      {mostrarForm && (
        <form onSubmit={onSubmit} className="card form-proveedor">
          <h3>Cargar factura</h3>
          <div className="grid-2">
            <label>
              Proveedor
              <select
                value={form.proveedorId}
                required
                onChange={(e) => setForm({ ...form, proveedorId: e.target.value, ordenCompraId: "" })}
              >
                <option value="">elegir…</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </label>
            <label>
              Orden de compra (opcional)
              <select
                value={form.ordenCompraId}
                onChange={(e) => setForm({ ...form, ordenCompraId: e.target.value })}
                disabled={!form.proveedorId}
              >
                <option value="">sin OC</option>
                {ocsDelProveedor.map((o) => (
                  <option key={o.id} value={o.id}>{o.numero} — ${o.monto}</option>
                ))}
              </select>
            </label>
            <label>
              Número de factura
              <input value={form.numero} required onChange={(e) => setForm({ ...form, numero: e.target.value })} />
            </label>
            <label>
              Monto (USD)
              <input type="number" min="0.01" step="0.01" value={form.monto} required
                onChange={(e) => setForm({ ...form, monto: e.target.value })} />
            </label>
          </div>
          <p className="muted small">La factura queda en estado "cargada" hasta que se cree la aprobación multisig.</p>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={enviando}>{enviando ? "Guardando…" : "Cargar factura"}</button>
        </form>
      )}

      {csvInfo && <p className="muted">{csvInfo}</p>}
      {error && !mostrarForm && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>N°</th>
            <th>Proveedor</th>
            <th>OC</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Firmas</th>
            <th>Hash</th>
            <th>Origen</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((f) => (
            <tr key={f.id}>
              <td>{f.numero}</td>
              <td>{f.proveedorNombre}</td>
              <td>{f.ocNumero ?? "—"}</td>
              <td>${f.monto.toLocaleString()}</td>
              <td><span className={`estado estado-${f.estado.toLowerCase()}`}>{ESTADO_LABEL[f.estado] ?? f.estado}</span></td>
              <td>{f.firmasCount}/2</td>
              <td><code title={f.hashSha256}>{f.hashSha256.slice(0, 8)}…</code></td>
              <td className="muted">{f.origen.toLowerCase()}</td>
            </tr>
          ))}
          {facturas.length === 0 && (
            <tr><td colSpan={8} className="muted">Todavía no hay facturas cargadas.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
