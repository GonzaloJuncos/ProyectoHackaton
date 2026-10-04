import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await login(email, password);
      navigate("/facturas");
    } catch (err) {
      setError(err instanceof Error ? err.message : "error al iniciar sesión");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="login">
      <form onSubmit={onSubmit} className="card">
        <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
          <img src="/logo-logis.svg" alt="Logis" style={{ height: "36px", width: "auto" }} />
        </div>
        <p className="muted" style={{ textAlign: "center" }}>Pagos a proveedores en USDC</p>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={enviando}>
          {enviando ? "Ingresando…" : "Ingresar"}
        </button>
        <p className="muted small">Demo: admin@logis.demo / logis123</p>
      </form>
    </main>
  );
}
