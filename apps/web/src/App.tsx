import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { ClientProvider } from "@solana/react";
import { client } from "./solana/client";
import { AuthProvider, useAuth } from "./auth";
import WalletButton from "./components/WalletButton";
import Login from "./pages/Login";
import Proveedores from "./pages/Proveedores";
import Facturas from "./pages/Facturas";

function Layout({ children }: { children: React.ReactNode }) {
  const { usuario, logout } = useAuth();
  return (
    <>
      <nav className="topnav">
        <Link to="/" className="brand">Logis</Link>
        <div className="nav-links">
          <Link to="/facturas">Facturas</Link>
          <Link to="/proveedores">Proveedores</Link>
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
            <Route path="/proveedores" element={<Protegido><Proveedores /></Protegido>} />
            <Route path="/facturas" element={<Protegido><Facturas /></Protegido>} />
            <Route path="*" element={<Navigate to="/facturas" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ClientProvider>
  );
}
