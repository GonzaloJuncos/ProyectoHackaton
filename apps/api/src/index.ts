import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";
import { hashPassword, verifyPassword, crearSesion, requireAuth, requireRoles } from "./auth.js";
import {
  infoCrearMultisig, infoPropuestaPago, infoAprobar, infoEjecutar,
  leerPropuesta, leerMiembrosMultisig,
} from "./squads.js";

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
    data: {
      nombre: body.nombre, walletUsdc: body.walletUsdc,
      cuitOTaxId: body.cuitOTaxId, pais: body.pais, email: body.email,
      empresaId: req.usuario!.empresaId,
    },
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

app.put("/api/proveedores/:id", { preHandler: auth }, async (req, reply) => {
  const { id } = req.params as { id: string };
  const body = (req.body ?? {}) as {
    nombre?: string; cuitOTaxId?: string; pais?: string; email?: string; walletUsdc?: string;
  };
  const existente = await prisma.proveedor.findFirst({
    where: { id, empresaId: req.usuario!.empresaId },
  });
  if (!existente) return reply.code(404).send({ error: "proveedor no encontrado" });
  const proveedor = await prisma.proveedor.update({
    where: { id },
    data: {
      nombre: body.nombre ?? existente.nombre,
      cuitOTaxId: body.cuitOTaxId ?? existente.cuitOTaxId,
      pais: body.pais ?? existente.pais,
      email: body.email ?? existente.email,
      walletUsdc: body.walletUsdc ?? existente.walletUsdc,
    },
  });
  await prisma.auditLog.create({
    data: { empresaId: req.usuario!.empresaId, entidad: "proveedor", entidadId: id, accion: "editada", actorId: req.usuario!.id },
  });
  return proveedor;
});

app.delete("/api/proveedores/:id", { preHandler: auth }, async (req, reply) => {
  const { id } = req.params as { id: string };
  const existe = await prisma.proveedor.findFirst({ where: { id, empresaId: req.usuario!.empresaId } });
  if (!existe) return reply.code(404).send({ error: "proveedor no encontrado" });
  // baja lógica: conserva historial de facturas y pagos
  return prisma.proveedor.update({ where: { id }, data: { activo: false } });
});

// ---------- Órdenes de compra ----------

app.get("/api/ordenes-compra", { preHandler: auth }, async (req) => {
  return prisma.ordenCompra.findMany({
    where: { empresaId: req.usuario!.empresaId },
    include: { proveedor: { select: { nombre: true } } },
    orderBy: { createdAt: "desc" },
  });
});

app.post("/api/ordenes-compra", { preHandler: auth }, async (req, reply) => {
  const { proveedorId, numero, monto } = (req.body ?? {}) as {
    proveedorId?: string; numero?: string; monto?: number;
  };
  if (!proveedorId || !numero || !monto) {
    return reply.code(400).send({ error: "faltan campos: proveedorId, numero, monto" });
  }
  const proveedor = await prisma.proveedor.findFirst({
    where: { id: proveedorId, empresaId: req.usuario!.empresaId, activo: true },
  });
  if (!proveedor) return reply.code(404).send({ error: "proveedor no encontrado o inactivo" });
  const oc = await prisma.ordenCompra.create({
    data: { empresaId: req.usuario!.empresaId, proveedorId, numero, monto },
  });
  return reply.code(201).send(oc);
});

// ---------- Facturas (RF-04) ----------

// Hash del contenido de la factura: identidad que viaja on-chain en el memo del pago.
const hashFactura = (f: { empresaId: string; proveedorId: string; numero: string; monto: number }) =>
  createHash("sha256")
    .update(`${f.empresaId}|${f.proveedorId}|${f.numero}|${f.monto}`)
    .digest("hex");

app.get("/api/facturas", { preHandler: auth }, async (req) => {
  const facturas = await prisma.factura.findMany({
    where: { empresaId: req.usuario!.empresaId },
    include: {
      proveedor: { select: { nombre: true } },
      ordenCompra: { select: { numero: true } },
      propuesta: { include: { firmas: true } },
      pago: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return facturas.map((f) => ({
    ...f,
    proveedorNombre: f.proveedor.nombre,
    ocNumero: f.ordenCompra?.numero ?? null,
    firmasCount: f.propuesta?.firmas.length ?? 0,
  }));
});

app.post("/api/facturas", { preHandler: auth }, async (req, reply) => {
  const body = (req.body ?? {}) as {
    proveedorId?: string; ordenCompraId?: string; numero?: string;
    monto?: number; origen?: string;
  };
  if (!body.proveedorId || !body.numero || !body.monto) {
    return reply.code(400).send({ error: "faltan campos: proveedorId, numero, monto" });
  }
  const empresaId = req.usuario!.empresaId;
  const proveedor = await prisma.proveedor.findFirst({
    where: { id: body.proveedorId, empresaId, activo: true },
  });
  if (!proveedor) return reply.code(404).send({ error: "proveedor no encontrado o inactivo" });
  if (body.ordenCompraId) {
    const oc = await prisma.ordenCompra.findFirst({
      where: { id: body.ordenCompraId, empresaId, proveedorId: body.proveedorId },
    });
    if (!oc) return reply.code(404).send({ error: "orden de compra no encontrada para ese proveedor" });
  }

  const duplicada = await prisma.factura.findFirst({
    where: { empresaId, proveedorId: body.proveedorId, numero: body.numero },
  });
  if (duplicada) return reply.code(409).send({ error: "factura duplicada: ese número ya existe para el proveedor" });

  const factura = await prisma.factura.create({
    data: {
      empresaId,
      proveedorId: body.proveedorId,
      ordenCompraId: body.ordenCompraId,
      numero: body.numero,
      monto: body.monto,
      hashSha256: hashFactura({ empresaId, proveedorId: body.proveedorId, numero: body.numero, monto: body.monto }),
      origen: body.origen ?? "MANUAL",
      cargadaPorId: req.usuario!.id,
    },
  });
  await prisma.auditLog.create({
    data: { empresaId, entidad: "factura", entidadId: factura.id, accion: "cargada", actorId: req.usuario!.id },
  });
  return reply.code(201).send(factura);
});

// Importación CSV: filas ya parseadas por el cliente (numero, proveedor, monto, ocNumero?).
app.post("/api/facturas/lote", { preHandler: auth }, async (req, reply) => {
  const { filas } = (req.body ?? {}) as {
    filas?: { numero?: string; proveedor?: string; monto?: number; ocNumero?: string }[];
  };
  if (!Array.isArray(filas) || filas.length === 0) {
    return reply.code(400).send({ error: "se esperaba { filas: [...] }" });
  }
  const empresaId = req.usuario!.empresaId;
  const errores: { fila: number; numero: string; motivo: string }[] = [];
  let creadas = 0;

  for (const [i, fila] of filas.entries()) {
    const nro = String(fila.numero ?? "").trim();
    const provNombre = String(fila.proveedor ?? "").trim();
    const monto = Number(fila.monto);
    const filaN = i + 1;
    if (!nro || !provNombre || !monto || monto <= 0) {
      errores.push({ fila: filaN, numero: nro || "—", motivo: "faltan datos o monto inválido" });
      continue;
    }
    const proveedor = await prisma.proveedor.findFirst({
      where: { empresaId, nombre: provNombre, activo: true },
    });
    if (!proveedor) {
      errores.push({ fila: filaN, numero: nro, motivo: `proveedor "${provNombre}" no existe` });
      continue;
    }
    const duplicada = await prisma.factura.findFirst({
      where: { empresaId, proveedorId: proveedor.id, numero: nro },
    });
    if (duplicada) {
      errores.push({ fila: filaN, numero: nro, motivo: "duplicada" });
      continue;
    }
    let ordenCompraId: string | undefined;
    if (fila.ocNumero) {
      const oc = await prisma.ordenCompra.findFirst({
        where: { empresaId, proveedorId: proveedor.id, numero: String(fila.ocNumero).trim() },
      });
      if (!oc) {
        errores.push({ fila: filaN, numero: nro, motivo: `OC "${fila.ocNumero}" no encontrada` });
        continue;
      }
      ordenCompraId = oc.id;
    }
    const factura = await prisma.factura.create({
      data: {
        empresaId,
        proveedorId: proveedor.id,
        ordenCompraId,
        numero: nro,
        monto,
        hashSha256: hashFactura({ empresaId, proveedorId: proveedor.id, numero: nro, monto }),
        origen: "CSV",
        cargadaPorId: req.usuario!.id,
      },
    });
    await prisma.auditLog.create({
      data: { empresaId, entidad: "factura", entidadId: factura.id, accion: "cargada", actorId: req.usuario!.id },
    });
    creadas++;
  }
  return { creadas, errores };
});

// ---------- Empresa + Multisig Squads (RF-05) ----------

const soloFirmantes = requireRoles(prisma, ["ADMIN", "JEFE", "SUPERVISOR"]);

// Las instrucciones que devuelven estos endpoints se firman con la wallet
// conectada en el front. La API nunca firma: solo construye y registra.

const firmantesDeLaEmpresa = async (empresaId: string) => {
  const firmantes = await prisma.usuario.findMany({
    where: { empresaId, rol: { in: ["ADMIN", "JEFE", "SUPERVISOR"] }, activo: true, walletPubkey: { not: null } },
    select: { walletPubkey: true },
  });
  return firmantes.map((f) => f.walletPubkey!);
};

const requiereMultisig = async (empresaId: string) => {
  const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
  return empresa?.multisigAddress ?? null;
};

const walletDeMiembro = async (req: { usuario?: import("@prisma/client").Usuario }, multisigAddress: string) => {
  const wallet = req.usuario!.walletPubkey;
  if (!wallet) throw Object.assign(new Error("conectá y vinculá tu wallet Phantom primero"), { statusCode: 400 });
  const { miembros } = await leerMiembrosMultisig(multisigAddress);
  if (!miembros.includes(wallet)) {
    throw Object.assign(new Error("tu wallet no es miembro del multisig de la empresa"), { statusCode: 403 });
  }
  return wallet;
};

app.get("/api/empresa", { preHandler: auth }, async (req) => {
  const empresa = await prisma.empresa.findUnique({ where: { id: req.usuario!.empresaId } });
  const firmantes = await prisma.usuario.findMany({
    where: { empresaId: empresa!.id, rol: { in: ["ADMIN", "JEFE", "SUPERVISOR"] }, activo: true },
    select: { id: true, nombre: true, rol: true, walletPubkey: true },
  });
  let multisig = null;
  if (empresa?.multisigAddress) {
    try { multisig = await leerMiembrosMultisig(empresa.multisigAddress); } catch { /* RPC caído */ }
  }
  return { ...empresa, firmantes, multisig };
});

// Paso 1: construir instrucciones para crear el multisig (ADMIN)
app.post("/api/empresa/multisig/crear-info", { preHandler: soloAdmin }, async (req, reply) => {
  const empresaId = req.usuario!.empresaId;
  if (await requiereMultisig(empresaId)) return reply.code(409).send({ error: "la empresa ya tiene multisig" });
  if (!req.usuario!.walletPubkey) {
    return reply.code(400).send({ error: "conectá y vinculá tu wallet Phantom primero (tu wallet es miembro del multisig)" });
  }
  const firmantes = await firmantesDeLaEmpresa(empresaId);
  if (firmantes.length < 2) {
    return reply.code(400).send({
      error: `se necesitan al menos 2 firmantes con wallet vinculada (hay ${firmantes.length}). Que jefe y supervisor conecten su Phantom.`,
    });
  }
  return infoCrearMultisig(firmantes, req.usuario!.walletPubkey);
});

// Paso 2: confirmar que el multisig quedó creado on-chain
app.post("/api/empresa/multisig/confirmar", { preHandler: soloAdmin }, async (req, reply) => {
  const { multisigAddress, txSignature } = (req.body ?? {}) as { multisigAddress?: string; txSignature?: string };
  if (!multisigAddress || !txSignature) return reply.code(400).send({ error: "faltan multisigAddress y txSignature" });
  try {
    await leerMiembrosMultisig(multisigAddress);
  } catch {
    return reply.code(400).send({ error: "el multisig no existe todavía en devnet — esperá la confirmación de la tx" });
  }
  const empresa = await prisma.empresa.update({
    where: { id: req.usuario!.empresaId },
    data: { multisigAddress },
  });
  await prisma.auditLog.create({
    data: { empresaId: empresa.id, entidad: "propuesta", entidadId: multisigAddress, accion: "multisig_creado", actorId: req.usuario!.id, txSignature },
  });
  return empresa;
});

// Paso 3: proponer el pago de una factura (cualquier miembro)
app.post("/api/facturas/:id/propuesta-info", { preHandler: soloFirmantes }, async (req, reply) => {
  const { id } = req.params as { id: string };
  const factura = await prisma.factura.findFirst({
    where: { id, empresaId: req.usuario!.empresaId },
    include: { proveedor: true, propuesta: true },
  });
  if (!factura) return reply.code(404).send({ error: "factura no encontrada" });
  if (factura.estado !== "CARGADA") return reply.code(409).send({ error: `la factura está en estado ${factura.estado}` });
  if (factura.propuesta) return reply.code(409).send({ error: "la factura ya tiene propuesta" });
  const multisigAddress = await requiereMultisig(req.usuario!.empresaId);
  if (!multisigAddress) return reply.code(400).send({ error: "la empresa no tiene multisig configurado" });
  const wallet = await walletDeMiembro(req, multisigAddress);
  return infoPropuestaPago({
    multisigAddress,
    creador: wallet,
    destinoWallet: factura.proveedor.walletUsdc,
    montoUsd: factura.monto,
    facturaHash: factura.hashSha256,
  });
});

app.post("/api/facturas/:id/propuesta-confirmar", { preHandler: soloFirmantes }, async (req, reply) => {
  const { id } = req.params as { id: string };
  const { transactionIndex, txSignature } = (req.body ?? {}) as { transactionIndex?: number; txSignature?: string };
  if (transactionIndex == null || !txSignature) return reply.code(400).send({ error: "faltan transactionIndex y txSignature" });
  const factura = await prisma.factura.findFirst({ where: { id, empresaId: req.usuario!.empresaId } });
  const multisigAddress = await requiereMultisig(req.usuario!.empresaId);
  if (!factura || !multisigAddress) return reply.code(404).send({ error: "factura o multisig no encontrado" });

  const propuesta = await prisma.propuestaMultisig.create({
    data: { facturaId: id, multisigAddress, proposalIndex: transactionIndex },
  });
  await prisma.factura.update({ where: { id }, data: { estado: "EN_APROBACION" } });
  await prisma.auditLog.create({
    data: { empresaId: factura.empresaId, entidad: "propuesta", entidadId: propuesta.id, accion: "propuesta_creada", actorId: req.usuario!.id, txSignature },
  });
  return reply.code(201).send(propuesta);
});

// Paso 4: aprobar (cada firmante firma on-chain)
app.post("/api/facturas/:id/aprobar-info", { preHandler: soloFirmantes }, async (req, reply) => {
  const { id } = req.params as { id: string };
  const factura = await prisma.factura.findFirst({
    where: { id, empresaId: req.usuario!.empresaId },
    include: { propuesta: { include: { firmas: true } } },
  });
  if (!factura?.propuesta) return reply.code(404).send({ error: "la factura no tiene propuesta" });
  if (factura.propuesta.estado === "EJECUTADA") return reply.code(409).send({ error: "la propuesta ya se ejecutó" });
  const wallet = await walletDeMiembro(req, factura.propuesta.multisigAddress);
  if (factura.propuesta.firmas.some((f) => f.usuarioId === req.usuario!.id)) {
    return reply.code(409).send({ error: "ya firmaste esta propuesta" });
  }
  return infoAprobar({ multisigAddress: factura.propuesta.multisigAddress, miembro: wallet, transactionIndex: factura.propuesta.proposalIndex });
});

app.post("/api/facturas/:id/aprobar-confirmar", { preHandler: soloFirmantes }, async (req, reply) => {
  const { id } = req.params as { id: string };
  const { txSignature } = (req.body ?? {}) as { txSignature?: string };
  if (!txSignature) return reply.code(400).send({ error: "falta txSignature" });
  const factura = await prisma.factura.findFirst({
    where: { id, empresaId: req.usuario!.empresaId },
    include: { propuesta: true },
  });
  if (!factura?.propuesta) return reply.code(404).send({ error: "la factura no tiene propuesta" });

  const firma = await prisma.firma.create({
    data: { propuestaId: factura.propuesta.id, usuarioId: req.usuario!.id, txSignature },
  });
  await prisma.auditLog.create({
    data: { empresaId: factura.empresaId, entidad: "propuesta", entidadId: factura.propuesta.id, accion: "firmada", actorId: req.usuario!.id, txSignature },
  });

  // Estado real on-chain: ¿llegó al umbral?
  const onchain = await leerPropuesta(factura.propuesta.multisigAddress, factura.propuesta.proposalIndex);
  if (onchain.aprobada) {
    await prisma.propuestaMultisig.update({ where: { id: factura.propuesta.id }, data: { estado: "UMBRAL_ALCANZADO" } });
    await prisma.factura.update({ where: { id }, data: { estado: "APROBADA" } });
  }
  return reply.code(201).send({ firma, onchain });
});

// Paso 5: ejecutar — RF-06: el agente verifica la factura ANTES de devolver la instrucción
app.post("/api/facturas/:id/ejecutar-info", { preHandler: soloFirmantes }, async (req, reply) => {
  const { id } = req.params as { id: string };
  const factura = await prisma.factura.findFirst({
    where: { id, empresaId: req.usuario!.empresaId },
    include: { proveedor: true, ordenCompra: true, propuesta: { include: { firmas: true } } },
  });
  if (!factura?.propuesta) return reply.code(404).send({ error: "la factura no tiene propuesta" });
  if (factura.propuesta.estado !== "UMBRAL_ALCANZADO" && factura.propuesta.estado !== "PENDIENTE") {
    return reply.code(409).send({ error: `la propuesta está ${factura.propuesta.estado}` });
  }

  const onchain = await leerPropuesta(factura.propuesta.multisigAddress, factura.propuesta.proposalIndex);
  if (!onchain.aprobada) return reply.code(409).send({ error: "la propuesta todavía no alcanzó 2/3 on-chain" });

  // --- RF-06: verificación del agente ---
  const duplicadas = await prisma.factura.count({
    where: { empresaId: factura.empresaId, proveedorId: factura.proveedorId, numero: factura.numero, NOT: { id: factura.id } },
  });
  const checks = {
    ocCoincide: factura.ordenCompraId ? factura.ordenCompra !== null && factura.monto <= factura.ordenCompra.monto : true,
    proveedorRegistrado: factura.proveedor.activo,
    montoOk: factura.monto > 0,
    sinDuplicados: duplicadas === 0,
  };
  const ok = Object.values(checks).every(Boolean);
  await prisma.verificacion.create({
    data: { facturaId: id, resultado: ok ? "OK" : "RECHAZADA", checks, detalle: ok ? null : "la factura no pasó la verificación" },
  });
  if (!ok) {
    await prisma.factura.update({ where: { id }, data: { estado: "VERIFICACION_FALLIDA" } });
    return reply.code(422).send({ error: "la verificación del agente falló", checks });
  }
  // --- fin RF-06 ---

  const wallet = await walletDeMiembro(req, factura.propuesta.multisigAddress);
  const info = await infoEjecutar({
    multisigAddress: factura.propuesta.multisigAddress,
    miembro: wallet,
    transactionIndex: factura.propuesta.proposalIndex,
  });
  return { ...info, checks };
});

app.post("/api/facturas/:id/ejecutar-confirmar", { preHandler: soloFirmantes }, async (req, reply) => {
  const { id } = req.params as { id: string };
  const { txSignature } = (req.body ?? {}) as { txSignature?: string };
  if (!txSignature) return reply.code(400).send({ error: "falta txSignature" });
  const factura = await prisma.factura.findFirst({
    where: { id, empresaId: req.usuario!.empresaId },
    include: { proveedor: true, propuesta: true },
  });
  if (!factura?.propuesta) return reply.code(404).send({ error: "la factura no tiene propuesta" });

  const pago = await prisma.pago.create({
    data: {
      facturaId: id,
      propuestaId: factura.propuesta.id,
      montoUsdc: factura.monto,
      destinoWallet: factura.proveedor.walletUsdc,
      txSignature,
      memo: `logis:factura:${factura.hashSha256}`,
      estado: "CONFIRMADO",
      confirmedAt: new Date(),
    },
  });
  await prisma.propuestaMultisig.update({ where: { id: factura.propuesta.id }, data: { estado: "EJECUTADA" } });
  await prisma.factura.update({ where: { id }, data: { estado: "PAGADA" } });
  await prisma.auditLog.create({
    data: { empresaId: factura.empresaId, entidad: "pago", entidadId: pago.id, accion: "pagada", actorId: req.usuario!.id, txSignature },
  });
  return reply.code(201).send(pago);
});

// ---------- Conciliación (RF-08) ----------

app.get("/api/conciliacion", { preHandler: auth }, async (req) => {
  const empresaId = req.usuario!.empresaId;
  const [facturas, pagos] = await Promise.all([
    prisma.factura.groupBy({ by: ["estado"], where: { empresaId }, _count: true }),
    prisma.pago.findMany({
      where: { factura: { empresaId } },
      include: { factura: { include: { proveedor: { select: { nombre: true, pais: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const conteo = Object.fromEntries(facturas.map((f) => [f.estado, f._count]));
  const resumen = {
    totalFacturas: facturas.reduce((a, f) => a + f._count, 0),
    enAprobacion: (conteo.EN_APROBACION ?? 0) + (conteo.CARGADA ?? 0),
    aprobadas: conteo.APROBADA ?? 0,
    pagadas: conteo.PAGADA ?? 0,
    conProblemas: (conteo.RECHAZADA ?? 0) + (conteo.VERIFICACION_FALLIDA ?? 0),
    totalPagadoUsdc: pagos.reduce((a, p) => a + p.montoUsdc, 0),
  };
  return { resumen, pagos };
});

// ---------- Auditoría (RF-09) ----------

app.get("/api/audit-log", { preHandler: auth }, async (req) => {
  const logs = await prisma.auditLog.findMany({
    where: { empresaId: req.usuario!.empresaId },
    include: { actor: { select: { nombre: true, rol: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return logs;
});

const port = Number(process.env.PORT ?? 3001);
await app.listen({ port, host: "0.0.0.0" });
