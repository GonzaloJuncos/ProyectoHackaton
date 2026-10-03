// Contratos de Logis — cuando `packages/shared` exista, estos tipos se importan de ahí.
export type Rol = "administrador" | "jefe" | "supervisor" | "empleado";

export interface Proveedor {
  id: string;
  nombre: string;
  pais: string;
  wallet: string; // dirección USDC destino
}

export type EstadoFactura = "pendiente" | "aprobada" | "pagada" | "rechazada";

export interface Factura {
  id: string;
  numeroOC: string; // orden de compra
  proveedorId: string;
  montoUSDC: number;
  descripcion: string;
  estado: EstadoFactura;
  firmas: string[]; // roles que firmaron (máx. 2 de 3 para liberar)
  txHash?: string; // hash de la transacción on-chain cuando se paga
}
