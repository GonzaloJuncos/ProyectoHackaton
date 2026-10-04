import type { Metadata } from "next";
import "./globals.css";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "Logis — Pagos a proveedores",
  description: "Aprobá y pagá a tus proveedores en USDC con evidencia auditable on-chain.",
  icons: {
    icon: "/isotipo-logis.svg",
    shortcut: "/isotipo-logis.svg",
    apple: "/isotipo-logis.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-fondo text-tinta">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('logis-tema');if(t)document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
