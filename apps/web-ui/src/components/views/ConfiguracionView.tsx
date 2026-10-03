"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Rol } from "@/lib/types";

type Tema = "claro" | "oscuro";

export default function ConfiguracionView() {
  const { rol, setRol, notificar } = useApp();
  const [tema, setTema] = useState<Tema>("claro");

  useEffect(() => {
    const actual = (document.documentElement.dataset.theme === "dark" ? "oscuro" : "claro") as Tema;
    setTema(actual);
  }, []);

  const cambiarTema = (nuevo: Tema) => {
    setTema(nuevo);
    document.documentElement.dataset.theme = nuevo === "oscuro" ? "dark" : "";
    localStorage.setItem("logis-tema", nuevo === "oscuro" ? "dark" : "light");
    notificar(`Tema cambiado a ${nuevo}.`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tinta">Configuración</h1>
        <p className="text-sm text-tinta/60">Preferencias de entorno, roles y conexión on-chain.</p>
      </div>

      <section className="rounded-xl border bg-card p-5 shadow-xs">
        <h2 className="mb-1 font-semibold text-tinta">Rol en la Demo</h2>
        <p className="mb-4 text-xs text-tinta/60">
          Podés alternar tu identidad para comprobar las restricciones de permisos y las firmas 2/3.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(["empleado", "jefe", "supervisor", "administrador"] as Rol[]).map((r) => (
            <button
              key={r}
              onClick={() => setRol(r)}
              className={`rounded-lg border p-3 text-left transition ${
                rol === r
                  ? "border-petroleo bg-petroleo/10 text-enlace font-semibold"
                  : "bg-fondo text-tinta/70 hover:bg-card"
              }`}
            >
              <div className="text-xs capitalize font-bold">{r}</div>
              <div className="text-[10px] text-tinta/50">
                {r === "empleado" ? "Carga facturas" : "Firma 2/3"}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5 shadow-xs">
        <h2 className="mb-1 font-semibold text-tinta">Apariencia</h2>
        <p className="mb-4 text-xs text-tinta/60">Elegí la paleta visual de Logis.</p>
        <div className="flex gap-2">
          {(["claro", "oscuro"] as Tema[]).map((t) => (
            <button
              key={t}
              onClick={() => cambiarTema(t)}
              className={`rounded-lg border px-4 py-2 text-xs font-semibold capitalize transition ${
                tema === t
                  ? "border-petroleo bg-petroleo/10 text-enlace"
                  : "bg-card text-tinta/60 hover:bg-fondo"
              }`}
            >
              {t === "claro" ? "☀ Modo Claro" : "☾ Modo Oscuro"}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5 shadow-xs">
        <h2 className="mb-1 font-semibold text-tinta">Parámetros On-Chain (Devnet)</h2>
        <p className="mb-3 text-xs text-tinta/60">
          Configuración fija de red para la hackathon (Modo prueba siempre: devnet).
        </p>
        <div className="space-y-2 text-xs font-mono text-tinta/70 bg-fondo p-3 rounded-lg border">
          <div className="flex justify-between">
            <span className="text-tinta/50">Cluster:</span>
            <span className="text-menta bg-oscuro px-2 py-0.5 rounded font-sans font-bold">Solana Devnet</span>
          </div>
          <div className="flex justify-between">
            <span className="text-tinta/50">Token de Pago:</span>
            <span>USDC (SPL Token devnet)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-tinta/50">Multisig Engine:</span>
            <span>Squads Protocol V4 SDK</span>
          </div>
          <div className="flex justify-between">
            <span className="text-tinta/50">Verificador:</span>
            <span>Logis AI Invoice Agent</span>
          </div>
        </div>
      </section>
    </div>
  );
}
