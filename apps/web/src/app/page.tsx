"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import InicioView from "@/components/views/InicioView";
import PagosView from "@/components/views/PagosView";
import ProveedoresView from "@/components/views/ProveedoresView";
import ConciliacionView from "@/components/views/ConciliacionView";
import ReportesView from "@/components/views/ReportesView";
import ConfiguracionView from "@/components/views/ConfiguracionView";

export default function PaginaPrincipal() {
  const { tab } = useApp();

  return (
    <div className="transition-all duration-150">
      {tab === "inicio" && <InicioView />}
      {tab === "proveedores" && <ProveedoresView />}
      {(tab === "pagos" || tab === "facturas") && <PagosView />}
      {(tab === "blockchain" || tab === "conciliacion") && <ConciliacionView />}
      {tab === "reportes" && <ReportesView />}
      {tab === "configuracion" && <ConfiguracionView />}
    </div>
  );
}
