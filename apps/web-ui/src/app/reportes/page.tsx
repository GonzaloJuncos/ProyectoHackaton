"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function ReportesPage() {
  const router = useRouter();
  const { setTab } = useApp();

  useEffect(() => {
    setTab("reportes");
    router.replace("/?tab=reportes");
  }, [router, setTab]);

  return null;
}
