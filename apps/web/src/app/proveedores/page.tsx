"use client";

import { useState } from "react";
import { PROVEEDORES_MOCK } from "@/lib/mock";
import { Proveedor } from "@/lib/types";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>(PROVEEDORES_MOCK);
  const [nombre, setNombre] = useState("");
  const [pais, setPais] = useState("");
  const [wallet, setWallet] = useState("");

  const agregar = () => {
    if (!nombre || !wallet) return;
    setProveedores([...proveedores, { id: `p${Date.now()}`, nombre, pais, wallet }]);
    setNombre(""); setPais(""); setWallet("");
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Proveedores</h1>

      <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">Alta de proveedor</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          <input className="rounded border px-3 py-2" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <input className="rounded border px-3 py-2" placeholder="País" value={pais} onChange={(e) => setPais(e.target.value)} />
          <input className="rounded border px-3 py-2" placeholder="Wallet USDC (destino)" value={wallet} onChange={(e) => setWallet(e.target.value)} />
        </div>
        <button onClick={agregar} className="mt-3 rounded bg-petroleo px-4 py-2 text-sm font-medium text-white hover:brightness-110">
          Agregar
        </button>
      </div>

      <table className="w-full rounded-lg border bg-card text-sm shadow-sm">
        <thead className="border-b bg-fondo text-left">
          <tr><th className="p-3">Nombre</th><th className="p-3">País</th><th className="p-3">Wallet</th></tr>
        </thead>
        <tbody>
          {proveedores.map((p) => (
            <tr key={p.id} className="border-b last:border-0">
              <td className="p-3 font-medium">{p.nombre}</td>
              <td className="p-3">{p.pais}</td>
              <td className="p-3 font-mono text-xs">{p.wallet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
