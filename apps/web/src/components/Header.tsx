"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 border-b bg-white px-6 py-3">
      <div className="flex flex-1 items-center gap-2 rounded-lg border bg-fondo px-3 py-2 text-sm text-tinta/40">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Buscar proveedor, transacción o ID…
        <span className="ml-auto rounded border bg-white px-1.5 py-0.5 text-xs text-tinta/40">⌘K</span>
      </div>
      <button className="rounded-lg p-2 text-tinta/60 hover:bg-fondo">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-4-5.7V5a2 2 0 10-4 0v.3A6 6 0 006 11v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-menta text-sm font-bold text-oscuro">
          LM
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold leading-tight">Luli Maris</p>
          <p className="text-xs text-tinta/50">Administrador</p>
        </div>
      </div>
    </header>
  );
}
