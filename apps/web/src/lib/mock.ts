import { Factura, Proveedor } from "./types";

export const PROVEEDORES_MOCK: Proveedor[] = [
  { id: "p1", nombre: "Shenzhen Parts Co.", pais: "China", wallet: "7xKX...dE9w" },
  { id: "p2", nombre: "Logística Andina S.A.", pais: "Chile", wallet: "B4mN...k2Rt" },
  { id: "p3", nombre: "Insumos del Litoral", pais: "Argentina", wallet: "9qPz...vF5a" },
];

export const FACTURAS_MOCK: Factura[] = [
  { id: "f1", numeroOC: "OC-1042", proveedorId: "p1", montoUSDC: 4850, descripcion: "Componentes lote marzo", estado: "pendiente", firmas: [] },
  { id: "f2", numeroOC: "OC-1043", proveedorId: "p2", montoUSDC: 1200, descripcion: "Flete internacional", estado: "pendiente", firmas: ["jefe"] },
  { id: "f3", numeroOC: "OC-1039", proveedorId: "p1", montoUSDC: 9320, descripcion: "Componentes lote febrero", estado: "pagada", firmas: ["jefe", "supervisor"], txHash: "5Kt7xYz..." },
  { id: "f4", numeroOC: "OC-1035", proveedorId: "p3", montoUSDC: 640, descripcion: "Packaging mensual", estado: "rechazada", firmas: ["jefe", "supervisor"] },
];
