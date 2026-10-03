import { useEffect, useState, type FormEvent } from "react";
import type { Proveedor } from "@logis/shared";
import { api } from "../api";

const FORM_VACIO = { nombre: "", pais: "AR", cuitOTaxId: "", email: "", walletUsdc: "" };

export default function Proveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const cargar = () =>
    api<Proveedor[]>("/proveedores").then(setProveedores).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await api("/proveedores", { method: "POST", body: JSON.stringify(form) });
      setForm(FORM_VACIO);
      setMostrarForm(false);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "error al crear proveedor");
    } finally {
      setEnviando(false);
    }
  };

  const darDeBaja = async (id: string, nombre: string) => {
    if (!confirm(`¿Dar de baja a ${nombre}? Sus facturas y pagos quedan en el historial.`)) return;
    await api(`/proveedores/${id}`, { method: "DELETE" }).catch((e) => setError(e.message));
    await cargar();
  };

  const campo = (k: keyof typeof FORM_VACIO, label: string, opts: { required?: boolean; type?: string; placeholder?: string } = {}) => (
    <label>
      {label}
      <input
        type={opts.type ?? "text"}
        value={form[k]}
        required={opts.required}
        placeholder={opts.placeholder}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
      />
    </label>
  );

  return (
    <section>
      <header className="pagina-header">
        <h2>Proveedores</h2>
        <button onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? "Cancelar" : "+ Nuevo proveedor"}
        </button>
      </header>

      {mostrarForm && (
        <form onSubmit={onSubmit} className="card form-proveedor">
          <h3>Alta de proveedor</h3>
          <div className="grid-2">
            {campo("nombre", "Nombre / razón social", { required: true })}
            {campo("pais", "País (AR = local)", { required: true })}
            {campo("cuitOTaxId", "CUIT o Tax ID")}
            {campo("email", "Email", { type: "email" })}
          </div>
          {campo("walletUsdc", "Wallet USDC de destino", {
            required: true,
            placeholder: "Dirección Solana donde cobra",
          })}
          <p className="muted small">El proveedor cobra en USDC y gestiona su propia salida a fiat.</p>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={enviando}>{enviando ? "Guardando…" : "Guardar proveedor"}</button>
        </form>
      )}

      {error && !mostrarForm && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>País</th>
            <th>CUIT / Tax ID</th>
            <th>Wallet USDC</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.pais}{p.pais === "AR" ? " (local)" : " (exterior)"}</td>
              <td>{p.cuitOTaxId ?? "—"}</td>
              <td><code>{p.walletUsdc.slice(0, 12)}…</code></td>
              <td><button className="link" onClick={() => darDeBaja(p.id, p.nombre)}>dar de baja</button></td>
            </tr>
          ))}
          {proveedores.length === 0 && (
            <tr><td colSpan={5} className="muted">Todavía no hay proveedores cargados.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
