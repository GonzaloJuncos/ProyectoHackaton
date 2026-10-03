import { Factura, Kpi, Proveedor, Transaccion, Usuario } from "./types";

// ---- Datos base de Logis (mock) ----

export const USUARIOS_MOCK: Usuario[] = [
  { email: "admin@logis.io", password: "demo123", nombre: "Luli Maris", rol: "administrador" },
  { email: "jefe@logis.io", password: "demo123", nombre: "Gonzalo Juncos", rol: "jefe" },
  { email: "super@logis.io", password: "demo123", nombre: "Maxi Pérez", rol: "supervisor" },
  { email: "empleado@logis.io", password: "demo123", nombre: "Luz García", rol: "empleado" },
];

export const PROVEEDORES_MOCK: Proveedor[] = [
  { id: "p1", nombre: "Petróleo S.A.", pais: "Argentina", wallet: "7xKX...dE9w", pagos: 5, totalUSDC: 8450, activo: true },
  { id: "p2", nombre: "Menta SRL", pais: "Argentina", wallet: "B4mN...k2Rt", pagos: 3, totalUSDC: 4120, activo: true },
  { id: "p3", nombre: "Tinta Global", pais: "China", wallet: "9qPz...vF5a", pagos: 7, totalUSDC: 3980, activo: true },
  { id: "p4", nombre: "Fondo Oscuro", pais: "Chile", wallet: "2wYu...mN8c", pagos: 2, totalUSDC: 2870, activo: true },
];

export const FACTURAS_MOCK: Factura[] = [
  { id: "f1", numeroOC: "OC-1042", proveedorId: "p3", montoUSDC: 4850, descripcion: "Componentes lote marzo", estado: "pendiente", firmas: [] },
  { id: "f2", numeroOC: "OC-1043", proveedorId: "p4", montoUSDC: 1200, descripcion: "Flete internacional", estado: "pendiente", firmas: ["jefe"] },
  { id: "f3", numeroOC: "OC-1039", proveedorId: "p1", montoUSDC: 3200, descripcion: "Insumos trimestre", estado: "pagada", firmas: ["jefe", "supervisor"], txHash: "5Kt7xYzQn8mVb2Lp9RwFe4HsD6uJc1Ga3Ti7oBkZ" },
  { id: "f4", numeroOC: "OC-1035", proveedorId: "p2", montoUSDC: 1750, descripcion: "Servicios mayo", estado: "pagada", firmas: ["jefe", "administrador"], txHash: "3Hm9pQrT5xNv8Wc2Kf7LsE4yBd1Ug6Za9Mi0oVjX" },
  { id: "f5", numeroOC: "OC-1033", proveedorId: "p4", montoUSDC: 980, descripcion: "Flete regional", estado: "rechazada", firmas: ["jefe", "supervisor"] },
];

export const TXS_MOCK: Transaccion[] = [
  { id: "t1", fecha: "2025-06-12", proveedorId: "p1", montoUSDC: 3200, estado: "completada", txHash: "5Kt7xYzQn8mVb2Lp9RwFe4HsD6uJc1Ga3Ti7oBkZ" },
  { id: "t2", fecha: "2025-06-10", proveedorId: "p2", montoUSDC: 1750, estado: "completada", txHash: "3Hm9pQrT5xNv8Wc2Kf7LsE4yBd1Ug6Za9Mi0oVjX" },
  { id: "t3", fecha: "2025-06-08", proveedorId: "p3", montoUSDC: 980, estado: "en_proceso", txHash: "8Fn2wAeC7xRt4Yb9Kp3LmV6sJd1Qg5Hu0iZoNcXz" },
  { id: "t4", fecha: "2025-06-05", proveedorId: "p4", montoUSDC: 2400, estado: "completada", txHash: "6Qw8rTyU3iOp1As4Df7Gh0Jk2Lz9Xc5Vb8Nm4EwR" },
];

export const KPIS_MOCK: Kpi[] = [
  { titulo: "Proveedores activos", valor: "24", variacion: "+12% vs. mes anterior", positiva: true },
  { titulo: "Pagos realizados", valor: "$18,450.00 USDC", variacion: "+28%", positiva: true },
  { titulo: "Transacciones en blockchain", valor: "87", variacion: "+17%", positiva: true },
  { titulo: "Fondos en custodia", valor: "$24,530.00 USDC", variacion: "+33%", positiva: true },
];

// Barras del gráfico "Pagos en USDC" (Ene–Jun)
export const PAGOS_POR_MES = [
  { mes: "Ene", valor: 4200 },
  { mes: "Feb", valor: 7300 },
  { mes: "Mar", valor: 11800 },
  { mes: "Abr", valor: 9100 },
  { mes: "May", valor: 5600 },
  { mes: "Jun", valor: 14100 },
];

export const BILLETERA = { balanceUSDC: 24530, red: "Solana · devnet" };
