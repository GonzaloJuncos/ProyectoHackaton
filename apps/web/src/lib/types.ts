// Contratos de Logis — cuando `packages/shared` exista, estos tipos se importan de ahí.
export type Rol = "administrador" | "jefe" | "supervisor" | "empleado";

export interface Proveedor {
  id: string;
  nombre: string;
  pais: string;
  wallet: string; // dirección USDC destino
  pagos: number; // cantidad de pagos históricos
  totalUSDC: number; // total pagado histórico
  activo: boolean;
}

export type EstadoFactura = "pendiente" | "aprobada" | "pagada" | "rechazada";

export interface Factura {
  id: string;
  numeroOC: string; // orden de compra
  proveedorId: string;
  montoUSDC: number;
  descripcion: string;
  estado: EstadoFactura;
  firmas: string[]; // roles que firmaron (2 de 3 para liberar)
  txHash?: string; // hash de la transacción on-chain cuando se paga
}

export type EstadoTx = "completada" | "en_proceso";

export interface Transaccion {
  id: string;
  fecha: string; // ISO
  proveedorId: string;
  montoUSDC: number;
  estado: EstadoTx;
  txHash: string;
}

export interface Kpi {
  titulo: string;
  valor: string;
  variacion: string; // ej. "+12%"
  positiva: boolean;
}
