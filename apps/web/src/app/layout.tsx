import type { Metadata } from "next";
import "./globals.css";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "Logis — Pagos a proveedores",
  description: "Aprobá y pagá a tus proveedores en USDC con evidencia auditable on-chain.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-fondo text-tinta">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
