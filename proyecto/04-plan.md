# 04 — Plan de construcción: Logis

> Tareas chicas y verificables, separadas por área. **Stack propuesto — confirmar antes de arrancar** (criterio: lo que ya conocen > lo novedoso).

## Stack propuesto

| Pieza | Elección | Por qué |
|---|---|---|
| `apps/web` | Vite + React + `@solana/kit` | Front funcional de la demo (apps/web-ui quedó como referencia de diseño) |
| `apps/api` | Node + Fastify + Prisma + SQLite | Cero infra que instalar; migra a Postgres si hace falta |
| `packages/shared` | Tipos TypeScript de contratos API | Matías los define primero: front mockea sin esperar al back |
| Onchain | Squads SDK (2/3) + SPL Token USDC devnet + memo con hash | Programa auditado ya deployado; cumple el requisito onchain |
| Wallets | Phantom vía wallet-standard (`@solana/kit-plugin-wallet`) | Implementado; Privy quedó descartado por tiempo (RF-02) |
| Deploy | Vercel (web) + Render/Railway (API) | URL pública para los jurados |

Reglas que aplican a TODO el trabajo: solo devnet, sin claves en repo/chat, toda tx se aprueba a mano mostrando destino/monto/token/red.

## Prioridades del pitch (innegociables)

Funciones "vitrina" — lo que el jurado debe ver funcionando. Si falta tiempo, el orden de recorte es: primero cae T3.5 (batch) y T2.7 (CSV), nunca esto:

- ⭐ **T2.4 Agente verificador** — el diferenciador vs CargoBill ("IA auditable")
- ⭐ **T2.3 Squads 2/3** — gobernanza real visible
- ⭐ **T2.5 Pago USDC con hash** — conciliación automática verificable en Explorer
- ⭐ **T2.6 Wallet firmante** — Phantom conectada y vinculada al usuario (criterio UX del jurado)
- ⭐ **T3.1 Dashboard conciliación** — la evidencia auditable en pantalla

---

## Bloque 0 — Arranque (~45 min, hoy)

| ID | Área | Tarea | Criterio de listo |
|---|---|---|---|
| T0.1 | Matías | Scaffold `apps/web` (Next.js) + `apps/api` (Express) + `packages/shared`, push a `main` | `npm run dev` levanta los dos |
| T0.2 | Matías | Deploys vacíos: web en Vercel, api en Render | URLs públicas responden |
| T0.3 | Luz+Luli | Pantalla de login + botón "conectar wallet" en devnet | Firma de prueba ok |
| T0.4 | Gonzalo+Maxi | Endpoint `GET /health` + conexión RPC devnet (público) | Devuelve slot actual |
| T0.5 | Matías | Contratos en `shared/`: `Proveedor`, `Factura`, `OrdenPago`, endpoints | Tipos commiteados, todos los ven |

## Bloque 1 — Esqueleto andante (hoy, ~3 h) — *demo pobre pero real*

| ID | Área | Tarea | Criterio de listo |
|---|---|---|---|
| T1.1 | BE Gonzalo | `POST /proveedores`, `GET /proveedores` (SQLite) | Crea y lista por curl |
| T1.2 | BE Maxi | `POST /facturas`, `GET /facturas` con estado `pendiente` | Idem |
| T1.3 | FE Luz | Pantallas: lista de proveedores + form de factura (datos mock de `shared`) | Se navega sin API real |
| T1.4 | FE Luli | Flujo de aprobación UI: vista de factura con botón "Aprobar" ×2 | 2 aprobaciones cambian el estado |
| T1.5 | BE Maxi | **Transfer USDC real en devnet** con hash de factura en memo (sin Squads todavía: firma wallet directa) | Tx visible en Solana Explorer devnet |
| T1.6 | FE Luli | Link "ver en Explorer" en la vista de factura pagada | Abre solscan/explorer devnet |

**Checkpoint:** ¿hay una demo? Objetivo: cargar factura → aprobar ×2 → USDC real en devnet → Explorer.

## Bloque 2 — Hacerlo real (días 2-4)

| ID | Área | Tarea | Criterio de listo |
|---|---|---|---|
| T2.1 | BE Gonzalo | Auth: login usuario/contraseña + roles (admin/jefe/supervisor/empleado) + JWT | Cada rol ve solo lo suyo |
| T2.2 | FE Luz | Pantallas por rol: empleado carga, jefe/supervisor/admin ven "pendientes de aprobación" | El empleado no puede aprobar |
| T2.3 | Matías | **Squads 2/3 real**: crear multisig devnet, proponer tx de pago, contar firmas | Requiere 2 aprobaciones on-chain |
| T2.4 | BE Maxi | **Agente verificador**: dado un pago aprobado, chequea (factura existe, proveedor registrado, monto = OC, no duplicado) → aprueba o marca | Pago con factura adulterada NO se ejecuta |
| T2.5 | BE Gonzalo | Wire completo: aprobación 2/3 → agente verifica → ejecución USDC con memo | Flujo E2E real en devnet |
| T2.6 | FE Luli | ~~Privy~~ Phantom via wallet-standard: cada firmante conecta su Phantom devnet y firma | 2 firmas desde cuentas distintas |
| T2.7 | FE Luz | Importador CSV de facturas en UI | Sube CSV → lista de facturas |
| T2.8 | Matías | Contrato final `shared/` + doc de endpoints para el equipo | Front y back alineados |

**Checkpoint:** ¿podemos mostrar la demo hoy? Si Squads+Phantom traba >1 día → plan B: firmas simuladas + pago real con memo (igual demuestra valor).

## Bloque 3 — Pulir la demo (días 5-7)

| ID | Área | Tarea | Criterio de listo |
|---|---|---|---|
| T3.1 | FE Luz | Dashboard de conciliación: factura ↔ aprobaciones ↔ tx ↔ hash verificable | Tabla completa con links |
| T3.2 | FE Luli | Estados vacíos, errores claros, loading en cada firma | Nada se rompe feo en vivo |
| T3.3 | BE Gonzalo | Historial auditable: quién firmó qué, cuándo, con qué resultado del agente | Se consulta por factura |
| T3.4 | BE Maxi | Datos de demo realistas (3 proveedores, 8-10 facturas, 1 rechazada por el agente) | Seed listo |
| T3.5 | Matías | Batch de pagos (varias facturas, 1 tx) — si el tiempo da | ≥10 facturas en 1 pago |
| T3.6 | Luz | Textos de la app + README en **inglés** (la entrega es en inglés) | Listo para jurados |

## Bloque final — Cierre (días 8-9)

| ID | Área | Tarea |
|---|---|---|
| T4.1 | Todos | **Congelar alcance: día 8 a las 18:00** — no se agregan funciones |
| T4.2 | Luz+Matías | Video demo 3 min + video pitch (inglés) — `/solana-tuc-pitch` |
| T4.3 | Gonzalo+Maxi | README, repo público, limpieza |
| T4.4 | Todos | Doble envío: Colosseum **y** Superteam Earn (antes del 12/10, ideal 10/10) |

## Riesgos y plan B

1. **Squads/Phantom traba la integración** → plan B: aprobaciones simuladas en API + pago USDC real con memo; sigue habiendo tx real on-chain.
2. **El agente queda tonto** → mostrar su checklist de verificación en la UI aunque sea reglas simples; "IA auditable" es la narrativa.
3. **RPC público devnet lento/caído** → RPC de Helius/Triton gratis (hub de Colosseum) o simular la demo con txs pregrabadas.

## Estado

> Actualizado al 09/10. El flujo completo está implementado (API + front Vite + Squads + agente);
> falta correrlo E2E en devnet con las wallets del equipo y el paquete de entrega.

- [x] Bloque 0 — Arranque
- [x] Bloque 1 — Esqueleto andante
- [x] Bloque 2 — Hacerlo real (Squads 2/3, agente verificador, CSV, Phantom; T2.6 fue Phantom en vez de Privy)
- [~] Bloque 3 — Pulir demo (hecho: dashboard, historial con checks del agente, seed realista, rebranding; falta: corrida E2E devnet, datos reales on-chain)
- [ ] Bloque final — Cierre (deploy + URL pública, README inglés, videos, doble envío)
