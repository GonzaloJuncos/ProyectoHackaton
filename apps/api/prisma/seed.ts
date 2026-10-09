import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes, createHash } from "node:crypto";

const prisma = new PrismaClient();

// Password demo para todos los usuarios semilla: "logis123" (solo devnet/demo).
const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
};

// Mismo formato que apps/api/src/index.ts — la identidad de la factura que viaja on-chain.
const hashFactura = (f: { empresaId: string; proveedorId: string; numero: string; monto: number }) =>
  createHash("sha256")
    .update(`${f.empresaId}|${f.proveedorId}|${f.numero}|${f.monto}`)
    .digest("hex");

// Datos de demo: 1 empresa, 4 usuarios (uno por rol), 3 proveedores (1 local + 2
// del exterior — la cuña es cross-border), 3 órdenes de compra y 8 facturas.
// Las wallets de proveedores son direcciones devnet reales generadas para la demo;
// cobran USDC de mentira ahí. Reemplazarlas por las del equipo si hace falta.

const empresa = await prisma.empresa.upsert({
  where: { id: "empresa-demo" },
  update: {},
  create: { id: "empresa-demo", nombre: "Logis Demo SA", pais: "AR" },
});

const usuarios = [
  { id: "u-admin", nombre: "Admin Demo", email: "admin@logis.demo", rol: "ADMIN" },
  { id: "u-jefe", nombre: "Jefe Demo", email: "jefe@logis.demo", rol: "JEFE" },
  { id: "u-sup", nombre: "Supervisor Demo", email: "supervisor@logis.demo", rol: "SUPERVISOR" },
  { id: "u-emp", nombre: "Empleado Demo", email: "empleado@logis.demo", rol: "EMPLEADO" },
];

for (const u of usuarios) {
  await prisma.usuario.upsert({
    where: { email: u.email },
    update: {},
    create: { ...u, empresaId: empresa.id, passwordHash: hashPassword("logis123") },
  });
}

const provLocal = await prisma.proveedor.upsert({
  where: { id: "prov-local" },
  update: {},
  create: {
    id: "prov-local",
    empresaId: empresa.id,
    nombre: "Proveedor Local SRL",
    cuitOTaxId: "30-12345678-9",
    pais: "AR",
    walletUsdc: "6KbkS2d8YXBTqQ8dwKvJEW6fgDqd7F9s6feebKZme8BG",
  },
});

const provExt = await prisma.proveedor.upsert({
  where: { id: "prov-exterior" },
  update: {},
  create: {
    id: "prov-exterior",
    empresaId: empresa.id,
    nombre: "Overseas Supplier Inc",
    cuitOTaxId: "US-EIN-00-0000000",
    pais: "US",
    email: "billing@overseas.example",
    walletUsdc: "TxaEjrBUc87rAYwYiVNDVwQ4rJphAngKLWg9FLgBDko",
  },
});

const provMx = await prisma.proveedor.upsert({
  where: { id: "prov-mexico" },
  update: {},
  create: {
    id: "prov-mexico",
    empresaId: empresa.id,
    nombre: "Andes Parts SA de CV",
    cuitOTaxId: "RFC-APA-010101-AA1",
    pais: "MX",
    email: "pagos@andesparts.example",
    walletUsdc: "EanWmbFhNRKbYsmqebHjGCUZ16TScTyMviUDKt3MvNNk",
  },
});

const ocs = [
  { id: "oc-001", numero: "OC-2026-001", proveedorId: provExt.id, monto: 1500 },
  { id: "oc-002", numero: "OC-2026-002", proveedorId: provLocal.id, monto: 800 },
  { id: "oc-003", numero: "OC-2026-003", proveedorId: provMx.id, monto: 5000 },
];

for (const o of ocs) {
  await prisma.ordenCompra.upsert({
    where: { id: o.id },
    update: {},
    create: { ...o, empresaId: empresa.id, moneda: "USD" },
  });
}

// Facturas: todas CARGADA para poder correr el flujo en vivo.
// F-1002 es la "trampa": monto (2000) > OC (1500) → el agente la rechaza.
const facturas = [
  { id: "f-1001", numero: "F-1001", proveedorId: provExt.id, ordenCompraId: "oc-001", monto: 1200 },
  { id: "f-1002", numero: "F-1002", proveedorId: provExt.id, ordenCompraId: "oc-001", monto: 2000 },
  { id: "f-1003", numero: "F-1003", proveedorId: provLocal.id, ordenCompraId: "oc-002", monto: 800 },
  { id: "f-1004", numero: "F-1004", proveedorId: provLocal.id, ordenCompraId: null, monto: 350 },
  { id: "f-1005", numero: "F-1005", proveedorId: provMx.id, ordenCompraId: "oc-003", monto: 4800 },
  { id: "f-1006", numero: "F-1006", proveedorId: provMx.id, ordenCompraId: null, monto: 150 },
  { id: "f-1007", numero: "F-1007", proveedorId: provExt.id, ordenCompraId: null, monto: 90 },
  { id: "f-1008", numero: "F-1008", proveedorId: provLocal.id, ordenCompraId: "oc-002", monto: 400 },
];

for (const [i, f] of facturas.entries()) {
  await prisma.factura.upsert({
    where: { id: f.id },
    update: {},
    create: {
      ...f,
      empresaId: empresa.id,
      moneda: "USD",
      estado: "CARGADA",
      origen: i % 3 === 0 ? "CSV" : "MANUAL",
      hashSha256: hashFactura({ empresaId: empresa.id, proveedorId: f.proveedorId, numero: f.numero, monto: f.monto }),
      cargadaPorId: "u-emp",
    },
  });
}

// Una verificación rechazada ya registrada (F-1002 supera el monto de su OC):
// la tabla de facturas muestra el badge del agente desde el arranque y el equipo
// puede re-correr el rechazo en vivo durante la demo.
await prisma.verificacion.deleteMany({ where: { facturaId: "f-1002" } });
await prisma.verificacion.create({
  data: {
    facturaId: "f-1002",
    resultado: "RECHAZADA",
    checks: { ocCoincide: false, proveedorRegistrado: true, montoOk: true, sinDuplicados: true },
    detalle: "monto de factura supera el de la orden de compra",
  },
});

console.log("Seed listo:", {
  empresa: empresa.id,
  usuarios: usuarios.length,
  proveedores: [provLocal.id, provExt.id, provMx.id],
  ocs: ocs.length,
  facturas: facturas.length,
});

await prisma.$disconnect();
