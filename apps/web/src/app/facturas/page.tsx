"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function FacturasPage() {
  const router = useRouter();
  const { setTab } = useApp();

  useEffect(() => {
    setTab("facturas");
    router.replace("/?tab=facturas");
  }, [router, setTab]);

  return null;
}
