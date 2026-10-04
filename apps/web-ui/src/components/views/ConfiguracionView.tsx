"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import LogisLogo from "@/components/LogisLogo";

interface Jurisdiccion {
  id: string;
  nombre: string;
  activa: boolean;
  esPrincipal?: boolean;
}

interface BilleteraGuardada {
  id: string;
  nombre: string;
  direccion: string;
  conector: "Phantom" | "Solflare" | "Safe" | "Fireblocks";
}

interface CategoriaFiscal {
  id: string;
  nombre: string;
  cuenta: string;
}

interface MiembroEquipo {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  limite: string;
  estado: "Activo" | "Inactivo";
  avatar: string;
}

interface IntegracionApp {
  id: string;
  nombre: string;
  sigla: string;
  colorBg: string;
  colorTxt: string;
  conectado: boolean;
}

export default function ConfiguracionView() {
  const { notificar } = useApp();

  // Subtab activo
  const [subtab, setSubtab] = useState<string>("empresa");

  // Estado Datos de Empresa
  const [datosEmpresa, setDatosEmpresa] = useState({
    razonSocial: "Logis S.A.",
    cuit: "30-71234567-8",
    domicilioFiscal: "Av. Corrientes 1234",
    provincia: "Buenos Aires",
    localidad: "CABA",
    codigoPostal: "C1043AAZ",
    usarDomicilioPrincipal: true,
  });

  // Logo y Colores
  const [colorPrimario, setColorPrimario] = useState("#00E0B7");
  const [colorSecundario, setColorSecundario] = useState("#0A685A");
  const [nombreComprobantes, setNombreComprobantes] = useState("Logis S.A.");

  // Jurisdicciones Fiscales
  const [jurisdicciones, setJurisdicciones] = useState<Jurisdiccion[]>([
    { id: "ba", nombre: "Buenos Aires", activa: true, esPrincipal: true },
    { id: "cba", nombre: "Córdoba", activa: true },
    { id: "sf", nombre: "Santa Fe", activa: true },
    { id: "mza", nombre: "Mendoza", activa: true },
    { id: "tuc", nombre: "Tucumán", activa: true },
    { id: "otras", nombre: "Otras provincias", activa: true },
  ]);

  // Billetera principal de pago
  const [billeteraConectada, setBilleteraConectada] = useState(true);
  const direccionPrincipal = "4f3Qr8jKm1nL9pRt2vW5xYz7aBc3dEf4gHj6kL2";

  // Billeteras guardadas
  const [billeteras, setBilleteras] = useState<BilleteraGuardada[]>([
    { id: "1", nombre: "Principal - Pagos", direccion: "4f3Qr...9kL2", conector: "Phantom" },
    { id: "2", nombre: "Tesorería", direccion: "7gh2k...t3Lm", conector: "Solflare" },
    { id: "3", nombre: "Operaciones", direccion: "3nP9d...dQ4Z", conector: "Safe" },
    { id: "4", nombre: "Cold Wallet", direccion: "9mK4L...pR7T", conector: "Fireblocks" },
  ]);

  // Red y Seguridad
  const [redDefecto, setRedDefecto] = useState("Devnet");
  const [alertaGas, setAlertaGas] = useState("0.05");
  const [aprobacionMultisig, setAprobacionMultisig] = useState("2 de 3 firmas");

  // Automatización e IA (OCR)
  const [aprobacionFacturas, setAprobacionFacturas] = useState("Revisión humana previa");
  const [categorizacionAuto, setCategorizacionAuto] = useState(true);
  const [toleranciaCoincidencia, setToleranciaCoincidencia] = useState("85");

  // Mapeo categorías fiscales
  const [categorias, setCategorias] = useState<CategoriaFiscal[]>([
    { id: "1", nombre: "Combustibles y lubricantes", cuenta: "5.1.1.01" },
    { id: "2", nombre: "Insumos industriales", cuenta: "5.1.1.02" },
    { id: "3", nombre: "Logística y distribución", cuenta: "5.1.1.03" },
    { id: "4", nombre: "Servicios de diseño", cuenta: "5.1.1.04" },
    { id: "5", nombre: "Impresión y papelería", cuenta: "5.1.1.05" },
  ]);

  // Usuarios y permisos
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([
    { id: "1", nombre: "Luli Maris", email: "luli@logis.com", rol: "Administrador", limite: "Sin límite", estado: "Activo", avatar: "LM" },
    { id: "2", nombre: "Juan Pérez", email: "jperez@logis.com", rol: "Tesorería", limite: "50.000", estado: "Activo", avatar: "JP" },
    { id: "3", nombre: "Ana Gómez", email: "agomez@logis.com", rol: "Contabilidad", limite: "20.000", estado: "Activo", avatar: "AG" },
    { id: "4", nombre: "Mateo Ríos", email: "mrios@logis.com", rol: "Auditoría", limite: "Solo lectura", estado: "Activo", avatar: "MR" },
  ]);

  // Integraciones
  const [integraciones, setIntegraciones] = useState<IntegracionApp[]>([
    { id: "tango", nombre: "Tango", sigla: "T", colorBg: "bg-red-600/20 border-red-500/30", colorTxt: "text-red-400", conectado: false },
    { id: "sap", nombre: "SAP", sigla: "SAP", colorBg: "bg-blue-600/20 border-blue-500/30", colorTxt: "text-blue-400", conectado: false },
    { id: "bejerman", nombre: "Bejerman", sigla: "B", colorBg: "bg-purple-600/20 border-purple-500/30", colorTxt: "text-purple-400", conectado: false },
    { id: "xero", nombre: "Xero", sigla: "xero", colorBg: "bg-cyan-600/20 border-cyan-500/30", colorTxt: "text-cyan-400", conectado: false },
  ]);

  // Notificaciones
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSlack, setNotifSlack] = useState(true);
  const [notifWhatsapp, setNotifWhatsapp] = useState(false);
  const [notifEventos, setNotifEventos] = useState({
    vencimiento: true,
    confirmacionSolana: true,
    cambioPermisos: true,
    saldoBajoSol: true,
  });

  // Preferencias interfaz
  const [temaVisual, setTemaVisual] = useState("Modo oscuro (Dark Teal)");
  const [monedaMuestra, setMonedaMuestra] = useState("Dual (ARS + USDC)");
  const [idioma, setIdioma] = useState("Español (Argentina)");

  // Modales interactivos
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);
  const [inputGenerico, setInputGenerico] = useState({ campo1: "", campo2: "" });

  const copiarDireccion = (dir: string) => {
    navigator.clipboard?.writeText(dir);
    notificar(`Dirección ${dir} copiada al portapapeles.`);
  };

  const guardarCambios = (seccion: string) => {
    notificar(`Cambios de ${seccion} guardados exitosamente.`);
  };

  const toggleJurisdiccion = (id: string) => {
    setJurisdicciones((prev) =>
      prev.map((j) => (j.id === id ? { ...j, activa: !j.activa } : j))
    );
  };

  const toggleIntegracion = (id: string) => {
    setIntegraciones((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nuevo = !item.conectado;
          notificar(nuevo ? `${item.nombre} conectado correctamente.` : `${item.nombre} desconectado.`);
          return { ...item, conectado: nuevo };
        }
        return item;
      })
    );
  };

  const agregarProvincia = () => {
    if (!inputGenerico.campo1) return;
    setJurisdicciones((prev) => [
      ...prev,
      { id: Date.now().toString(), nombre: inputGenerico.campo1, activa: true },
    ]);
    setInputGenerico({ campo1: "", campo2: "" });
    setModalAbierto(null);
    notificar("Nueva jurisdicción fiscal agregada.");
  };

  const agregarBilletera = () => {
    if (!inputGenerico.campo1 || !inputGenerico.campo2) return;
    setBilleteras((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        nombre: inputGenerico.campo1,
        direccion: inputGenerico.campo2.length > 10 ? `${inputGenerico.campo2.slice(0, 5)}...${inputGenerico.campo2.slice(-4)}` : inputGenerico.campo2,
        conector: "Phantom",
      },
    ]);
    setInputGenerico({ campo1: "", campo2: "" });
    setModalAbierto(null);
    notificar("Billetera vinculada exitosamente.");
  };

  const agregarCategoria = () => {
    if (!inputGenerico.campo1 || !inputGenerico.campo2) return;
    setCategorias((prev) => [
      ...prev,
      { id: Date.now().toString(), nombre: inputGenerico.campo1, cuenta: inputGenerico.campo2 },
    ]);
    setInputGenerico({ campo1: "", campo2: "" });
    setModalAbierto(null);
    notificar("Categoría contable guardada.");
  };

  const agregarUsuario = () => {
    if (!inputGenerico.campo1 || !inputGenerico.campo2) return;
    const iniciales = inputGenerico.campo1.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "US";
    setMiembros((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        nombre: inputGenerico.campo1,
        email: inputGenerico.campo2,
        rol: "Operador",
        limite: "10.000",
        estado: "Activo",
        avatar: iniciales,
      },
    ]);
    setInputGenerico({ campo1: "", campo2: "" });
    setModalAbierto(null);
    notificar("Nuevo usuario invitado al equipo.");
  };

  const SUBTABS = [
    { id: "empresa", label: "Empresa", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { id: "billetera", label: "Billetera y Blockchain", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { id: "ocr", label: "Automatización (OCR)", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
    { id: "usuarios", label: "Usuarios y permisos", icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { id: "integraciones", label: "Integraciones", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
    { id: "notificaciones", label: "Notificaciones", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { id: "preferencias", label: "Preferencias", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans text-white">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Configuración</h1>
        <p className="text-sm text-[#8caab1]">
          Personalizá y administrá los parámetros de tu organización.
        </p>
      </div>

      {/* Barra de Subtabs / Píldoras Horizontales */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-[#164b54] pb-2 scrollbar-none">
        {SUBTABS.map((t) => {
          const activo = subtab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSubtab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                activo
                  ? "bg-[#0b5563] text-[#3fd0a8] shadow-sm font-semibold border border-[#3fd0a8]/30"
                  : "bg-[#07252c] text-[#8caab1] hover:bg-[#0c3842] hover:text-white border border-[#164b54]/50"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
              </svg>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* GRID PRINCIPAL DE CONFIGURACIÓN */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ============================================================ */}
        {/* FILA 1: DATOS DE LA EMPRESA, LOGO Y JURISDICCIONES */}
        {/* ============================================================ */}

        {/* Card 1: Datos de la empresa */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-lg bg-[#00e0b7]/10 p-2 text-[#00e0b7]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Datos de la empresa</h2>
              <p className="text-[11px] text-[#8caab1]">Información legal y fiscal de la organización.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Razón social</label>
                <input
                  type="text"
                  value={datosEmpresa.razonSocial}
                  onChange={(e) => setDatosEmpresa({ ...datosEmpresa, razonSocial: e.target.value })}
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">CUIT</label>
                <input
                  type="text"
                  value={datosEmpresa.cuit}
                  onChange={(e) => setDatosEmpresa({ ...datosEmpresa, cuit: e.target.value })}
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Domicilio fiscal</label>
                <input
                  type="text"
                  value={datosEmpresa.domicilioFiscal}
                  onChange={(e) => setDatosEmpresa({ ...datosEmpresa, domicilioFiscal: e.target.value })}
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Provincia</label>
                <select
                  value={datosEmpresa.provincia}
                  onChange={(e) => setDatosEmpresa({ ...datosEmpresa, provincia: e.target.value })}
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                >
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Mendoza">Mendoza</option>
                  <option value="Tucumán">Tucumán</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Localidad</label>
                <input
                  type="text"
                  value={datosEmpresa.localidad}
                  onChange={(e) => setDatosEmpresa({ ...datosEmpresa, localidad: e.target.value })}
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Código postal</label>
                <input
                  type="text"
                  value={datosEmpresa.codigoPostal}
                  onChange={(e) => setDatosEmpresa({ ...datosEmpresa, codigoPostal: e.target.value })}
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#8caab1]">
                <input
                  type="checkbox"
                  checked={datosEmpresa.usarDomicilioPrincipal}
                  onChange={(e) => setDatosEmpresa({ ...datosEmpresa, usarDomicilioPrincipal: e.target.checked })}
                  className="h-3.5 w-3.5 rounded border-[#1b5963] bg-[#0b2d35] text-[#00e0b7] accent-[#00e0b7]"
                />
                <span>Usar este domicilio como principal en comprobantes</span>
              </label>
            </div>
          </div>
        </div>

        {/* Card 2: Logo y marca */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-lg bg-[#00e0b7]/10 p-2 text-[#00e0b7]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Logo y marca</h2>
                <p className="text-[11px] text-[#8caab1]">Personalizá la identidad visual de la plataforma.</p>
              </div>
            </div>

            {/* Isotipo & Botón */}
            <div className="flex items-center justify-between rounded-lg border border-[#164b54] bg-[#0a2f38] p-3">
              <div className="flex items-center">
                <LogisLogo className="h-7 w-auto" theme="dark" />
              </div>
              <div className="text-right">
                <button
                  onClick={() => notificar("Selector de archivo abierto.")}
                  className="flex items-center gap-1.5 rounded-md border border-[#1b5963] bg-[#0d3f4b] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#124d5b] transition"
                >
                  <svg className="h-3.5 w-3.5 text-[#00e0b7]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Cambiar logo
                </button>
                <div className="mt-0.5 text-[9px] text-[#8caab1]">PNG, JPG, SVG | Máx. 2 MB</div>
              </div>
            </div>

            {/* Selector de colores */}
            <div className="mt-3.5 grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Color primario</label>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: colorPrimario }} />
                  <input
                    type="text"
                    value={colorPrimario}
                    onChange={(e) => setColorPrimario(e.target.value)}
                    className="w-full bg-transparent text-xs text-white uppercase focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Color secundario</label>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: colorSecundario }} />
                  <input
                    type="text"
                    value={colorSecundario}
                    onChange={(e) => setColorSecundario(e.target.value)}
                    className="w-full bg-transparent text-xs text-white uppercase focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Nombre en comprobantes</label>
              <input
                type="text"
                value={nombreComprobantes}
                onChange={(e) => setNombreComprobantes(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Jurisdicciones fiscales */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-lg bg-[#00e0b7]/10 p-2 text-[#00e0b7]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Jurisdicciones fiscales</h2>
                <p className="text-[11px] text-[#8caab1]">Configurá las provincias donde operás para percepciones y retenciones.</p>
              </div>
            </div>

            <div className="space-y-2">
              {jurisdicciones.map((j) => (
                <div key={j.id} className="flex items-center justify-between rounded-lg border border-[#164b54]/60 bg-[#0a2e36] px-3 py-1.5 text-xs">
                  <div className="flex items-center gap-2.5">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleJurisdiccion(j.id)}
                      className={`relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        j.activa ? "bg-[#00e0b7]" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          j.activa ? "translate-x-3" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-xs text-white">{j.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {j.esPrincipal && (
                      <span className="rounded bg-[#00e0b7]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#00e0b7]">
                        Sede principal
                      </span>
                    )}
                    <button onClick={() => notificar(`Opciones para ${j.nombre}`)} className="text-[#8caab1] hover:text-white">
                      •••
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setModalAbierto("provincia")}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#1b5963] py-2 text-xs font-medium text-[#00e0b7] hover:bg-[#00e0b7]/5 transition"
          >
            + Agregar provincia
          </button>
        </div>

        {/* ============================================================ */}
        {/* FILA 2: BILLETERAS, SOLANA Y SEGURIDAD MULTISIG */}
        {/* ============================================================ */}

        {/* Card 4: Billetera principal de pago */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-lg bg-[#00e0b7]/10 p-2 text-[#00e0b7]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Billetera principal de pago</h2>
                <p className="text-[11px] text-[#8caab1]">Conectá tu billetera de Solana para realizar pagos en USDC.</p>
              </div>
            </div>

            {/* Estado Conexión */}
            <div className="flex items-center justify-between rounded-lg border border-[#164b54] bg-[#0a2f38] p-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#00e0b7] animate-pulse" />
                  <span className="font-semibold text-white">Billetera conectada</span>
                  <span className="rounded bg-[#ab9ff2]/20 px-2 py-0.5 text-[10px] font-semibold text-[#c4bbf7]">
                    Phantom
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-[#8caab1]">
                  <span>4f3Qr...9kL2</span>
                  <button onClick={() => copiarDireccion(direccionPrincipal)} className="hover:text-white" title="Copiar dirección">
                    📋
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setBilleteraConectada(!billeteraConectada);
                  notificar(billeteraConectada ? "Billetera desconectada." : "Billetera Phantom conectada.");
                }}
                className="rounded-md border border-rose-500/40 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-300 hover:bg-rose-500/20 transition"
              >
                {billeteraConectada ? "Desconectar" : "Conectar"}
              </button>
            </div>

            {/* Saldos */}
            <div className="mt-3.5">
              <div className="mb-1.5 text-[10px] uppercase font-semibold text-[#8caab1]">Saldo actual</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[#164b54] bg-[#0a2e36] p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-[10px]">
                      $
                    </div>
                    <div>
                      <div className="text-[10px] text-[#8caab1]">USDC</div>
                      <div className="text-sm font-bold text-white">24,530.00</div>
                    </div>
                  </div>
                  <div className="mt-1 text-[9px] text-[#8caab1]">≈ $ 24.530.000 ARS</div>
                </div>

                <div className="rounded-lg border border-[#164b54] bg-[#0a2e36] p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 text-white text-[10px] font-bold">
                      ◎
                    </div>
                    <div>
                      <div className="text-[10px] text-[#8caab1]">SOL (Gas)</div>
                      <div className="text-sm font-bold text-white">0.0245</div>
                    </div>
                  </div>
                  <div className="mt-1 text-[9px] text-[#8caab1]">≈ $ 3.25 USD</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Billeteras guardadas */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#00e0b7]/10 p-2 text-[#00e0b7]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Billeteras guardadas</h2>
                  <p className="text-[11px] text-[#8caab1]">Administrá las direcciones vinculadas.</p>
                </div>
              </div>
              <button
                onClick={() => setModalAbierto("billetera")}
                className="rounded-md border border-[#00e0b7]/40 bg-[#00e0b7]/10 px-2 py-1 text-[11px] font-medium text-[#00e0b7] hover:bg-[#00e0b7]/20 transition"
              >
                + Agregar billetera
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#164b54] text-[10px] uppercase text-[#8caab1]">
                    <th className="pb-2 font-semibold">Nombre</th>
                    <th className="pb-2 font-semibold">Dirección (Public Key)</th>
                    <th className="pb-2 font-semibold">Conector</th>
                    <th className="pb-2 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#164b54]/50">
                  {billeteras.map((b) => (
                    <tr key={b.id} className="hover:bg-[#0a2e36]/50">
                      <td className="py-2.5 font-medium text-white">{b.nombre}</td>
                      <td className="py-2.5 font-mono text-[11px] text-[#8caab1]">
                        <span className="flex items-center gap-1">
                          {b.direccion}
                          <button onClick={() => copiarDireccion(b.direccion)} className="hover:text-white" title="Copiar">
                            📋
                          </button>
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#c4bbf7]">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                          {b.conector}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-[#8caab1]">
                        <button onClick={() => notificar(`Opciones de billetera ${b.nombre}`)} className="hover:text-white">
                          •••
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Card 6: Configuración de red y seguridad */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-lg bg-[#00e0b7]/10 p-2 text-[#00e0b7]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Configuración de red y seguridad</h2>
                <p className="text-[11px] text-[#8caab1]">Parámetros de blockchain y protocolo multisig.</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Red por defecto</label>
                <div className="relative mt-1">
                  <select
                    value={redDefecto}
                    onChange={(e) => setRedDefecto(e.target.value)}
                    className="w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                  >
                    <option value="Devnet">Solana Devnet (Modo prueba - Hackathon)</option>
                    <option value="Mainnet-Beta">Mainnet-Beta (Producción restringida)</option>
                  </select>
                </div>
                <div className="mt-1 text-[10px] text-[#3fd0a8]">
                  ✓ Entorno seguro activo en devnet (la plata sale de faucet y es de prueba).
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Alerta de fondo para gas (SOL)</label>
                <div className="mt-1 flex items-center rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5">
                  <input
                    type="text"
                    value={alertaGas}
                    onChange={(e) => setAlertaGas(e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                  <span className="text-[11px] text-[#8caab1] font-mono">SOL</span>
                </div>
                <div className="mt-0.5 text-[9px] text-[#8caab1]">Notificar cuando el saldo sea menor a este valor.</div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Aprobación multi-firma (Multi-Sig)</label>
                <div className="mt-1 flex items-center justify-between rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5">
                  <span className="font-semibold text-[#00e0b7]">{aprobacionMultisig}</span>
                  <span className="rounded bg-[#00e0b7]/10 px-2 py-0.5 text-[10px] text-[#00e0b7]">Squads v4</span>
                </div>
                <div className="mt-0.5 text-[9px] text-[#8caab1]">Número de aprobaciones requeridas para ejecutar transferencias.</div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FILA 3: AUTOMATIZACIÓN OCR, CATEGORÍAS Y USUARIOS */}
        {/* ============================================================ */}

        {/* Card 7: Automatización e IA (OCR) */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-lg bg-[#00e0b7]/10 p-2 text-[#00e0b7]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Automatización e IA (OCR)</h2>
                <p className="text-[11px] text-[#8caab1]">Configurá el escaneo y procesamiento automático de facturas.</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Aprobación de facturas</label>
                <select
                  value={aprobacionFacturas}
                  onChange={(e) => setAprobacionFacturas(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                >
                  <option value="Revisión humana previa">Revisión humana previa</option>
                  <option value="Aprobación automática bajo límite">Aprobación automática bajo límite</option>
                </select>
                <div className="mt-0.5 text-[9px] text-[#8caab1]">Las facturas extraídas por IA requieren aprobación manual.</div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#164b54]/60 bg-[#0a2e36] p-2.5">
                <span className="text-xs text-white">Aplicar categorización automática</span>
                <button
                  type="button"
                  onClick={() => setCategorizacionAuto(!categorizacionAuto)}
                  className={`relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    categorizacionAuto ? "bg-[#00e0b7]" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      categorizacionAuto ? "translate-x-3" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Tolerancia de coincidencia</label>
                <div className="mt-1 flex items-center rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5">
                  <input
                    type="text"
                    value={toleranciaCoincidencia}
                    onChange={(e) => setToleranciaCoincidencia(e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                  <span className="text-[11px] text-[#8caab1] font-mono">%</span>
                </div>
                <div className="mt-0.5 text-[9px] text-[#8caab1]">Generar alerta si la coincidencia es menor a este porcentaje.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 8: Mapeo de categorías fiscales */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#00e0b7]/10 p-2 text-[#00e0b7]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Mapeo de categorías fiscales</h2>
                  <p className="text-[11px] text-[#8caab1]">Cuentas contables por tipo de proveedor.</p>
                </div>
              </div>
              <button
                onClick={() => setModalAbierto("categoria")}
                className="rounded-md border border-[#00e0b7]/40 bg-[#00e0b7]/10 px-2 py-1 text-[11px] font-medium text-[#00e0b7] hover:bg-[#00e0b7]/20 transition"
              >
                + Agregar categoría
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#164b54] text-[10px] uppercase text-[#8caab1]">
                    <th className="pb-2 font-semibold">Categoría</th>
                    <th className="pb-2 font-semibold">Cuenta contable</th>
                    <th className="pb-2 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#164b54]/50">
                  {categorias.map((c) => (
                    <tr key={c.id} className="hover:bg-[#0a2e36]/50">
                      <td className="py-2 text-xs font-medium text-white">{c.nombre}</td>
                      <td className="py-2 font-mono text-[11px] text-[#00e0b7]">{c.cuenta}</td>
                      <td className="py-2 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-xs text-[#8caab1]">
                          <button onClick={() => notificar(`Editar ${c.nombre}`)} className="hover:text-white" title="Editar">✏</button>
                          <button onClick={() => notificar(`Eliminar ${c.nombre}`)} className="hover:text-rose-400" title="Eliminar">🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Card 9: Usuarios, roles y permisos */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#00e0b7]/10 p-2 text-[#00e0b7]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Usuarios, roles y permisos</h2>
                  <p className="text-[11px] text-[#8caab1]">Administrá los miembros de tu organización.</p>
                </div>
              </div>
              <button
                onClick={() => setModalAbierto("usuario")}
                className="rounded-md border border-[#00e0b7]/40 bg-[#00e0b7]/10 px-2 py-1 text-[11px] font-medium text-[#00e0b7] hover:bg-[#00e0b7]/20 transition"
              >
                + Agregar usuario
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#164b54] text-[10px] uppercase text-[#8caab1]">
                    <th className="pb-2 font-semibold">Usuario</th>
                    <th className="pb-2 font-semibold">Rol</th>
                    <th className="pb-2 font-semibold">Límite (USDC)</th>
                    <th className="pb-2 font-semibold">Estado</th>
                    <th className="pb-2 text-right font-semibold">•••</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#164b54]/50">
                  {miembros.map((m) => (
                    <tr key={m.id} className="hover:bg-[#0a2e36]/50">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00e0b7]/20 text-[10px] font-bold text-[#00e0b7]">
                            {m.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-white">{m.nombre}</div>
                            <div className="text-[10px] text-[#8caab1]">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-[11px] text-white">{m.rol}</td>
                      <td className="py-2 font-mono text-[11px] text-[#8caab1]">{m.limite}</td>
                      <td className="py-2">
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                          {m.estado}
                        </span>
                      </td>
                      <td className="py-2 text-right text-[#8caab1]">
                        <button onClick={() => notificar(`Permisos de ${m.nombre}`)} className="hover:text-white">
                          •••
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FILA 4: INTEGRACIONES, NOTIFICACIONES Y PREFERENCIAS */}
        {/* ============================================================ */}

        {/* Card 10: Integraciones */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-lg bg-[#00e0b7]/10 p-2 text-[#00e0b7]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Integraciones</h2>
                <p className="text-[11px] text-[#8caab1]">Conectá Logis con tu sistema contable y ERP.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {integraciones.map((app) => (
                <div key={app.id} className="flex flex-col justify-between rounded-lg border border-[#164b54] bg-[#0a2e36] p-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-6 w-6 items-center justify-center rounded border font-bold text-[10px] ${app.colorBg} ${app.colorTxt}`}>
                      {app.sigla}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{app.nombre}</div>
                      <div className="text-[9px] text-[#8caab1]">
                        {app.conectado ? "Conectado" : "No conectado"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleIntegracion(app.id)}
                    className={`mt-2 w-full rounded py-1 text-[10px] font-medium transition ${
                      app.conectado
                        ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "border border-[#1b5963] bg-[#0d3f4b] text-[#8caab1] hover:text-white"
                    }`}
                  >
                    {app.conectado ? "Desconectar" : "Conectar"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 11: Notificaciones */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-lg bg-[#00e0b7]/10 p-2 text-[#00e0b7]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Notificaciones</h2>
                <p className="text-[11px] text-[#8caab1]">Configurá los canales y eventos de alerta.</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg border border-[#164b54]/60 bg-[#0a2e36] px-3 py-1.5">
                <span className="text-xs text-white">Correo electrónico</span>
                <button
                  type="button"
                  onClick={() => setNotifEmail(!notifEmail)}
                  className={`relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifEmail ? "bg-[#00e0b7]" : "bg-gray-600"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifEmail ? "translate-x-3" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#164b54]/60 bg-[#0a2e36] px-3 py-1.5">
                <span className="text-xs text-white">Slack</span>
                <button
                  type="button"
                  onClick={() => setNotifSlack(!notifSlack)}
                  className={`relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifSlack ? "bg-[#00e0b7]" : "bg-gray-600"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifSlack ? "translate-x-3" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#164b54]/60 bg-[#0a2e36] px-3 py-1.5">
                <span className="text-xs text-white">WhatsApp</span>
                <button
                  type="button"
                  onClick={() => setNotifWhatsapp(!notifWhatsapp)}
                  className={`relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifWhatsapp ? "bg-[#00e0b7]" : "bg-gray-600"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifWhatsapp ? "translate-x-3" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="space-y-1.5 pt-2 text-[11px] text-[#8caab1]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifEventos.vencimiento}
                    onChange={(e) => setNotifEventos({ ...notifEventos, vencimiento: e.target.checked })}
                    className="h-3.5 w-3.5 rounded border-[#1b5963] bg-[#0b2d35] text-[#00e0b7] accent-[#00e0b7]"
                  />
                  <span>Facturas con vencimiento próximo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifEventos.confirmacionSolana}
                    onChange={(e) => setNotifEventos({ ...notifEventos, confirmacionSolana: e.target.checked })}
                    className="h-3.5 w-3.5 rounded border-[#1b5963] bg-[#0b2d35] text-[#00e0b7] accent-[#00e0b7]"
                  />
                  <span>Confirmación de pagos en Solana</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifEventos.cambioPermisos}
                    onChange={(e) => setNotifEventos({ ...notifEventos, cambioPermisos: e.target.checked })}
                    className="h-3.5 w-3.5 rounded border-[#1b5963] bg-[#0b2d35] text-[#00e0b7] accent-[#00e0b7]"
                  />
                  <span>Cambios en permisos o billeteras</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifEventos.saldoBajoSol}
                    onChange={(e) => setNotifEventos({ ...notifEventos, saldoBajoSol: e.target.checked })}
                    className="h-3.5 w-3.5 rounded border-[#1b5963] bg-[#0b2d35] text-[#00e0b7] accent-[#00e0b7]"
                  />
                  <span>Alertas de saldo bajo de SOL</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Card 12: Preferencias de interfaz */}
        <div className="rounded-xl border border-[#164b54] bg-[#07242b] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-lg bg-[#00e0b7]/10 p-2 text-[#00e0b7]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Preferencias de interfaz</h2>
                <p className="text-[11px] text-[#8caab1]">Configurá moneda, idioma y apariencia.</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Tema visual</label>
                <select
                  value={temaVisual}
                  onChange={(e) => {
                    setTemaVisual(e.target.value);
                    guardarCambios("Tema visual");
                  }}
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                >
                  <option value="Modo oscuro (Dark Teal)">Modo oscuro (Dark Teal)</option>
                  <option value="Modo claro">Modo claro</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Moneda de muestra predeterminada</label>
                <select
                  value={monedaMuestra}
                  onChange={(e) => {
                    setMonedaMuestra(e.target.value);
                    guardarCambios("Moneda predeterminada");
                  }}
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                >
                  <option value="Dual (ARS + USDC)">Dual (ARS + USDC)</option>
                  <option value="USDC (Solana)">USDC (Solana)</option>
                  <option value="ARS (Pesos)">ARS (Pesos)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">Idioma</label>
                <select
                  value={idioma}
                  onChange={(e) => {
                    setIdioma(e.target.value);
                    guardarCambios("Idioma");
                  }}
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-2.5 py-1.5 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                >
                  <option value="Español (Argentina)">Español (Argentina)</option>
                  <option value="English (US)">English (US)</option>
                  <option value="Português (Brasil)">Português (Brasil)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL GENÉRICO PARA AGREGAR PROVINCIA, BILLETERA, CATEGORÍA O USUARIO */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-[#164b54] bg-[#07252c] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white capitalize">
              {modalAbierto === "provincia" && "Agregar Jurisdicción Fiscal"}
              {modalAbierto === "billetera" && "Vincular Nueva Billetera Solana"}
              {modalAbierto === "categoria" && "Crear Categoría Contable"}
              {modalAbierto === "usuario" && "Invitar Usuario a la Organización"}
            </h3>
            <p className="mt-1 text-xs text-[#8caab1]">
              Completá los campos requeridos para registrar el cambio.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8caab1]">
                  {modalAbierto === "provincia" && "Nombre de la provincia"}
                  {modalAbierto === "billetera" && "Nombre identificador (ej: Pagos Especiales)"}
                  {modalAbierto === "categoria" && "Nombre de categoría (ej: Software y Licencias)"}
                  {modalAbierto === "usuario" && "Nombre y apellido completo"}
                </label>
                <input
                  type="text"
                  value={inputGenerico.campo1}
                  onChange={(e) => setInputGenerico({ ...inputGenerico, campo1: e.target.value })}
                  placeholder="Ingresar..."
                  className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-3 py-2 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                />
              </div>

              {modalAbierto !== "provincia" && (
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#8caab1]">
                    {modalAbierto === "billetera" && "Dirección pública (Base58 de Solana)"}
                    {modalAbierto === "categoria" && "Número de cuenta contable (ej: 5.1.1.06)"}
                    {modalAbierto === "usuario" && "Correo electrónico corporativo"}
                  </label>
                  <input
                    type="text"
                    value={inputGenerico.campo2}
                    onChange={(e) => setInputGenerico({ ...inputGenerico, campo2: e.target.value })}
                    placeholder="Ingresar..."
                    className="mt-1 w-full rounded-md border border-[#1b5963] bg-[#0b2d35] px-3 py-2 text-xs text-white focus:border-[#00e0b7] focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setModalAbierto(null);
                  setInputGenerico({ campo1: "", campo2: "" });
                }}
                className="rounded-lg border border-[#164b54] px-4 py-2 text-xs font-medium text-[#8caab1] hover:bg-[#0c3842]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (modalAbierto === "provincia") agregarProvincia();
                  if (modalAbierto === "billetera") agregarBilletera();
                  if (modalAbierto === "categoria") agregarCategoria();
                  if (modalAbierto === "usuario") agregarUsuario();
                }}
                className="rounded-lg bg-[#00e0b7] px-4 py-2 text-xs font-semibold text-[#07242b] hover:brightness-110"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
