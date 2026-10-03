import { useEffect, useState } from "react";

function App() {
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/facturas")
      .then((r) => setApiOk(r.ok))
      .catch(() => setApiOk(false));
  }, []);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem" }}>
      <h1>Logis</h1>
      <p>Pagos a proveedores en USDC — Solana devnet</p>
      <p>
        API:{" "}
        {apiOk === null ? "conectando…" : apiOk ? "✅ conectada" : "❌ no responde (corré `npm run dev:api`)"}
      </p>
    </main>
  );
}

export default App;
