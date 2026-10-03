"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/portal-proveedor") return <>{children}</>;
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-56">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
