import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "node:crypto";

const prisma = new PrismaClient();

// Password demo para todos los usuarios semilla: "logis123" (solo devnet/demo).
const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
};

// Datos mínimos para la demo: 1 empresa, 4 usuarios (uno por rol),
// 2 proveedores (local + exterior), 1 orden de compra, 2 facturas.

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
    walletUsdc: "WalletDevnetProveedorLocal1111111111111111",
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
    walletUsdc: "WalletDevnetProveedorExterior11111111111111",
  },
});

const oc = await prisma.ordenCompra.upsert({
  where: { id: "oc-001" },
  update: {},
  create: {
    id: "oc-001",
    empresaId: empresa.id,
    proveedorId: provExt.id,
    numero: "OC-2026-001",
    monto: 1500,
    moneda: "USD",
  },
});

console.log("Seed listo:", { empresa: empresa.id, usuarios: usuarios.length, proveedores: [provLocal.id, provExt.id], oc: oc.id });

await prisma.$disconnect();
