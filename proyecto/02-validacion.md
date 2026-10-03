# Validación de la idea — Logis

## La idea en una línea

"Ayudamos a empresas argentinas y extranjeras, de cualquier rubro, a gestionar y pagar a sus proveedores en USDC, para reducir la morosidad, la conciliación manual y los costos de pagos internacionales."

Versión angosta propuesta (ver "Patrón de mercado" — la cuña pide achicar): *"Ayudamos a empresas argentinas/latam a aprobar y pagar a sus proveedores del exterior en 30 segundos con USDC, con aprobación multisig y evidencia auditable on-chain."*

<!-- ✔ 1/9 -->

## Supuestos y evidencia

Respuestas del equipo (3/10/2026), con el nivel de evidencia real de cada una:

| # | Supuesto | Riesgo | Respuesta del equipo | ¿Evidencia o creencia? |
|---|---|---|---|---|
| 1 | Los proveedores aceptarían cobrar en USDC | Alto | "Baja posibilidad de que se nieguen: facilita el alta y la gestión, y da confiabilidad por el ingreso rápido del pago. Daremos capacitación al usuario." | **Creencia.** La capacitación reduce fricción pero la respuesta real la da preguntarle a proveedores reales (paso 7). |
| 2 | El dolor es real y fuerte | Alto | "Sí, es un dolor real: las demoras en los registros causan demoras en la producción y pérdidas a la empresa." | **Creencia plausible.** Falta nombrar un caso concreto con nombre y apellido (paso 7). |
| 3 | Entra en el tiempo disponible | Alto | "Es viable: con un tester dentro de la aplicación se demuestra cómo funciona el sistema y genera confiabilidad." | La respuesta habla de adopción, no de tiempo de construcción. El recorte real ya está en `docs/requerimientos.md`: Squads (no programa propio), integraciones mock, off-ramp al proveedor. Sigue siendo ambicioso. |
| 4 | Es operable legalmente | Medio | "Es operable porque blockchain es completamente auditable." | Atención: **auditable ≠ legal**. Lo que lo hace operable es otra cosa (verificada abajo). |
| 5 | Pagarían por usarla | Medio | "Sí: pueden reducir hasta 10 horas semanales de conciliación — saber qué factura generó cada pago y que el proveedor vea el pago realizado automáticamente." | **"10 horas semanales" es sin verificar** — si sale en el pitch, necesita una fuente o un caso real. El mecanismo de valor es correcto. |

### Lo legal — verificado con fuentes (3/10/2026)

- **Contratos pagaderos en USDC son válidos en Argentina**: el DNU 70/2023 modificó los arts. 765/766 del CCyC — se puede pactar pago "en moneda que sea o no de curso legal" y el deudor debe pagar en la especie pactada. [RCTZZ](https://www.rctzz.com.ar/es/insights/decreto-de-necesidad-y-urgencia-nd-70-2023-modificaciones-en-torno-a-obligaciones-en-moneda-extranjera-y-principios-contractuales)
- **El riesgo regulatorio es del producto, no del usuario**: Ley 27.739 + RG CNV 994/2024 y 1058/2025 — quien transfiere o custodia cripto *para terceros como negocio* es PSAV y debe registrarse. [RG 994](https://www.boletinoficial.gov.ar/detalleAviso/primera/305110/20240325) · [RG 1058](https://www.boletinoficial.gov.ar/detalleAviso/primera/322539/20250314)
- **Mitigación ya adoptada por el equipo**: diseño no-custodial (cada quien firma con su propia wallet, RNF-02/03 del doc de requerimientos) → la plataforma no toca fondos ni entra en la figura PSAV.
- **Sin verificar**: tratamiento tributario/contable de una factura pagada en USDC (pregunta para un contador real, paso 7).

<!-- ✔ 2/9 -->

## Competencia y patrón de mercado

### Hackathons Colosseum (vía Copilot, verificado 3/10/2026)

#### Casi idénticos

| Proyecto | Resultado | Qué hace | Link |
|---|---|---|---|
| CargoBill | **1.º Stablecoins $25k + Accelerator C3** (Breakout) | Pagos cross-border a proveedores con multisig no-custodial, metadata de factura + Bill of Lading on-chain, batch de 60 facturas, on-ramp Coinbase, yield treasury. La idea aplicada a freight | [colosseum](https://colosseum.com/projects/explore/cargobill) |
| Decimal | Sin premio (Frontier) | **Casi el scope exacto de Logis**: auth email/Google, Privy embedded wallets, Squads v4 2/3, LLM que parsea facturas PDF/imagen, CSV import, batch 8/tx, pruebas SHA-256, audit logs | [colosseum](https://colosseum.com/projects/explore/decimal) |
| KharchaPay | Sin premio (Frontier) | Procure-to-pay completo: roles (staff/approvers/auditors), matching factura↔OC, Memo Program para conciliación, ledger doble, QuickBooks, Circle | [colosseum](https://colosseum.com/projects/explore/kharchapay) |
| SettleDesk | Sin premio (Frontier) | **El agente de RF-06 ya existe**: IA verifica factura contra base local y ejecuta settlement on-chain solo si es correcta, con audit trail | [colosseum](https://colosseum.com/projects/explore/settledesk:-sovereign-financial-intelligence) |
| Trezo AI | Sin premio (Frontier) | Tesorería autónoma: LLM parsea PDFs → propuestas multisig on-chain, límites con Token-2022 hooks, off-ramp Coinflow | [colosseum](https://colosseum.com/projects/explore/trezo-ai) |

#### Relacionados

- **Mercantill** — 4.º Stablecoins $10k: controles de gasto/auditoría para agentes de IA sobre **Squads Grid**. La narrativa "agentes con riendas" ganó. [link](https://colosseum.com/projects/explore/mercantill)
- **Borderless Payroll Copilot** — escrow Anchor que libera pago al aprobar factura + reconciliación automática. [link](https://colosseum.com/projects/explore/borderless-payroll-copilot)
- **SecondSet** — tesorería 2-de-3 con separación de funciones (quien propone no aprueba). [link](https://colosseum.com/projects/explore/secondset)
- **stablecorp** — invoicing multi-rail ACH/SEPA/crypto + tesorería USDC + compliance. [link](https://colosseum.com/projects/explore/stablecorp)
- **Zoneless** — payouts masivos open-source estilo Stripe Connect. [link](https://colosseum.com/projects/explore/zoneless)
- **GhostPay B2B / CloakPayables / Nautilius** — variante con privacidad (ZK, viewing keys para auditores). [link](https://colosseum.com/projects/explore/ghostpay-b2b)

### Productos reales en el mercado (web, verificado 3/10/2026)

| Competidor | Qué hace | Dónde pisa |
|---|---|---|
| [Niural](https://www.niural.com/products/account-payable) | AP completo: captura de facturas con IA, aprobaciones multinivel, pago en 100+ monedas y **USDC/USDT en 11+ chains**, multi-sig | Casi la idea entera, ya construida (enterprise) |
| [Bitwave](https://www.bitwave.io/solutions/stablecoin-b2b-payments-enterprise-ar-ap) | Pagos B2B stablecoin enterprise: verificación de wallets de vendors, pagos en lote, sync ERP | Idem, foco enterprise |
| [StableRail](https://stablerail.com/guides/stablecoin-vendor-payments) | Tesorería stablecoin + pagos a proveedores con aprobaciones y evidencia auditable | Mismo flujo |
| [KryptoGO](https://docs.kryptogo.com/docs/enterprise-capabilities/use-cases/payments-treasury/03-invoice-approval-workflow) | SDK de facturas con aprobación y pago on-chain | La infra misma |
| [Nodu](https://nodu.fi/use-cases/supplier-payments/) | API de pagos a proveedores: cruza por stablecoin, llega en fiat local | Resuelve el off-ramp que nosotros dejamos al proveedor |
| Plan B real | Planilla + transferencia/Mercado Pago + WhatsApp | El competidor más difícil para proveedores locales |

### Patrón de mercado: **Clon vivo + commodity**

La mecánica está probada (CargoBill ganó; Niural/Bitwave la venden a enterprise). Acá no se compite por mecánica — se compite por **ejecución, UX y público**. La cuña honesta: **pyme latinoamericana** (todos los productos apuntan a enterprise/EU-US; nadie habla de contadores argentinos ni del contexto local) + el **agente que verifica la factura antes de pagar** (RF-06), que CargoBill no mostró.

Riesgo declarado: la frase dice "empresas de cualquier rubro y país" — eso es competir de igual a igual con Niural. La cuña pide angostar, no agrandar.

<!-- ✔ 3/9 -->

## Test de cadena

¿Qué no existiría (o sería mucho peor) sin blockchain?

- **Aprobaciones → multisig real:** "2 de 3 firmas para pagar" se implementa literal on-chain (Squads). En una planilla es un checkbox que cualquiera edita.
- **Pago con evidencia:** hash de factura en el transfer de USDC → conciliación automática + trail inmutable. Es lo que ganó con CargoBill.
- **Cross-border real:** USDC liquida en segundos vs SWIFT días + fees + FX opaco.
- **Ojo honesto (ya anotado en `01-idea.md`):** para proveedor **local**, Argentina tiene Transferencias 3.0 — crypto no suma velocidad ahí; el valor es workflow + auditoría. La demo debe enfocarse en cross-border.

Veredicto del test: **pasa**, con la condición de que el caso demostrado sea cross-border.

<!-- ✔ 4/9 -->

## Qué implementar de los precedentes (el modelo ganador)

Lección clave de la comparación: **CargoBill ganó con menos demo que Decimal** — Decimal tenía casi el stack completo de Logis y no ganó. La amplitud no gana; la cuña + la narrativa + la evidencia sí.

1. **La cuña (CargoBill):** vertical específico — pyme argentina/latam que paga al exterior. Números concretos en el pitch ("SWIFT: días y 3-7%; Logis: 30 segundos"). Batch de facturas en la demo (CargoBill mostró 60; con 10-15 ya se ve escala).
2. **UX invisible (Decimal):** Google login + **Privy embedded wallets** — el empleado no instala Phantom ni sabe qué es una wallet. Mata la objeción "las empresas no saben cripto". Prueba SHA-256 por orden de pago.
3. **Gobernanza (SecondSet):** separación de funciones — quien carga la factura no puede aprobarla; 2/3 con roles distintos.
4. **Agente con riendas (SettleDesk + Mercantill):** verifica (matching OC, duplicados, monto) y ejecuta solo post-aprobación. La verificación se muestra en UI + link al tx = "IA auditable".
5. **Metadata on-chain (CargoBill):** hash de factura + n° OC en el memo de cada transfer USDC → conciliación automática + ángulo anti-fraude.
6. **Tracción (CargoBill):** procesar volumen en devnet durante la hackathon y citar el número real en el pitch ($70k procesó CargoBill).

**No implementar (lección de KharchaPay):** integraciones ERP reales, fiat ramps reales, privacidad ZK, multi-moneda, ledger doble completo.

<!-- ✔ 5/9 -->

## Puntaje contra los criterios (1-5)

| Criterio | Puntaje | Justificación |
|---|---|---|
| Funcionalidad | 4 | El slice entra en ~9 días con Squads ya hecho; el riesgo es dispersarse |
| Impacto potencial | 4 | Mercado enorme (pagos B2B cross-border); CargoBill lo probó con inversores |
| Novedad | 2 | Espacio transitado: CargoBill ganó con esto, Decimal/KharchaPay lo replicaron. La cuña latam suma poco a novedad de mecánica |
| UX | 4 | Privy embedded wallets + flujo de 1 caso punta a punta es demo-able en 3 min |
| Open source / composabilidad | 4 | Squads + SPL Token + Memo Program; componemos primitivas existentes |
| Plan de negocio | 3 | Fee por pago + tesorería, pero off-ramp y distribución quedan por resolver |

**Media: 3.5** — se construye, pero hay que pelear Novedad con la cuña y la ejecución.

<!-- ✔ 6/9 -->

## Las 3 razones por las que esto fracasa

1. **Es un clon sin cuña defendible:** si la demo no transmite "argentina/latam + agente verificable", un jurado la lee como "CargoBill pero más chico".
2. **La verificación del agente queda cosmética:** si "factura correcta" es un `if` trivial, no impresiona; si es compleja, no entra en 9 días.
3. **Nadie real sufre esto en el equipo:** si no pueden nombrar usuarios concretos (test de mesa), el dolor es teórico y el pitch suena inventado.

<!-- ✔ 7/9 -->

## Test de mesa

**Pendiente — el equipo debe nombrar 3 personas reales** que hayan vivido este problema (contador, importadora, tesorero de pyme): qué hicieron, si pagaron por resolverlo o se resignaron. Si no hay nadie, asignar a quién le preguntan en la semana.

<!-- ✔ 8/9 -->

## Criterio de abortar

Si no logran nombrar ni 1 persona real que haya sufrido el dolor, o si al probar la integración Squads+Privy el flujo 2/3 no cierra en devnet en los primeros 2 días → angostar más (solo batch de pagos USDC con metadata, sin agente) o volver a `/solana-tuc-idea`.

## Veredicto

**Provisional — Construir con la cuña angosta** ("pyme argentina/latam → proveedores del exterior"), condicionado a:

- [ ] Confirmar la frase de una línea angosta (la actual compite de igual a igual con Niural)
- [ ] Completar el test de mesa (3 personas reales)

*03/10/2026 — secciones 1-4 por el equipo, 5-9 con investigación Copilot. Faltan las 2 respuestas para el veredicto final. Siguiente paso cuando cierre: `/solana-tuc-mvp`.*
