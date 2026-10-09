import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { ClientProvider } from "@solana/react";
import { client } from "./solana/client";
import { AuthProvider, useAuth } from "./auth";
import WalletButton from "./components/WalletButton";
import Login from "./pages/Login";
import Proveedores from "./pages/Proveedores";
import Facturas from "./pages/Facturas";
import Panel from "./pages/Panel";
import Historial from "./pages/Historial";
import Usuarios from "./pages/Usuarios";

function Layout({ children }: { children: React.ReactNode }) {
  const { usuario, logout } = useAuth();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <img src="/logo-logis-oscuro.svg" alt="Logis" />
        </Link>
        <nav className="nav-links">
          <Link to="/">Conciliación</Link>
          <Link to="/facturas">Facturas</Link>
          <Link to="/proveedores">Proveedores</Link>
          <Link to="/historial">Historial</Link>
          {usuario && ["ADMIN", "JEFE", "SUPERVISOR"].includes(usuario.rol) && (
            <Link to="/usuarios">Usuarios</Link>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-usdc">
            <span className="wallet-dot" />
            <span className="muted small">modo prueba · Solana devnet</span>
          </div>
          <WalletButton client={client} />
          <div className="nav-user">
            <span>{usuario?.nombre} <em className="muted">({usuario?.rol.toLowerCase()})</em></span>
            <button className="link" onClick={logout}>salir</button>
          </div>
        </div>
      </aside>
      <main className="contenido">{children}</main>
    </div>
  );
}

function Protegido({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <p className="muted">Cargando…</p>;
  if (!usuario) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <ClientProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Protegido><Panel /></Protegido>} />
            <Route path="/proveedores" element={<Protegido><Proveedores /></Protegido>} />
            <Route path="/facturas" element={<Protegido><Facturas /></Protegido>} />
            <Route path="/historial" element={<Protegido><Historial /></Protegido>} />
            <Route path="/usuarios" element={<Protegido><Usuarios /></Protegido>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ClientProvider>
  );
}
