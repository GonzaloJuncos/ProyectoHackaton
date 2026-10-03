"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { AppProvider } from "@/context/AppContext";
import ModalNuevaFactura from "./views/ModalNuevaFactura";
import ModalDetalleFactura from "./views/ModalDetalleFactura";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/portal-proveedor") {
    return <AppProvider>{children}</AppProvider>;
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#061d23] text-white font-sans antialiased">
        <Sidebar />
        <div className="pl-56">
          <Header />
          <main className="p-6 overflow-x-hidden">{children}</main>
        </div>
        <ModalNuevaFactura />
        <ModalDetalleFactura />
      </div>
    </AppProvider>
  );
}
