# 01 — Qué construir

## Equipo

- 5 integrantes: **Luz** (front 1), **Luli** (front 2), **Gonzalo** (back 1), **Maxi** (back 2), **Matías** (apoyo general / fullstack).
- División de trabajo y ramas: `EQUIPO.md`.

## La idea

Plataforma de **pagos a proveedores** para empresas: la empresa administra altas de proveedores, facturas, aprobaciones, ejecución del pago y conciliación — con pagos en **USDC on-chain sobre Solana**.

## Respuestas del equipo

- **Usuario concreto:** empresa con proveedores **locales y del exterior**.
- **Pago:** USDC on-chain (devnet).
- **Alcance:** pagos + alta de proveedores + aprobaciones + conciliación.
- **Problema que duele:** morosidad, conciliación manual, costos cross-border.
- **Regulación a considerar:** normativa argentina vigente sobre uso de cripto/blockchain (contexto del pitch, no una feature).
- **Integraciones deseadas:** bancos, contadores, proveedores — **en el hackathon van mockeadas** (CSV de facturas o API mock alcanza para la demo; ver "Lo que juega en contra").

## Investigación (Colosseum Copilot, sesión anterior)

### Precedente clave

**CargoBill** — 1.º Stablecoins, Breakout ($25k): pagos cross-border para logística/freight con wallets multisig no-custodiales, integración con software contable, y metadata de factura + Bill of Lading embebida en el pago on-chain. Es casi exactamente esta idea aplicada a freight: **mejor referencia y competidor más cercano**.

Otros: Zoneless (payouts masivos estilo Stripe Connect, open source), stablecorp (invoicing multi-rail ACH/SEPA/crypto + tesorería USDC), MCPay (pagos por agentes con x402 — feature futura).

### El core es el workflow (no el rail)

1. Alta de proveedores — datos fiscales, bancarios/wallet, KYB
2. Ingesta de facturas — upload, matching contra orden de compra y recepción
3. Flujo de aprobación — quién autoriza qué montos
4. Ejecución del pago — multi-rail
5. Conciliación y auditoría — qué se pagó, contra qué factura, cuándo

### Dónde Solana suma de verdad

- **Aprobaciones → multisig:** "dos firmas para autorizar un pago" se implementa literal con multisig (Squads). Factura aprobada cuando 2 de 3 responsables firman on-chain.
- **Pago con metadata:** hash de factura / n.º de OC en el transfer de USDC (memo / Token-2022) → conciliación automática + trail de auditoría inmutable. **Esto es lo que ganó con CargoBill.**
- **Cross-border real:** una empresa argentina/latam pagando al exterior evita SWIFT (días, fees, FX opaco). USDC liquida en segundos.
- **Escrow / pagos condicionados:** liberar pago al confirmar recepción, programado en un programa Anchor.
- **Descuento por pronto pago:** el proveedor cobra antes a cambio de un %, desde una vault on-chain.

## Por qué cadena (prueba de la planilla)

¿Andaría igual con una planilla + transferencia bancaria? **Parcialmente no**: una planilla registra pero no ejecuta — las aprobaciones multisig, el trail inmutable y el pago cross-border en segundos necesitan la cadena. **Ojo honesto:** si el proveedor es local y Argentina ya tiene transferencias instantáneas (QR/Transferencias 3.0), crypto no suma velocidad — ahí el valor es workflow + auditoría, no el rail.

## Slice recomendado para 5 personas (de la investigación)

> Alta de proveedor → carga de factura → **aprobación multisig 2/3** → pago USDC con hash de factura on-chain → dashboard de conciliación.

Narrativa: *"una empresa aprueba y paga a un proveedor del exterior en 30 segundos, con evidencia auditable"*.

## Lo que juega en contra

1. **Proveedor local + Transferencias 3.0:** crypto no suma velocidad local; el valor ahí es auditoría/aprobaciones. La demo debería enfocarse en el caso cross-border.
2. **Off-ramp del proveedor:** cobrar en USDC solo sirve si el proveedor quiere stablecoins o hay salida a fiat fácil. Definir quién absorbe esa fricción (¿la plataforma liquida a fiat local, o el proveedor recibe USDC y se arregla?).
3. **Integraciones ERP/bancos/contadores reales:** no se construyen en un hackathon — CSV o API mock alcanza para la demo.
4. **Regulación:** nombrarla en el pitch como contexto, no prometer compliance.

## Siguiente paso

`/solana-tuc-validar` — la investigación ya está hecha; esta skill la usa para dar veredicto y ajustar el slice.
