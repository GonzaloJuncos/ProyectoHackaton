import { scryptSync, randomBytes, timingSafeEqual, randomUUID } from "node:crypto";
import type { PrismaClient, Usuario } from "@prisma/client";
import type { FastifyRequest, FastifyReply } from "fastify";

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
};

export const verifyPassword = (password: string, stored: string) => {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  return timingSafeEqual(candidate, Buffer.from(hash, "hex"));
};

const SESION_HORAS = 12;

export const crearSesion = (prisma: PrismaClient, usuarioId: string) =>
  prisma.sesion.create({
    data: {
      token: randomUUID(),
      usuarioId,
      expiresAt: new Date(Date.now() + SESION_HORAS * 60 * 60 * 1000),
    },
  });

/** Lee el Bearer token, devuelve el usuario o null. */
export const usuarioDesdeRequest = async (prisma: PrismaClient, req: FastifyRequest) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  const sesion = await prisma.sesion.findUnique({
    where: { token: header.slice(7) },
    include: { usuario: true },
  });
  if (!sesion || sesion.expiresAt < new Date() || !sesion.usuario.activo) return null;
  return sesion.usuario;
};

declare module "fastify" {
  interface FastifyRequest {
    usuario?: Usuario;
  }
}

/** preHandler: exige sesión válida. */
export const requireAuth = (prisma: PrismaClient) => async (req: FastifyRequest, reply: FastifyReply) => {
  const usuario = await usuarioDesdeRequest(prisma, req);
  if (!usuario) return reply.code(401).send({ error: "sesión inválida o expirada" });
  req.usuario = usuario;
};

/** preHandler: exige sesión + uno de los roles dados (RF-01). */
export const requireRoles = (prisma: PrismaClient, roles: string[]) => async (req: FastifyRequest, reply: FastifyReply) => {
  const usuario = await usuarioDesdeRequest(prisma, req);
  if (!usuario) return reply.code(401).send({ error: "sesión inválida o expirada" });
  if (!roles.includes(usuario.rol)) return reply.code(403).send({ error: `requiere rol: ${roles.join(" o ")}` });
  req.usuario = usuario;
};
