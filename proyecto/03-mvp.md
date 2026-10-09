# 03 — MVP: Logis

> Recorte a lo que entra en ~9 días y se demuestra en 3 minutos. Fuente: `docs/requerimientos.md` + `02-validacion.md`.

## La demo de 3 minutos

1. El **empleado** carga un proveedor y sube una factura (o importa un CSV).
2. **Jefe y supervisor** (2 de 3 firmantes) aprueban el pago on-chain vía Squads.
3. El **agente** verifica que la factura sea correcta (matching con OC, proveedor registrado, sin duplicados).
4. Se ejecuta el **pago USDC en devnet** con el hash de la factura en el memo.
5. El **dashboard de conciliación** muestra factura ↔ aprobaciones ↔ tx, con link al Solana Explorer.

Narrativa: *"Una empresa argentina aprueba y paga a su proveedor del exterior en 30 segundos, con evidencia auditable."*

**La demo gira alrededor de 2 momentos vitrina**: el **agente** mostrando su verificación en pantalla (checklist → decisión → ligada al tx) y la **tx verificable en Explorer** con el hash de la factura. Todo lo demás del flujo es soporte para esos dos momentos.

## Entra (MVP)

- Login con roles (administrador, jefe, supervisor, empleado) + wallet Phantom en devnet para firmar (wallet-standard vía `@solana/kit`; decisión tomada: Phantom en vez de Privy embebida).
- Alta de proveedores y carga de facturas (manual + CSV).
- Multisig 2/3 con **Squads**; quien carga no puede aprobar (separación de funciones).
- Agente verificador que ejecuta el pago **solo si la factura es correcta y ya tiene 2/3**.
- Pago USDC con hash de factura en memo; batch de varias facturas si sobra tiempo.
- Dashboard de conciliación + historial auditable.

## Después (si sobra tiempo, en este orden)

1. Batch de pagos.
2. Vista del proveedor ("te pagaron, acá está tu tx").
3. Escrow por confirmación de recepción.

## No entra

- Integraciones reales banco/contador/ERP (mock/CSV).
- Off-ramp fiat gestionado por la plataforma (el proveedor se arregla, RF-11).
- Programa propio, escrow, descuentos, x402, multi-moneda, privacidad ZK.
