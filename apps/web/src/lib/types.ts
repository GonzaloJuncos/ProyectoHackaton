// Contratos y Tipos de Logis

export type Rol = "administrador" | "jefe" | "supervisor" | "empleado";

export type TabSeccion =
  | "inicio"
  | "proveedores"
  | "pagos"
  | "blockchain"
  | "reportes"
  | "configuracion"
  | "facturas" // alias de pagos
  | "conciliacion"; // alias de blockchain

export interface Usuario {
  email: string;
  password: string;
  nombre: string;
  rol: Rol;
}

export type EstadoPagoProveedor = "al_dia" | "pendiente" | "vencido" | "en_revision";

export interface HistorialPagoItem {
  fecha: string;
  monto: number;
  moneda: string;
  estado: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  rubro?: string;
  provincia?: string;
  pais: string;
  cuit?: string;
  email?: string;
  telefono?: string;
  wallet: string; // dirección USDC devnet
  facturasCount?: number;
  totalFacturado?: number;
  deudaPendiente?: number;
  moneda?: "ARS" | "USD" | "USDC";
  proximoVencimiento?: string;
  estadoPago?: EstadoPagoProveedor;
  pagos: number;
  totalUSDC: number;
  activo: boolean;
  historialPagos?: HistorialPagoItem[];
}

export type EstadoFactura = "pendiente" | "aprobada" | "pagada" | "rechazada";

export interface VerificacionAgente {
  ocValida: boolean;
  proveedorValido: boolean;
  sinDuplicados: boolean;
  montoValido: boolean;
  estado: "pendiente" | "auditando" | "aprobado" | "rechazado";
  detalles?: string;
}

export interface Factura {
  id: string;
  numeroOC: string;
  proveedorId: string;
  montoUSDC: number;
  descripcion: string;
  estado: EstadoFactura;
  firmas: string[];
  txHash?: string;
  facturaHash?: string;
  fecha?: string;
  verificacionAgente?: VerificacionAgente;
}

export type EstadoTx = "completada" | "en_proceso";

export interface Transaccion {
  id: string;
  fecha: string;
  proveedorId: string;
  montoUSDC: number;
  estado: EstadoTx;
  txHash: string;
  facturaOC?: string;
  memoHash?: string;
}

export type MetodoPagoTipo = "Transferencia" | "Mercado Pago" | "USDC/Cripto";
export type EstadoItemPago = "pagado" | "pendiente" | "vencido";

export interface ItemPago {
  id: string;
  fecha: string;
  proveedorNombre: string;
  proveedorIniciales: string;
  colorAvatar?: string;
  facturaRef: string;
  monto: number;
  moneda: string;
  metodoPago: MetodoPagoTipo;
  estado: EstadoItemPago;
}

export interface Kpi {
  titulo: string;
  valor: string;
  variacion: string;
  positiva: boolean;
}
