"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROVEEDORES_MOCK, USUARIOS_MOCK } from "@/lib/mock";

type TipoCuenta = "empresa" | "personal" | null;

const IconoMail = () => (
  <svg className="h-4 w-4 text-tinta/40" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path strokeLinecap="round" d="M3 7l9 6 9-6" />
  </svg>
);

const IconoCandado = () => (
  <svg className="h-4 w-4 text-tinta/40" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 118 0v4" />
  </svg>
);

const IconoOjo = ({ abierto }: { abierto: boolean }) =>
  abierto ? (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M3 3l18 18M10.5 5.2A9.5 9.5 0 0121 12s-1.5 2.6-4 4.4M6.6 6.6C4.4 8 3 12 3 12s3.5 6 9 6c1.4 0 2.7-.3 3.8-.8" />
    </svg>
  );

const IconoWallet = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 000 4h12" />
    <circle cx="16" cy="13" r="0.5" fill="currentColor" />
  </svg>
);

export default function Login() {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoCuenta>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [recordarme, setRecordarme] = useState(false);
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
    if (recordarme) localStorage.setItem("logis-recordarme", "1");
    router.push("/");
  };

  const entrarWallet = () => {
    localStorage.setItem("logis-rol", "administrador");
    localStorage.setItem("logis-usuario", "Wallet 7xKX…dE9w");
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
    <div className="flex min-h-screen items-center justify-center bg-fondo px-4">
      <div className="w-full max-w-sm">
        {!tipo && (
          <>
            <h1 className="mb-2 text-2xl font-bold text-tinta">Bienvenido de nuevo</h1>
            <p className="mb-6 text-sm text-tinta/60">
              Pagos a proveedores en USDC con aprobación multisig y evidencia auditable.
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
            <h1 className="mb-2 text-2xl font-bold text-tinta">Iniciar sesión</h1>
            <p className="mb-6 text-sm text-tinta/60">Ingresá con el correo de tu empresa</p>

            <form onSubmit={entrarEmpresa} className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5">
                <IconoMail />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full bg-transparent text-sm text-tinta outline-none placeholder:text-tinta/40"
                />
              </div>

              <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5">
                <IconoCandado />
                <input
                  type={verPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full bg-transparent text-sm text-tinta outline-none placeholder:text-tinta/40"
                />
                <button
                  type="button"
                  onClick={() => setVerPass(!verPass)}
                  className="text-tinta/40 hover:text-tinta"
                  aria-label={verPass ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  <IconoOjo abierto={verPass} />
                </button>
              </div>

              <label className="flex items-center gap-2 text-sm text-tinta/70">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  className="h-4 w-4 rounded accent-menta"
                />
                Recordarme
              </label>

              {error && <p className="text-xs font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-menta py-3 text-sm font-bold text-oscuro hover:brightness-105"
              >
                Iniciar sesión <span aria-hidden>→</span>
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-tinta/15" />
              <span className="text-xs text-tinta/50">o</span>
              <span className="h-px flex-1 bg-tinta/15" />
            </div>

            <button
              onClick={entrarWallet}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-tinta/25 bg-card py-3 text-sm font-semibold text-tinta hover:border-menta"
            >
              <IconoWallet /> Conectar con Wallet
            </button>

            <p className="mt-6 text-center text-xs text-enlace">
              ¿Olvidaste tu contraseña?
            </p>

            <div className="mt-4 rounded-lg bg-card p-3 text-xs text-tinta/60">
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
            <h1 className="mb-2 text-2xl font-bold text-tinta">Cuenta personal / proveedor</h1>
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
            className="mt-6 w-full text-center text-sm text-enlace hover:underline"
          >
            ← Volver
          </button>
        )}
        <p className="mt-8 text-center text-xs text-tinta/40">
          Red de prueba (devnet) — la plata es de mentira.
        </p>
      </div>
    </div>
  );
}
