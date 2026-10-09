import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { Proveedor, OrdenCompra, LoteFacturasResultado, EstadoFactura } from "@logis/shared";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { api, ApiError } from "../api";
import { useAuth } from "../auth";
import { client } from "../solana/client";
import { enviarInstrucciones, type IxSerializada } from "../solana/ix";

interface ChecksAgente {
  ocCoincide: boolean;
  proveedorRegistrado: boolean;
  montoOk: boolean;
  sinDuplicados: boolean;
}

interface Verificacion {
  id: string;
  resultado: string;
  checks: ChecksAgente;
  detalle: string | null;
  createdAt: string;
}

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
  propuesta?: { id: string; proposalIndex: number; firmas: { usuarioId: string }[] } | null;
  verificacion?: Verificacion | null;
  pago?: { txSignature: string | null } | null;
  createdAt: string;
}

const CHECK_LABEL: Record<keyof ChecksAgente, string> = {
  ocCoincide: "coincide con la orden de compra",
  proveedorRegistrado: "proveedor registrado y activo",
  montoOk: "monto válido",
  sinDuplicados: "sin duplicados",
};

interface EmpresaInfo {
  id: string;
  multisigAddress: string | null;
  firmantes: { id: string; nombre: string; rol: string; walletPubkey: string | null }[];
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
  const { usuario } = useAuth();
  const connected = useConnectedWallet(client);
  const [facturas, setFacturas] = useState<FacturaListada[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [ocs, setOcs] = useState<(OrdenCompra & { proveedor?: { nombre: string } })[]>([]);
  const [empresa, setEmpresa] = useState<EmpresaInfo | null>(null);
  const [form, setForm] = useState({ proveedorId: "", ordenCompraId: "", numero: "", monto: "" });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [ocupado, setOcupado] = useState<string | null>(null); // facturaId/acción en curso
  const [aviso, setAviso] = useState<string | null>(null);
  const [csvInfo, setCsvInfo] = useState<string | null>(null);
  const [agente, setAgente] = useState<{ numero: string; checks: ChecksAgente; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const cargar = async () => {
    const [f, p, o, e] = await Promise.all([
      api<FacturaListada[]>("/facturas"),
      api<Proveedor[]>("/proveedores"),
      api<(OrdenCompra & { proveedor?: { nombre: string } })[]>("/ordenes-compra"),
      api<EmpresaInfo>("/empresa"),
    ]);
    setFacturas(f);
    setProveedores(p);
    setOcs(o);
    setEmpresa(e);
  };

  useEffect(() => {
    cargar().catch((e) => setError(e.message));
  }, []);

  const miWallet = connected?.account.address ?? null;
  const esMiembro = Boolean(miWallet && empresa?.firmantes.some((f) => f.walletPubkey === miWallet));

  /** Pide instrucciones a la API, las firma con la wallet y confirma. */
  const ejecutar = async (clave: string, fn: () => Promise<void>) => {
    setOcupado(clave);
    setError(null);
    setAviso(null);
    try {
      await fn();
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "error en la operación");
    } finally {
      setOcupado(null);
    }
  };

  const crearMultisig = () =>
    ejecutar("multisig", async () => {
      const info = await api<{ multisigAddress: string; instrucciones: IxSerializada[] }>(
        "/empresa/multisig/crear-info", { method: "POST", body: "{}" });
      const sig = await enviarInstrucciones(client, info.instrucciones);
      await api("/empresa/multisig/confirmar", {
        method: "POST",
        body: JSON.stringify({ multisigAddress: info.multisigAddress, txSignature: sig }),
      });
      setAviso(`Multisig creado: ${info.multisigAddress.slice(0, 8)}…`);
    });

  const proponer = (f: FacturaListada) =>
    ejecutar(`prop-${f.id}`, async () => {
      const info = await api<{ transactionIndex: number; instrucciones: IxSerializada[] }>(
        `/facturas/${f.id}/propuesta-info`, { method: "POST", body: "{}" });
      const sig = await enviarInstrucciones(client, info.instrucciones);
      await api(`/facturas/${f.id}/propuesta-confirmar`, {
        method: "POST",
        body: JSON.stringify({ transactionIndex: info.transactionIndex, txSignature: sig }),
      });
      setAviso(`Propuesta creada para ${f.numero} — faltan 2 firmas`);
    });

  const aprobar = (f: FacturaListada) =>
    ejecutar(`apr-${f.id}`, async () => {
      const info = await api<{ instrucciones: IxSerializada[] }>(
        `/facturas/${f.id}/aprobar-info`, { method: "POST", body: "{}" });
      const sig = await enviarInstrucciones(client, info.instrucciones);
      const res = await api<{ onchain: { aprobada: boolean } }>(`/facturas/${f.id}/aprobar-confirmar`, {
        method: "POST",
        body: JSON.stringify({ txSignature: sig }),
      });
      setAviso(res.onchain.aprobada ? `${f.numero} alcanzó 2/3 — lista para ejecutar` : `Firma registrada en ${f.numero}`);
    });

  const ejecutarPago = (f: FacturaListada) =>
    ejecutar(`eje-${f.id}`, async () => {
      setAgente(null);
      let info: { instrucciones: IxSerializada[]; checks: ChecksAgente };
      try {
        info = await api(`/facturas/${f.id}/ejecutar-info`, { method: "POST", body: "{}" });
      } catch (err) {
        if (err instanceof ApiError && err.body.checks) {
          setAgente({ numero: f.numero, checks: err.body.checks as unknown as ChecksAgente, ok: false });
        }
        throw err;
      }
      // El agente aprobó: mostrar su checklist mientras la wallet firma la ejecución.
      setAgente({ numero: f.numero, checks: info.checks, ok: true });
      const sig = await enviarInstrucciones(client, info.instrucciones);
      await api(`/facturas/${f.id}/ejecutar-confirmar`, {
        method: "POST",
        body: JSON.stringify({ txSignature: sig }),
      });
      setAviso(`Pago ejecutado para ${f.numero} — tx ${sig.slice(0, 8)}…`);
    });

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
      <p className="muted small">Los pagos se ejecutan en <strong>USDC de prueba sobre devnet</strong>. El proveedor recibe USDC en su wallet y gestiona su propia conversión a moneda local.</p>
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
      {aviso && <p className="ok">{aviso}</p>}
      {error && !mostrarForm && <p className="error">{error}</p>}

      {agente && (
        <div className={`card agente-panel ${agente.ok ? "agente-ok" : "agente-falla"}`}>
          <h3>El agente verificó la factura {agente.numero}</h3>
          <ul className="agente-checks">
            {(Object.keys(CHECK_LABEL) as (keyof ChecksAgente)[]).map((k) => (
              <li key={k} className={agente.checks[k] ? "check-ok" : "check-falla"}>
                {agente.checks[k] ? "✓" : "✗"} {CHECK_LABEL[k]}
              </li>
            ))}
          </ul>
          <p className="muted small">
            {agente.ok
              ? "Verificación OK — firmá la ejecución del pago en tu wallet."
              : "Verificación rechazada — el pago NO se ejecuta. Revisá la factura."}
          </p>
        </div>
      )}

      {empresa && !empresa.multisigAddress && (
        <div className="card aviso-multisig">
          <strong>Multisig no configurado.</strong>{" "}
          {usuario?.rol === "ADMIN"
            ? esMiembro || miWallet
              ? "Creá el multisig 2/3 de la empresa con las wallets de admin/jefe/supervisor."
              : "Conectá tu Phantom primero — tu wallet queda como miembro firmante."
            : "Un administrador tiene que crear el multisig para habilitar aprobaciones."}
          {usuario?.rol === "ADMIN" && (
            <button onClick={crearMultisig} disabled={!miWallet || ocupado === "multisig"}>
              {ocupado === "multisig" ? "Creando…" : "Crear multisig 2/3"}
            </button>
          )}
        </div>
      )}
      {empresa?.multisigAddress && (
        <p className="muted small">
          Multisig: <code>{empresa.multisigAddress.slice(0, 12)}…</code> · umbral 2/{empresa.firmantes.filter((f) => f.walletPubkey).length || 3}
          {miWallet && !esMiembro && " · tu wallet no es miembro"}
        </p>
      )}

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
            <th>Agente</th>
            <th>Origen</th>
            <th></th>
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
              <td>
                {f.verificacion ? (
                  <span
                    className={`estado ${f.verificacion.resultado === "OK" ? "estado-pagada" : "estado-rechazada"}`}
                    title={Object.entries(f.verificacion.checks)
                      .map(([k, v]) => `${v ? "✓" : "✗"} ${CHECK_LABEL[k as keyof ChecksAgente] ?? k}`)
                      .join("\n")}
                  >
                    {f.verificacion.resultado === "OK" ? "✓ ok" : "✗ rechazada"}
                  </span>
                ) : (
                  <span className="muted">—</span>
                )}
              </td>
              <td className="muted">{f.origen.toLowerCase()}</td>
              <td>
                {f.estado === "CARGADA" && empresa?.multisigAddress && esMiembro && (
                  <button className="link" disabled={ocupado === `prop-${f.id}`} onClick={() => proponer(f)}>
                    {ocupado === `prop-${f.id}` ? "proponiendo…" : "proponer pago"}
                  </button>
                )}
                {f.estado === "EN_APROBACION" && esMiembro &&
                  !f.propuesta?.firmas.some((s) => s.usuarioId === usuario?.id) && (
                  <button className="link" disabled={ocupado === `apr-${f.id}`} onClick={() => aprobar(f)}>
                    {ocupado === `apr-${f.id}` ? "firmando…" : "aprobar"}
                  </button>
                )}
                {f.estado === "APROBADA" && esMiembro && (
                  <button className="link" disabled={ocupado === `eje-${f.id}`} onClick={() => ejecutarPago(f)}>
                    {ocupado === `eje-${f.id}` ? "ejecutando…" : "ejecutar pago"}
                  </button>
                )}
                {f.estado === "PAGADA" && f.pago?.txSignature && (
                  <a
                    className="link"
                    href={`https://explorer.solana.com/tx/${f.pago.txSignature}?cluster=devnet`}
                    target="_blank" rel="noreferrer"
                  >
                    ver tx
                  </a>
                )}
              </td>
            </tr>
          ))}
          {facturas.length === 0 && (
            <tr><td colSpan={10} className="muted">Todavía no hay facturas cargadas.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
