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

function Layout({ children }: { children: React.ReactNode }) {
  const { usuario, logout } = useAuth();
  return (
    <>
      <nav className="topnav">
        <Link to="/" className="brand">
          <img src="/logo-logis.svg" alt="Logis" style={{ height: "24px", width: "auto", display: "inline-block", verticalAlign: "middle" }} />
        </Link>
        <div className="nav-links">
          <Link to="/">Conciliación</Link>
          <Link to="/facturas">Facturas</Link>
          <Link to="/proveedores">Proveedores</Link>
          <Link to="/historial">Historial</Link>
        </div>
        <div className="nav-user">
          <WalletButton client={client} />
          <span>{usuario?.nombre} <em className="muted">({usuario?.rol.toLowerCase()})</em></span>
          <button className="link" onClick={logout}>salir</button>
        </div>
      </nav>
      <main className="contenido">{children}</main>
    </>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ClientProvider>
  );
}
