"use client";

import { useRouter } from "next/navigation";
import { Rol } from "@/lib/types";

const ROLES: { rol: Rol; descripcion: string }[] = [
  { rol: "empleado", descripcion: "Carga proveedores y facturas. No aprueba pagos." },
  { rol: "jefe", descripcion: "Revisa facturas y firma aprobaciones (1 de 3)." },
  { rol: "supervisor", descripcion: "Revisa facturas y firma aprobaciones (1 de 3)." },
  { rol: "administrador", descripcion: "Gestiona usuarios y firma aprobaciones (1 de 3)." },
];

export default function Login() {
  const router = useRouter();

  const entrar = (rol: Rol) => {
    localStorage.setItem("logis-rol", rol);
    router.push("/facturas");
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-bold">Ingresar a Logis</h1>
      <p className="mb-6 text-sm text-gray-600">
        Pagos a proveedores en USDC con aprobación multisig y evidencia auditable.
        <em> Modo demo: elegí tu rol.</em>
      </p>
      <div className="space-y-3">
        {ROLES.map(({ rol, descripcion }) => (
          <button
            key={rol}
            onClick={() => entrar(rol)}
            className="w-full rounded-lg border bg-white p-4 text-left shadow-sm transition hover:border-blue-400 hover:shadow"
          >
            <span className="block font-semibold capitalize">{rol}</span>
            <span className="block text-sm text-gray-500">{descripcion}</span>
          </button>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-gray-400">
        Red de prueba (devnet) — la plata es de mentira.
      </p>
    </div>
  );
}
