"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function ConciliacionPage() {
  const router = useRouter();
  const { setTab } = useApp();

  useEffect(() => {
    setTab("conciliacion");
    router.replace("/?tab=conciliacion");
  }, [router, setTab]);

  return null;
}
