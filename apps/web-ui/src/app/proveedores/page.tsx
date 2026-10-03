"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function ProveedoresPage() {
  const router = useRouter();
  const { setTab } = useApp();

  useEffect(() => {
    setTab("proveedores");
    router.replace("/?tab=proveedores");
  }, [router, setTab]);

  return null;
}
