// Cliente HTTP mínimo: adjunta el token de sesión si existe.

const TOKEN_KEY = "logis_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string | null) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  status: number;
  body: { error?: string; checks?: Record<string, boolean>; [k: string]: unknown };
  constructor(status: number, body: ApiError["body"]) {
    super(body?.error ?? `error ${status}`);
    this.status = status;
    this.body = body ?? {};
  }
}

// En dev el proxy de Vite reenvía /api → localhost:3001.
// En prod se apunta a la URL pública de la API con VITE_API_URL.
const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    setToken(null);
    window.location.href = "/login";
    throw new Error("sesión expirada");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
