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

export interface Verificacion {
  id: string;
  facturaId: string;
  resultado: ResultadoVerificacion;
  checks: ChecksVerificacion;
  detalle: string | null;
  createdAt: string;
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

// POST /api/auth/login
export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

// GET /api/auth/me -> Usuario
// POST /api/auth/logout -> 204 (header Authorization: Bearer <token>)

// POST /api/usuarios (solo ADMIN)
export interface CrearUsuarioBody {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  walletPubkey?: string;
}

// PUT /api/usuarios/me/wallet — vincula la wallet firmante (RF-02)
export interface VincularWalletBody {
  walletPubkey: string;
}

// POST /api/proveedores
export type CrearProveedorBody = Omit<Proveedor, "id" | "empresaId" | "activo">;

// PATCH /api/proveedores/:id
export type ActualizarProveedorBody = Partial<CrearProveedorBody & { activo: boolean }>;

// POST /api/facturas — hashSha256 lo calcula el servidor; cargadaPorId sale de la sesión
export interface CrearFacturaBody {
  proveedorId: string;
  ordenCompraId?: string;
  numero: string;
  monto: number;
  origen?: "MANUAL" | "CSV";
}

// POST /api/facturas/lote — importación CSV (RF-04)
// Formato CSV: numero,proveedor,monto[,oc_numero]  (proveedor = nombre exacto)
export interface FilaFacturaCsv {
  numero: string;
  proveedor: string;
  monto: number;
  ocNumero?: string;
}

export interface LoteFacturasBody {
  filas: FilaFacturaCsv[];
}

export interface LoteFacturasResultado {
  creadas: number;
  errores: { fila: number; numero: string; motivo: string }[];
}

// POST /api/ordenes-compra
export interface CrearOrdenCompraBody {
  proveedorId: string;
  numero: string;
  monto: number;
}

// GET /api/facturas -> FacturaConEstado[]
export interface FacturaConEstado extends Factura {
  proveedorNombre: string;
  firmasCount: number;
  verificacion?: Verificacion | null;
  pago?: Pago | null;
}
