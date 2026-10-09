import { useEffect, useState, type FormEvent } from "react";
import type { Usuario, Rol } from "@logis/shared";
import { api } from "../api";
import { useAuth } from "../auth";

const ROLES: Rol[] = ["ADMIN", "JEFE", "SUPERVISOR", "EMPLEADO"];

// Misma jerarquía que la API: admin→todos, jefe→supervisor, supervisor→empleado.
const ALCANZABLES: Record<string, Rol[]> = {
  ADMIN: ["ADMIN", "JEFE", "SUPERVISOR", "EMPLEADO"],
  JEFE: ["SUPERVISOR"],
  SUPERVISOR: ["EMPLEADO"],
  EMPLEADO: [],
};

const ROL_LABEL: Record<string, string> = {
  ADMIN: "administrador",
  JEFE: "jefe",
  SUPERVISOR: "supervisor",
  EMPLEADO: "empleado",
};

const FORM_VACIO = { nombre: "", email: "", password: "", rol: "EMPLEADO" as Rol };

export default function Usuarios() {
  const { usuario: yo } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [edit, setEdit] = useState<{ nombre: string; rol: Rol; walletPubkey: string }>({ nombre: "", rol: "EMPLEADO", walletPubkey: "" });
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const alcanzables = ALCANZABLES[yo?.rol ?? "EMPLEADO"] ?? [];

  const cargar = () =>
    api<Usuario[]>("/usuarios").then(setUsuarios).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await api("/usuarios", { method: "POST", body: JSON.stringify(form) });
      setForm(FORM_VACIO);
      setMostrarForm(false);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "error al crear usuario");
    } finally {
      setEnviando(false);
    }
  };

  const guardarEdicion = async (u: Usuario) => {
    setError(null);
    try {
      await api(`/usuarios/${u.id}`, {
        method: "PATCH",
        body: JSON.stringify({ nombre: edit.nombre, rol: edit.rol, walletPubkey: edit.walletPubkey || null }),
      });
      setEditando(null);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "error al editar usuario");
    }
  };

  const toggleActivo = async (u: Usuario) => {
    setError(null);
    try {
      await api(`/usuarios/${u.id}`, {
        method: "PATCH",
        body: JSON.stringify({ activo: !u.activo }),
      });
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "error al actualizar usuario");
    }
  };

  return (
    <section>
      <header className="pagina-header">
        <h2>Usuarios</h2>
        {yo?.rol === "ADMIN" && (
          <button onClick={() => setMostrarForm(!mostrarForm)}>
            {mostrarForm ? "Cancelar" : "+ Nuevo usuario"}
          </button>
        )}
      </header>

      {mostrarForm && (
        <form onSubmit={onSubmit} className="card form-proveedor">
          <h3>Alta de usuario</h3>
          <div className="grid-2">
            <label>
              Nombre
              <input value={form.nombre} required onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </label>
            <label>
              Email
              <input type="email" value={form.email} required onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>
              Contraseña (mín. 8)
              <input type="password" minLength={8} value={form.password} required onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </label>
            <label>
              Rol
              <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value as Rol })}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{ROL_LABEL[r]}</option>
                ))}
              </select>
            </label>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={enviando}>{enviando ? "Guardando…" : "Crear usuario"}</button>
        </form>
      )}

      {error && !mostrarForm && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Wallet firmante</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => {
            const editable = alcanzables.includes(u.rol) && u.id !== yo?.id;
            return (
              <tr key={u.id}>
                {editando === u.id ? (
                  <>
                    <td><input value={edit.nombre} onChange={(e) => setEdit({ ...edit, nombre: e.target.value })} /></td>
                    <td className="muted">{u.email}</td>
                    <td>
                      <select value={edit.rol} onChange={(e) => setEdit({ ...edit, rol: e.target.value as Rol })}>
                        {alcanzables.map((r) => (
                          <option key={r} value={r}>{ROL_LABEL[r]}</option>
                        ))}
                      </select>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.nombre}{u.id === yo?.id ? " (vos)" : ""}</td>
                    <td className="muted">{u.email}</td>
                    <td><span className="estado estado-cargada">{ROL_LABEL[u.rol] ?? u.rol}</span></td>
                  </>
                )}
                <td>
                  {editando === u.id ? (
                    <input
                      value={edit.walletPubkey}
                      placeholder="dirección devnet"
                      onChange={(e) => setEdit({ ...edit, walletPubkey: e.target.value })}
                    />
                  ) : u.walletPubkey ? (
                    <code title={u.walletPubkey}>{u.walletPubkey.slice(0, 10)}…</code>
                  ) : (
                    <span className="muted">sin vincular</span>
                  )}
                </td>
                <td>
                  <span className={`estado ${u.activo ? "estado-aprobada" : "estado-rechazada"}`}>
                    {u.activo ? "activo" : "inactivo"}
                  </span>
                </td>
                <td>
                  {editable && editando !== u.id && (
                    <>
                      <button className="link" onClick={() => { setEditando(u.id); setEdit({ nombre: u.nombre, rol: u.rol, walletPubkey: u.walletPubkey ?? "" }); }}>
                        editar
                      </button>
                      {" · "}
                      <button className="link" onClick={() => toggleActivo(u)}>
                        {u.activo ? "desactivar" : "activar"}
                      </button>
                    </>
                  )}
                  {editando === u.id && (
                    <>
                      <button className="link" onClick={() => guardarEdicion(u)}>guardar</button>
                      {" · "}
                      <button className="link" onClick={() => setEditando(null)}>cancelar</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
          {usuarios.length === 0 && (
            <tr><td colSpan={6} className="muted">Sin usuarios.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
