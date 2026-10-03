import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

app.get("/health", async () => ({ ok: true, servicio: "logis-api", red: "devnet" }));

// ---------- Proveedores (RF-03) ----------

app.get("/api/proveedores", async () => {
  return prisma.proveedor.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } });
});

app.post("/api/proveedores", async (req, reply) => {
  const body = req.body as {
    empresaId: string;
    nombre: string;
    cuitOTaxId?: string;
    pais?: string;
    email?: string;
    walletUsdc: string;
  };
  if (!body.empresaId || !body.nombre || !body.walletUsdc) {
    return reply.code(400).send({ error: "faltan campos: empresaId, nombre, walletUsdc" });
  }
  const proveedor = await prisma.proveedor.create({ data: body });
  await prisma.auditLog.create({
    data: {
      empresaId: body.empresaId,
      entidad: "proveedor",
      entidadId: proveedor.id,
      accion: "cargada",
    },
  });
  return reply.code(201).send(proveedor);
});

// ---------- Facturas (RF-04) ----------

app.get("/api/facturas", async (req) => {
  const { empresaId } = req.query as { empresaId?: string };
  const facturas = await prisma.factura.findMany({
    where: empresaId ? { empresaId } : undefined,
    include: {
      proveedor: { select: { nombre: true } },
      propuesta: { include: { firmas: true } },
      pago: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return facturas.map((f) => ({
    ...f,
    proveedorNombre: f.proveedor.nombre,
    firmasCount: f.propuesta?.firmas.length ?? 0,
  }));
});

app.post("/api/facturas", async (req, reply) => {
  const body = req.body as {
    empresaId: string;
    proveedorId: string;
    ordenCompraId?: string;
    numero: string;
    monto: number;
    hashSha256: string;
    cargadaPorId: string;
    origen?: string;
  };
  if (!body.empresaId || !body.proveedorId || !body.numero || !body.monto || !body.hashSha256 || !body.cargadaPorId) {
    return reply.code(400).send({ error: "faltan campos obligatorios" });
  }
  const factura = await prisma.factura.create({ data: body });
  await prisma.auditLog.create({
    data: {
      empresaId: body.empresaId,
      entidad: "factura",
      entidadId: factura.id,
      accion: "cargada",
      actorId: body.cargadaPorId,
    },
  });
  return reply.code(201).send(factura);
});

// ---------- Conciliación (RF-08) ----------

app.get("/api/conciliacion", async (req) => {
  const { empresaId } = req.query as { empresaId?: string };
  return prisma.pago.findMany({
    where: empresaId ? { factura: { empresaId } } : undefined,
    include: {
      factura: { include: { proveedor: { select: { nombre: true, pais: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
});

// ---------- Auditoría (RF-09) ----------

app.get("/api/audit-log", async (req) => {
  const { empresaId } = req.query as { empresaId?: string };
  return prisma.auditLog.findMany({
    where: empresaId ? { empresaId } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
});

const port = Number(process.env.PORT ?? 3001);
await app.listen({ port, host: "0.0.0.0" });
