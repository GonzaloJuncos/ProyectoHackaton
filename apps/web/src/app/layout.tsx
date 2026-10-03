import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Logis — Pagos a proveedores",
  description: "Aprobá y pagá a tus proveedores en USDC con evidencia auditable on-chain.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Logis
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/proveedores" className="hover:underline">Proveedores</Link>
              <Link href="/facturas" className="hover:underline">Facturas</Link>
              <Link href="/conciliacion" className="hover:underline">Conciliación</Link>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                devnet
              </span>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
