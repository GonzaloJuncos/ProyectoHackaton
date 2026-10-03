"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROVEEDORES_MOCK, USUARIOS_MOCK } from "@/lib/mock";

type TipoCuenta = "empresa" | "personal" | null;

export default function Login() {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoCuenta>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const entrarEmpresa = (e: React.FormEvent) => {
    e.preventDefault();
    const usuario = USUARIOS_MOCK.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!usuario) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }
    localStorage.setItem("logis-rol", usuario.rol);
    localStorage.setItem("logis-usuario", usuario.nombre);
    router.push("/");
  };

  const entrarProveedor = (id: string) => {
    localStorage.setItem("logis-rol", "proveedor");
    localStorage.setItem("logis-proveedor", id);
    router.push("/portal-proveedor");
  };

  const volver = () => {
    setTipo(null);
    setError("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-fondo">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="text-3xl font-bold text-tinta">Logis</span>
        </div>

        {!tipo && (
          <>
            <h1 className="mb-2 text-xl font-bold text-tinta">Bienvenido de nuevo</h1>
            <p className="mb-6 text-sm text-tinta/60">
              Ingresá con tu cuenta para continuar donde lo dejaste.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setTipo("empresa")}
                className="w-full rounded-lg border bg-card p-4 text-left shadow-sm transition hover:border-menta hover:shadow"
              >
                <span className="block font-semibold text-tinta">Cuenta empresa</span>
                <span className="block text-sm text-tinta/50">
                  Pagás a tus proveedores. Aprobaciones, facturas y conciliación.
                </span>
              </button>
              <button
                onClick={() => setTipo("personal")}
                className="w-full rounded-lg border bg-card p-4 text-left shadow-sm transition hover:border-menta hover:shadow"
              >
                <span className="block font-semibold text-tinta">Cuenta personal / proveedor</span>
                <span className="block text-sm text-tinta/50">
                  Cobrás en USDC. Ves tus pagos y su comprobante on-chain.
                </span>
              </button>
            </div>
          </>
        )}

        {tipo === "empresa" && (
          <>
            <h1 className="mb-2 text-xl font-bold text-tinta">Iniciar sesión</h1>
            <p className="mb-6 text-sm text-tinta/60">
              Cuenta empresa — usuarios con rol interno.
            </p>
            <form onSubmit={entrarEmpresa} className="rounded-xl border bg-card p-5 shadow-sm">
              <label className="block text-xs font-semibold uppercase tracking-wide text-tinta/50">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maria@empresa.com"
                className="mt-1 w-full rounded-lg border bg-fondo px-3 py-2 text-sm text-tinta outline-none focus:border-menta"
              />
              <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-tinta/50">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border bg-fondo px-3 py-2 text-sm text-tinta outline-none focus:border-menta"
              />
              {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
              <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-petroleo py-2.5 text-sm font-semibold text-white hover:brightness-110"
              >
                Ingresar
              </button>
              <p className="mt-3 text-center text-xs text-enlace">
                ¿Olvidaste tu contraseña?
              </p>
            </form>
            <div className="mt-3 rounded-lg bg-card p-3 text-xs text-tinta/60">
              <p className="mb-1 font-semibold">Usuarios demo (clave: demo123)</p>
              {USUARIOS_MOCK.map((u) => (
                <p key={u.email}>
                  {u.email} — <span className="capitalize">{u.rol}</span>
                </p>
              ))}
            </div>
          </>
        )}

        {tipo === "personal" && (
          <>
            <h1 className="mb-2 text-xl font-bold text-tinta">Cuenta personal / proveedor</h1>
            <p className="mb-6 text-sm text-tinta/60">
              Elegí con qué proveedor entrar. <em>Modo demo.</em>
            </p>
            <div className="space-y-3">
              {PROVEEDORES_MOCK.map((p) => (
                <button
                  key={p.id}
                  onClick={() => entrarProveedor(p.id)}
                  className="w-full rounded-lg border bg-card p-4 text-left shadow-sm transition hover:border-menta hover:shadow"
                >
                  <span className="block font-semibold text-tinta">{p.nombre}</span>
                  <span className="block text-sm text-tinta/50">{p.pais} · {p.wallet}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {tipo && (
          <button
            onClick={volver}
            className="mt-4 w-full text-center text-sm text-enlace hover:underline"
          >
            ← Volver
          </button>
        )}
        <p className="mt-6 text-center text-xs text-tinta/40">
          Red de prueba (devnet) — la plata es de mentira.
        </p>
      </div>
    </div>
  );
}
