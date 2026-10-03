import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword, crearSesion, requireAuth, requireRoles } from "./auth.js";

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

const auth = requireAuth(prisma);
const soloAdmin = requireRoles(prisma, ["ADMIN"]);

app.get("/health", async () => ({ ok: true, servicio: "logis-api", red: "devnet" }));

// ---------- Auth (RF-01) ----------

app.post("/api/auth/login", async (req, reply) => {
  const { email, password } = (req.body ?? {}) as { email?: string; password?: string };
  if (!email || !password) return reply.code(400).send({ error: "faltan email y password" });

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || !usuario.activo || !verifyPassword(password, usuario.passwordHash)) {
    return reply.code(401).send({ error: "credenciales inválidas" });
  }
  const sesion = await crearSesion(prisma, usuario.id);
  const { passwordHash: _, ...resto } = usuario;
  return { token: sesion.token, usuario: resto };
});

app.post("/api/auth/logout", { preHandler: auth }, async (req, reply) => {
  const token = req.headers.authorization!.slice(7);
  await prisma.sesion.deleteMany({ where: { token } });
  return reply.code(204).send();
});

app.get("/api/auth/me", { preHandler: auth }, async (req) => {
  const { passwordHash: _, ...resto } = req.usuario!;
  return resto;
});

// ---------- Usuarios (RF-01, solo ADMIN) ----------

app.get("/api/usuarios", { preHandler: soloAdmin }, async (req) => {
  return prisma.usuario.findMany({
    where: { empresaId: req.usuario!.empresaId },
    select: { id: true, nombre: true, email: true, rol: true, walletPubkey: true, activo: true },
    orderBy: { nombre: "asc" },
  });
});

app.post("/api/usuarios", { preHandler: soloAdmin }, async (req, reply) => {
  const { nombre, email, password, rol, walletPubkey } = (req.body ?? {}) as {
    nombre?: string; email?: string; password?: string; rol?: string; walletPubkey?: string;
  };
  if (!nombre || !email || !password || !rol) {
    return reply.code(400).send({ error: "faltan campos: nombre, email, password, rol" });
  }
  if (!["ADMIN", "JEFE", "SUPERVISOR", "EMPLEADO"].includes(rol)) {
    return reply.code(400).send({ error: "rol inválido" });
  }
  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) return reply.code(409).send({ error: "ya existe un usuario con ese email" });

  const usuario = await prisma.usuario.create({
    data: { empresaId: req.usuario!.empresaId, nombre, email, passwordHash: hashPassword(password), rol, walletPubkey },
  });
  const { passwordHash: _, ...resto } = usuario;
  return reply.code(201).send(resto);
});

// ---------- Wallet del usuario (RF-02) ----------

// Guarda la pubkey que el usuario usa para firmar aprobaciones en devnet.
const PUBKEY_BASE58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

app.put("/api/usuarios/me/wallet", { preHandler: auth }, async (req, reply) => {
  const { walletPubkey } = (req.body ?? {}) as { walletPubkey?: string };
  if (!walletPubkey || !PUBKEY_BASE58.test(walletPubkey)) {
    return reply.code(400).send({ error: "walletPubkey inválida" });
  }
  const usuario = await prisma.usuario.update({
    where: { id: req.usuario!.id },
    data: { walletPubkey },
  });
  await prisma.auditLog.create({
    data: { empresaId: usuario.empresaId, entidad: "usuario", entidadId: usuario.id, accion: "wallet_vinculada", actorId: usuario.id },
  });
  const { passwordHash: _, ...resto } = usuario;
  return resto;
});

// ---------- Proveedores (RF-03) ----------

app.get("/api/proveedores", { preHandler: auth }, async (req) => {
  return prisma.proveedor.findMany({
    where: { empresaId: req.usuario!.empresaId, activo: true },
    orderBy: { nombre: "asc" },
  });
});

app.get("/api/proveedores/:id", { preHandler: auth }, async (req, reply) => {
  const { id } = req.params as { id: string };
  const proveedor = await prisma.proveedor.findFirst({
    where: { id, empresaId: req.usuario!.empresaId },
    include: { ordenesCompra: true, facturas: { orderBy: { createdAt: "desc" }, take: 20 } },
  });
  if (!proveedor) return reply.code(404).send({ error: "proveedor no encontrado" });
  return proveedor;
});

app.post("/api/proveedores", { preHandler: auth }, async (req, reply) => {
  const body = (req.body ?? {}) as {
    nombre?: string; cuitOTaxId?: string; pais?: string; email?: string; walletUsdc?: string;
  };
  if (!body.nombre || !body.walletUsdc) {
    return reply.code(400).send({ error: "faltan campos: nombre, walletUsdc" });
  }
  const proveedor = await prisma.proveedor.create({
    data: { ...body, empresaId: req.usuario!.empresaId },
  });
  await prisma.auditLog.create({
    data: { empresaId: req.usuario!.empresaId, entidad: "proveedor", entidadId: proveedor.id, accion: "cargada", actorId: req.usuario!.id },
  });
  return reply.code(201).send(proveedor);
});

app.patch("/api/proveedores/:id", { preHandler: auth }, async (req, reply) => {
  const { id } = req.params as { id: string };
  const body = (req.body ?? {}) as Partial<{
    nombre: string; cuitOTaxId: string; pais: string; email: string; walletUsdc: string; activo: boolean;
  }>;
  const existe = await prisma.proveedor.findFirst({ where: { id, empresaId: req.usuario!.empresaId } });
  if (!existe) return reply.code(404).send({ error: "proveedor no encontrado" });
  return prisma.proveedor.update({ where: { id }, data: body });
});

app.delete("/api/proveedores/:id", { preHandler: auth }, async (req, reply) => {
  const { id } = req.params as { id: string };
  const existe = await prisma.proveedor.findFirst({ where: { id, empresaId: req.usuario!.empresaId } });
  if (!existe) return reply.code(404).send({ error: "proveedor no encontrado" });
  // baja lógica: conserva historial de facturas y pagos
  return prisma.proveedor.update({ where: { id }, data: { activo: false } });
});

// ---------- Facturas (RF-04) ----------

app.get("/api/facturas", { preHandler: auth }, async (req) => {
  const facturas = await prisma.factura.findMany({
    where: { empresaId: req.usuario!.empresaId },
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

app.post("/api/facturas", { preHandler: auth }, async (req, reply) => {
  const body = (req.body ?? {}) as {
    proveedorId?: string; ordenCompraId?: string; numero?: string;
    monto?: number; hashSha256?: string; origen?: string;
  };
  if (!body.proveedorId || !body.numero || !body.monto || !body.hashSha256) {
    return reply.code(400).send({ error: "faltan campos: proveedorId, numero, monto, hashSha256" });
  }
  const proveedor = await prisma.proveedor.findFirst({
    where: { id: body.proveedorId, empresaId: req.usuario!.empresaId, activo: true },
  });
  if (!proveedor) return reply.code(404).send({ error: "proveedor no encontrado o inactivo" });

  const factura = await prisma.factura.create({
    data: { ...body, empresaId: req.usuario!.empresaId, cargadaPorId: req.usuario!.id },
  });
  await prisma.auditLog.create({
    data: { empresaId: req.usuario!.empresaId, entidad: "factura", entidadId: factura.id, accion: "cargada", actorId: req.usuario!.id },
  });
  return reply.code(201).send(factura);
});

// ---------- Conciliación (RF-08) ----------

app.get("/api/conciliacion", { preHandler: auth }, async (req) => {
  return prisma.pago.findMany({
    where: { factura: { empresaId: req.usuario!.empresaId } },
    include: { factura: { include: { proveedor: { select: { nombre: true, pais: true } } } } },
    orderBy: { createdAt: "desc" },
  });
});

// ---------- Auditoría (RF-09) ----------

app.get("/api/audit-log", { preHandler: auth }, async (req) => {
  return prisma.auditLog.findMany({
    where: { empresaId: req.usuario!.empresaId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
});

const port = Number(process.env.PORT ?? 3001);
await app.listen({ port, host: "0.0.0.0" });
