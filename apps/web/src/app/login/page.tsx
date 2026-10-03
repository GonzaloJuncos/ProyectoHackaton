"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rol } from "@/lib/types";
import { PROVEEDORES_MOCK } from "@/lib/mock";

type TipoCuenta = "empresa" | "personal" | null;

const ROLES: { rol: Rol; descripcion: string }[] = [
  { rol: "empleado", descripcion: "Carga proveedores y facturas. No aprueba pagos." },
  { rol: "jefe", descripcion: "Revisa facturas y firma aprobaciones (1 de 3)." },
  { rol: "supervisor", descripcion: "Revisa facturas y firma aprobaciones (1 de 3)." },
  { rol: "administrador", descripcion: "Gestiona usuarios y firma aprobaciones (1 de 3)." },
];

export default function Login() {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoCuenta>(null);

  const entrarEmpresa = (rol: Rol) => {
    localStorage.setItem("logis-rol", rol);
    router.push("/");
  };

  const entrarProveedor = (id: string) => {
    localStorage.setItem("logis-rol", "proveedor");
    localStorage.setItem("logis-proveedor", id);
    router.push("/portal-proveedor");
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
            <h1 className="mb-2 text-xl font-bold text-tinta">Cuenta empresa</h1>
            <p className="mb-6 text-sm text-tinta/60">
              Elegí tu rol dentro de la empresa. <em>Modo demo.</em>
            </p>
            <div className="space-y-3">
              {ROLES.map(({ rol, descripcion }) => (
                <button
                  key={rol}
                  onClick={() => entrarEmpresa(rol)}
                  className="w-full rounded-lg border bg-card p-4 text-left shadow-sm transition hover:border-menta hover:shadow"
                >
                  <span className="block font-semibold capitalize text-tinta">{rol}</span>
                  <span className="block text-sm text-tinta/50">{descripcion}</span>
                </button>
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
            onClick={() => setTipo(null)}
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
