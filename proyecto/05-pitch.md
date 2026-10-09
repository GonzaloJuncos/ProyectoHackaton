# 05 — Pitch y entrega: Logis

> Borrador para correr `/solana-tuc-pitch` encima. Todo el material de entrega va en **inglés**.

## Narrativa en una línea

*"Una empresa argentina aprueba y paga a su proveedor del exterior en 30 segundos, con evidencia auditable on-chain."*

## Diferenciadores (lo que nos separa)

1. **Agente verificador auditable** — no es "IA mágica": sus 4 checks se ven en pantalla y quedan en el audit log. El pago no sale si la factura no cierra.
2. **Gobernanza real** — Squads 2/3 on-chain, no un booleano en la base.
3. **Conciliación probatoria** — el hash SHA-256 de la factura viaja en el memo de la tx: cualquiera verifica en el Explorer que esa factura ↔ ese pago.
4. **Cuña cross-border** — el caso demo es proveedor de EE.UU./México cobrando en USDC al instante vs. días de SWIFT.

## Guion video demo (3 min, inglés)

| Tiempo | Escena |
|---|---|
| 0:00–0:20 | Problema: "SWIFT tarda días y la conciliación es manual" — mostrar una factura PDF |
| 0:20–0:50 | Empleado carga proveedor (Overseas Supplier, US) + factura con OC |
| 0:50–1:30 | Jefe propone el pago → conecta Phantom → firma. Supervisor entra y firma la 2da (se ve el 2/3 on-chain) |
| 1:30–2:00 | **Momento vitrina 1:** el agente muestra su checklist ✓✓✓✓ → ejecuta. Bonus: mostrar F-1002 rechazada (monto > OC → ✗) |
| 2:00–2:30 | **Momento vitrina 2:** link al Solana Explorer devnet — mostrar el memo `logis:factura:<hash>` |
| 2:30–3:00 | Dashboard de conciliación + historial auditable. Cierre: "cada pago es probatorio" |

## Guion video pitch (2–3 min, inglés)

- Hook: "Los pagos a proveedores en LATAM tardan días y nadie puede probar qué se pagó por qué."
- Producto: 30 seg del flujo.
- Por qué cripto y no una planilla: firmas reales, evidencia inmutable, liquidación en segundos cross-border.
- Modelo: fee por pago + SaaS de conciliación. Mercado: pymes arg/latam con proveedores del exterior.
- Cierre: devnet ahora; visión: off-ramp, escrow por recepción, x402.

## Checklist de entrega

- [ ] Video demo (≤3 min, inglés) — grabado con datos seed
- [ ] Video pitch (≤3 min, inglés)
- [ ] Repo público + README inglés ✅
- [ ] URL pública andando (Vercel + Render) o plan B: demo local
- [ ] Corrida E2E en devnet con tx real visible en Explorer (link guardado para el pitch)
- [ ] Trabajo previo declarado (el kit del repo es propio del equipo)
- [ ] Envío en **Colosseum** + **Superteam Earn** (dos portales distintos)
- [ ] Todos los integrantes con cuenta en Arena

## Antes de grabar — checklist técnico

- [ ] Phantom en devnet para los 3 firmantes, SOL devnet para fees (faucet Solana)
- [ ] Multisig creado y vault fondeado con USDC de faucet.circle.com
- [ ] Seed fresco (`npm run db:seed`), factura trampa F-1002 lista para mostrar rechazo
- [ ] RPC devnet responde rápido; si no, cambiar a Helius/Triton en `squads.ts`
