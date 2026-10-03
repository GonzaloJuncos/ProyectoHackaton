"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function ConfiguracionPage() {
  const router = useRouter();
  const { setTab } = useApp();

  useEffect(() => {
    setTab("configuracion");
    router.replace("/?tab=configuracion");
  }, [router, setTab]);

  return null;
}
