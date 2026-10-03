"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  BILLETERA,
  FACTURAS_MOCK,
  PAGOS_MOCK,
  PROVEEDORES_MOCK,
  TXS_MOCK,
  USUARIOS_MOCK,
} from "@/lib/mock";
import {
  Factura,
  ItemPago,
  Proveedor,
  Rol,
  TabSeccion,
  Transaccion,
} from "@/lib/types";

interface AppContextType {
  tab: TabSeccion;
  setTab: (tab: TabSeccion) => void;
  rol: Rol;
  setRol: (rol: Rol) => void;
  nombreUsuario: string;
  proveedores: Proveedor[];
  proveedorSeleccionado: Proveedor | null;
  setProveedorSeleccionado: (p: Proveedor | null) => void;
  agregarProveedor: (p: { nombre: string; pais: string; wallet: string; cuit?: string; rubro?: string; provincia?: string }) => void;
  facturas: Factura[];
  agregarFactura: (f: {
    numeroOC: string;
    proveedorId: string;
    montoUSDC: number;
    descripcion: string;
    facturaHash?: string;
  }) => void;
  importarFacturasCSV: (
    items: Array<{
      numeroOC: string;
      proveedorId: string;
      montoUSDC: number;
      descripcion: string;
    }>
  ) => void;
  pagos: ItemPago[];
  registrarNuevoPago: (pago: Omit<ItemPago, "id">) => void;
  firmarFactura: (id: string) => void;
  ejecutarPago: (id: string) => void;
  transacciones: Transaccion[];
  billetera: { balanceUSDC: number; red: string };
  facturaSeleccionada: Factura | null;
  setFacturaSeleccionada: (f: Factura | null) => void;
  modalNuevaFacturaAbierto: boolean;
  setModalNuevaFacturaAbierto: (open: boolean) => void;
  toast: string | null;
  notificar: (mensaje: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generador de hash SHA-256 simulado para devnet memo
const generarHashMock = () => {
  const chars = "0123456789abcdef";
  let hash = "";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

// Generador de firma de tx devnet simulada (88 caracteres base58)
const generarTxDevnet = () => {
  const b58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let tx = "";
  for (let i = 0; i < 64; i++) {
    tx += b58[Math.floor(Math.random() * b58.length)];
  }
  return tx;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTabState] = useState<TabSeccion>("proveedores");
  const [rol, setRolState] = useState<Rol>("administrador");
  const [nombreUsuario, setNombreUsuario] = useState("Luli Maris");
  const [proveedores, setProveedores] = useState<Proveedor[]>(PROVEEDORES_MOCK);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(PROVEEDORES_MOCK[0]);
  const [facturas, setFacturas] = useState<Factura[]>(FACTURAS_MOCK);
  const [pagos, setPagos] = useState<ItemPago[]>(PAGOS_MOCK);
  const [transacciones, setTransacciones] = useState<Transaccion[]>(TXS_MOCK);
  const [billetera, setBilletera] = useState(BILLETERA);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [modalNuevaFacturaAbierto, setModalNuevaFacturaAbierto] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Sincronizar tab con URL search param si existe al inicio
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as TabSeccion | null;
      if (tabParam) {
        if (tabParam === "facturas") setTabState("pagos");
        else if (tabParam === "conciliacion") setTabState("blockchain");
        else setTabState(tabParam);
      }

      const rolGuardado = localStorage.getItem("logis-rol") as Rol | null;
      if (rolGuardado) {
        setRolState(rolGuardado);
        const usr = USUARIOS_MOCK.find((u) => u.rol === rolGuardado);
        if (usr) setNombreUsuario(usr.nombre);
      }
    }
  }, []);

  const setTab = (nuevaTab: TabSeccion) => {
    const normalized =
      nuevaTab === "facturas" ? "pagos" : nuevaTab === "conciliacion" ? "blockchain" : nuevaTab;
    setTabState(normalized);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (normalized === "proveedores") {
        url.searchParams.delete("tab");
      } else {
        url.searchParams.set("tab", normalized);
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  const setRol = (nuevoRol: Rol) => {
    setRolState(nuevoRol);
    const usr = USUARIOS_MOCK.find((u) => u.rol === nuevoRol);
    const nombre = usr?.nombre || nuevoRol;
    setNombreUsuario(nombre);
    if (typeof window !== "undefined") {
      localStorage.setItem("logis-rol", nuevoRol);
      localStorage.setItem("logis-usuario", nombre);
    }
    notificar(`Cambiado a rol: ${nuevoRol.toUpperCase()} (${nombre})`);
  };

  const notificar = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((actual) => (actual === msg ? null : actual));
    }, 4000);
  };

  const agregarProveedor = (p: {
    nombre: string;
    pais: string;
    wallet: string;
    cuit?: string;
    rubro?: string;
    provincia?: string;
  }) => {
    const nuevo: Proveedor = {
      id: `p${Date.now()}`,
      nombre: p.nombre,
      rubro: p.rubro || "Servicios generales",
      provincia: p.provincia || "Buenos Aires",
      pais: p.pais || "Argentina",
      cuit: p.cuit || "30-00000000-0",
      email: `contacto@${p.nombre.toLowerCase().replace(/[^a-z]/g, "")}.com.ar`,
      telefono: "+54 11 4000-0000",
      wallet: p.wallet,
      facturasCount: 0,
      totalFacturado: 0,
      deudaPendiente: 0,
      moneda: "ARS",
      proximoVencimiento: "30/07/2025",
      estadoPago: "al_dia",
      pagos: 0,
      totalUSDC: 0,
      activo: true,
    };
    setProveedores((prev) => [nuevo, ...prev]);
    setProveedorSeleccionado(nuevo);
    notificar(`Proveedor ${p.nombre} registrado con éxito.`);
  };

  const registrarNuevoPago = (pago: Omit<ItemPago, "id">) => {
    const nuevo: ItemPago = {
      ...pago,
      id: `pag-${Date.now()}`,
    };
    setPagos((prev) => [nuevo, ...prev]);
    notificar(`Pago de ${pago.monto.toLocaleString("es-AR")} ${pago.moneda} registrado con éxito.`);
  };

  const agregarFactura = (f: {
    numeroOC: string;
    proveedorId: string;
    montoUSDC: number;
    descripcion: string;
    facturaHash?: string;
  }) => {
    const hash = f.facturaHash || generarHashMock();
    const nueva: Factura = {
      id: `f${Date.now()}`,
      numeroOC: f.numeroOC,
      proveedorId: f.proveedorId,
      montoUSDC: f.montoUSDC,
      descripcion: f.descripcion,
      estado: "pendiente",
      firmas: [],
      fecha: new Date().toISOString().slice(0, 10),
      facturaHash: hash,
      verificacionAgente: {
        ocValida: true,
        proveedorValido: true,
        sinDuplicados: true,
        montoValido: true,
        estado: "pendiente",
        detalles: "Factura registrada. Esperando firmas multisig 2/3 para auditar.",
      },
    };
    setFacturas((prev) => [nueva, ...prev]);
    notificar(`Factura ${f.numeroOC} creada (Hash memo generado).`);
  };

  const importarFacturasCSV = (
    items: Array<{
      numeroOC: string;
      proveedorId: string;
      montoUSDC: number;
      descripcion: string;
    }>
  ) => {
    const creadas: Factura[] = items.map((item, idx) => ({
      id: `f${Date.now()}_${idx}`,
      numeroOC: item.numeroOC,
      proveedorId: item.proveedorId,
      montoUSDC: item.montoUSDC,
      descripcion: item.descripcion,
      estado: "pendiente",
      firmas: [],
      fecha: new Date().toISOString().slice(0, 10),
      facturaHash: generarHashMock(),
      verificacionAgente: {
        ocValida: true,
        proveedorValido: true,
        sinDuplicados: true,
        montoValido: true,
        estado: "pendiente",
        detalles: "Importada por CSV. Pendiente de aprobación multisig.",
      },
    }));

    setFacturas((prev) => [...creadas, ...prev]);
    notificar(`Se importaron ${items.length} facturas desde CSV.`);
  };

  const firmarFactura = (id: string) => {
    const rolesAprobadores: Rol[] = ["jefe", "supervisor", "administrador"];
    if (!rolesAprobadores.includes(rol)) {
      notificar("El rol Empleado no puede firmar aprobaciones (separación de funciones).");
      return;
    }

    setFacturas((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        if (f.firmas.includes(rol)) {
          notificar(`Ya firmaste esta factura como ${rol}.`);
          return f;
        }

        const nuevasFirmas = [...f.firmas, rol];
        const tieneQuorum = nuevasFirmas.length >= 2;

        let nuevoEstado = f.estado;
        let agenteInfo = f.verificacionAgente;

        if (tieneQuorum) {
          nuevoEstado = "aprobada";
          agenteInfo = {
            ocValida: true,
            proveedorValido: true,
            sinDuplicados: true,
            montoValido: true,
            estado: "aprobado",
            detalles: "Agente AI: Aprobación 2/3 confirmada on-chain. Factura auditada y lista para pago.",
          };
        } else {
          agenteInfo = {
            ...(f.verificacionAgente || {
              ocValida: true,
              proveedorValido: true,
              sinDuplicados: true,
              montoValido: true,
            }),
            estado: "pendiente",
            detalles: `1/3 firmas (${rol}). Falta 1 firma para habilitar auditoría y pago.`,
          };
        }

        const actualizada = {
          ...f,
          firmas: nuevasFirmas,
          estado: nuevoEstado,
          verificacionAgente: agenteInfo,
        };

        if (facturaSeleccionada?.id === id) {
          setFacturaSeleccionada(actualizada);
        }

        return actualizada;
      })
    );

    notificar(`Firma registrada como ${rol.toUpperCase()} (on-chain devnet).`);
  };

  const ejecutarPago = (id: string) => {
    const factura = facturas.find((f) => f.id === id);
    if (!factura) return;

    if (factura.firmas.length < 2) {
      notificar("Se requieren al menos 2 firmas del multisig antes de pagar.");
      return;
    }

    if (factura.verificacionAgente?.estado === "rechazado") {
      notificar("El agente rechazó esta factura. No se puede ejecutar el pago.");
      return;
    }

    const txHash = generarTxDevnet();
    const hoy = new Date().toISOString().slice(0, 10);

    // Actualizar factura
    setFacturas((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const pagada: Factura = {
          ...f,
          estado: "pagada",
          txHash,
        };
        if (facturaSeleccionada?.id === id) {
          setFacturaSeleccionada(pagada);
        }
        return pagada;
      })
    );

    // Descontar saldo de billetera
    setBilletera((b) => ({
      ...b,
      balanceUSDC: Math.max(0, b.balanceUSDC - factura.montoUSDC),
    }));

    // Incrementar estadísticas del proveedor
    setProveedores((prev) =>
      prev.map((p) => {
        if (p.id !== factura.proveedorId) return p;
        return {
          ...p,
          pagos: p.pagos + 1,
          totalUSDC: p.totalUSDC + factura.montoUSDC,
        };
      })
    );

    // Registrar en transacciones con memo hash
    const nuevaTx: Transaccion = {
      id: `t${Date.now()}`,
      fecha: hoy,
      proveedorId: factura.proveedorId,
      montoUSDC: factura.montoUSDC,
      estado: "completada",
      txHash,
      facturaOC: factura.numeroOC,
      memoHash: factura.facturaHash,
    };
    setTransacciones((prev) => [nuevaTx, ...prev]);

    notificar(`Pago ejecutado: ${factura.montoUSDC} USDC transferidos en Solana Devnet!`);
  };

  return (
    <AppContext.Provider
      value={{
        tab,
        setTab,
        rol,
        setRol,
        nombreUsuario,
        proveedores,
        proveedorSeleccionado,
        setProveedorSeleccionado,
        agregarProveedor,
        facturas,
        agregarFactura,
        importarFacturasCSV,
        pagos,
        registrarNuevoPago,
        firmarFactura,
        ejecutarPago,
        transacciones,
        billetera,
        facturaSeleccionada,
        setFacturaSeleccionada,
        modalNuevaFacturaAbierto,
        setModalNuevaFacturaAbierto,
        toast,
        notificar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp debe usarse dentro de un AppProvider");
  }
  return context;
}
