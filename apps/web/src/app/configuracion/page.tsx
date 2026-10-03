"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Tema = "claro" | "oscuro";

export default function Configuracion() {
  const router = useRouter();
  const [tema, setTema] = useState<Tema>("claro");
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const actual = (document.documentElement.dataset.theme === "dark" ? "oscuro" : "claro") as Tema;
    setTema(actual);
    setRol(localStorage.getItem("logis-rol"));
  }, []);

  const cambiarTema = (nuevo: Tema) => {
    setTema(nuevo);
    document.documentElement.dataset.theme = nuevo === "oscuro" ? "dark" : "";
    localStorage.setItem("logis-tema", nuevo === "oscuro" ? "dark" : "light");
  };

  const cambiarSesion = () => {
    localStorage.removeItem("logis-rol");
    localStorage.removeItem("logis-proveedor");
    router.push("/login");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-tinta">Configuración</h1>
        <p className="text-sm text-tinta/60">Preferencias de la interfaz y de la sesión.</p>
      </div>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-1 font-semibold text-tinta">Apariencia</h2>
        <p className="mb-4 text-sm text-tinta/60">Elegí el tema de la interfaz.</p>
        <div className="flex gap-2">
          {(["claro", "oscuro"] as Tema[]).map((t) => (
            <button
              key={t}
              onClick={() => cambiarTema(t)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition ${
                tema === t
                  ? "border-petroleo bg-petroleo/10 text-enlace"
                  : "bg-card text-tinta/60 hover:bg-fondo"
              }`}
            >
              {t === "claro" ? "☀ Claro" : "☾ Oscuro"}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-1 font-semibold text-tinta">Sesión</h2>
        <p className="mb-4 text-sm text-tinta/60">
          {rol ? (
            <>Sesión actual: <span className="font-medium capitalize">{rol}</span></>
          ) : (
            "No hay sesión activa."
          )}
        </p>
        <button
          onClick={cambiarSesion}
          className="rounded-lg bg-petroleo px-4 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          Cambiar sesión
        </button>
      </section>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-1 font-semibold text-tinta">Organización</h2>
        <p className="text-sm text-tinta/60">Usuarios, roles y multisig de la empresa — en construcción.</p>
      </section>
    </div>
  );
}
