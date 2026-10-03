// Contratos compartidos entre apps/web y apps/api.
// Regla del equipo: ningún endpoint se implementa antes de estar declarado acá.

// ---------- Enums (SQLite no soporta enums en Prisma: se guardan como string) ----------

export const ROLES = ["ADMIN", "JEFE", "SUPERVISOR", "EMPLEADO"] as const;
export type Rol = (typeof ROLES)[number];

/** Roles que pueden firmar aprobaciones del multisig (RF-05). */
export const ROLES_FIRMANTES: Rol[] = ["ADMIN", "JEFE", "SUPERVISOR"];

export const ESTADOS_ORDEN_COMPRA = ["ABIERTA", "CERRADA", "ANULADA"] as const;
export type EstadoOrdenCompra = (typeof ESTADOS_ORDEN_COMPRA)[number];

export const ESTADOS_FACTURA = [
  "CARGADA",
  "EN_APROBACION",
  "APROBADA",
  "VERIFICACION_FALLIDA",
  "RECHAZADA",
  "PAGADA",
] as const;
export type EstadoFactura = (typeof ESTADOS_FACTURA)[number];

export const ESTADOS_PROPUESTA = [
  "PENDIENTE",
  "UMBRAL_ALCANZADO",
  "EJECUTADA",
  "RECHAZADA",
  "CANCELADA",
] as const;
export type EstadoPropuesta = (typeof ESTADOS_PROPUESTA)[number];

export const ESTADOS_PAGO = ["PENDIENTE", "ENVIADO", "CONFIRMADO", "FALLIDO"] as const;
export type EstadoPago = (typeof ESTADOS_PAGO)[number];

export const RESULTADOS_VERIFICACION = ["OK", "RECHAZADA"] as const;
export type ResultadoVerificacion = (typeof RESULTADOS_VERIFICACION)[number];

// ---------- Constantes de red ----------

export const SOLANA_CLUSTER = "devnet" as const;
export const USDC_DECIMALS = 6;
export const MULTISIG_UMBRAL = 2;
export const MULTISIG_FIRMANTES = 3;

// ---------- Tipos de entidades (shape de API) ----------

export interface Usuario {
  id: string;
  empresaId: string;
  nombre: string;
  email: string;
  rol: Rol;
  walletPubkey: string | null;
  activo: boolean;
}

export interface Proveedor {
  id: string;
  empresaId: string;
  nombre: string;
  cuitOTaxId: string | null;
  pais: string;
  email: string | null;
  walletUsdc: string;
  activo: boolean;
}

export interface OrdenCompra {
  id: string;
  empresaId: string;
  proveedorId: string;
  numero: string;
  monto: number;
  moneda: string;
  estado: EstadoOrdenCompra;
}

export interface Factura {
  id: string;
  empresaId: string;
  proveedorId: string;
  ordenCompraId: string | null;
  numero: string;
  monto: number;
  moneda: string;
  hashSha256: string;
  estado: EstadoFactura;
  cargadaPorId: string;
  origen: "MANUAL" | "CSV";
  createdAt: string;
}

export interface ChecksVerificacion {
  ocCoincide: boolean;
  proveedorRegistrado: boolean;
  montoOk: boolean;
  sinDuplicados: boolean;
}

export interface Pago {
  id: string;
  facturaId: string;
  propuestaId: string;
  montoUsdc: number;
  destinoWallet: string;
  txSignature: string | null;
  memo: string | null;
  estado: EstadoPago;
}

// ---------- Contratos de API ----------

export interface ApiError {
  error: string;
  detalle?: string;
}

// POST /api/proveedores
export type CrearProveedorBody = Omit<Proveedor, "id" | "activo">;

// POST /api/facturas
export interface CrearFacturaBody {
  proveedorId: string;
  ordenCompraId?: string;
  numero: string;
  monto: number;
  hashSha256: string;
  cargadaPorId: string;
  origen?: "MANUAL" | "CSV";
}

// GET /api/facturas -> FacturaConEstado[]
export interface FacturaConEstado extends Factura {
  proveedorNombre: string;
  firmasCount: number;
  pago?: Pago | null;
}
