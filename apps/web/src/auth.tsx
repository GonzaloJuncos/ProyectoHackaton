import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Usuario, LoginResponse } from "@logis/shared";
import { api, getToken, setToken } from "./api";

interface AuthCtx {
  usuario: Usuario | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  actualizarUsuario: (u: Usuario) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!getToken()) return setCargando(false);
    api<Usuario>("/auth/me")
      .then(setUsuario)
      .catch(() => setToken(null))
      .finally(() => setCargando(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    setUsuario(res.usuario);
  };

  const logout = async () => {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    setToken(null);
    setUsuario(null);
  };

  return (
    <Ctx.Provider value={{ usuario, cargando, login, logout, actualizarUsuario: setUsuario }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth fuera de AuthProvider");
  return ctx;
};
