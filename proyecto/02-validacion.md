# 02 — Validación: Logis

> Recopila la investigación de competencia (Colosseum Copilot, 03/10/2026) y el análisis del modelo ganador. Veredicto **provisional** al final — faltan 2 respuestas del equipo.

## La idea en una línea

*"Ayudamos a empresas argentinas/latam a aprobar y pagar a sus proveedores del exterior en 30 segundos con USDC, con aprobación multisig y evidencia auditable on-chain."*
(versión angosta propuesta — pendiente de confirmación del equipo)

## Supuestos peligrosos y su evidencia

| Supuesto | Tipo | Evidencia hoy |
|---|---|---|
| Las empresas de la región sufren el costo/lentitud de SWIFT al pagar proveedores del exterior | Dolor | Parcial: dolor documentado en la investigación (CargoBill, Credible); falta test de mesa con personas reales |
| El mercado quiere pagar en USDC aunque el proveedor reciba stablecoins y se arregle con el off-ramp | Uso | Sin verificar — fricción real del proveedor |
| Multisig + metadata on-chain + conciliación es suficiente diferenciación sobre planilla + banco | Valor | Verificado: CargoBill ganó con esa mecánica |
| El equipo puede construir el slice en ~9 días | Viabilidad | Parcial — depende de no dispersarse (ver slice) |

## Competencia (verificado con Colosseum Copilot)

### Casi idénticos

| Proyecto | Resultado | Qué hace | Link |
|---|---|---|---|
| CargoBill | **1.º Stablecoins $25k + Accelerator C3** (Breakout) | Pagos cross-border a proveedores con multisig no-custodial, metadata de factura + Bill of Lading on-chain, batch de 60 facturas, on-ramp Coinbase, yield treasury. La idea aplicada a freight | [colosseum](https://colosseum.com/projects/explore/cargobill) |
| Decimal | Sin premio (Frontier) | **Casi el scope exacto de Logis**: auth email/Google, Privy embedded wallets, Squads v4 2/3, LLM que parsea facturas PDF/imagen, CSV import, batch 8/tx, pruebas SHA-256, audit logs | [colosseum](https://colosseum.com/projects/explore/decimal) |
| KharchaPay | Sin premio (Frontier) | Procure-to-pay completo: roles (staff/approvers/auditors), matching factura↔OC, Memo Program para conciliación, ledger doble, QuickBooks, Circle | [colosseum](https://colosseum.com/projects/explore/kharchapay) |
| SettleDesk | Sin premio (Frontier) | **El agente de RF-06 ya existe**: IA verifica factura contra base local y ejecuta settlement on-chain solo si es correcta, con audit trail | [colosseum](https://colosseum.com/projects/explore/settledesk:-sovereign-financial-intelligence) |
| Trezo AI | Sin premio (Frontier) | Tesorería autónoma: LLM parsea PDFs → propuestas multisig on-chain, límites con Token-2022 hooks, off-ramp Coinflow | [colosseum](https://colosseum.com/projects/explore/trezo-ai) |

### Relacionados

- **Mercantill** — 4.º Stablecoins $10k: controles de gasto/auditoría para agentes de IA sobre **Squads Grid**. La narrativa "agentes con riendas" ganó. [link](https://colosseum.com/projects/explore/mercantill)
- **Borderless Payroll Copilot** — escrow Anchor que libera pago al aprobar factura + reconciliación automática (Helius webhooks). [link](https://colosseum.com/projects/explore/borderless-payroll-copilot)
- **SecondSet** — tesorería 2-de-3 con separación de funciones (quien propone no aprueba). [link](https://colosseum.com/projects/explore/secondset)
- **stablecorp** — invoicing multi-rail ACH/SEPA/crypto + tesorería USDC + compliance. [link](https://colosseum.com/projects/explore/stablecorp)
- **Zoneless** — payouts masivos open-source estilo Stripe Connect. [link](https://colosseum.com/projects/explore/zoneless)
- **GhostPay B2B / CloakPayables / Nautilius** — variante con privacidad (ZK, viewing keys para auditores). [link](https://colosseum.com/projects/explore/ghostpay-b2b)

## Patrón de mercado

**Clon vivo → Commodity, público libre.** CargoBill ya hizo la mecánica y ganó — la apuesta no es la mecánica sino la **cuña argentina/latam + ejecución**. Decimal y KharchaPay implementaron casi el mismo MVP y no ganaron: la amplitud de features no es la diferencia.

## Qué implementar de los precedentes (el modelo)

1. **La cuña (CargoBill):** vertical específico — empresas argentinas/latam que pagan al exterior. Números concretos en el pitch ("SWIFT: días y 3-7%; Logis: 30 segundos"). Batch de facturas en la demo (CargoBill mostró 60; con 10-15 ya se ve escala).
2. **UX invisible (Decimal):** Google login + **Privy embedded wallets** — el empleado no instala Phantom ni sabe qué es una wallet. Mata la objeción "las empresas no saben cripto". Prueba SHA-256 por orden de pago.
3. **Gobernanza (SecondSet):** separación de funciones — quien carga la factura no puede aprobarla; 2/3 con roles distintos.
4. **Agente con riendas (SettleDesk + Mercantill):** verifica (matching OC, duplicados, monto) y ejecuta solo post-aprobación. La verificación se muestra en UI + link al tx = "IA auditable".
5. **Metadata on-chain (CargoBill):** hash de factura + n° OC en el memo de cada transfer USDC → conciliación automática + ángulo anti-fraude.
6. **Tracción (CargoBill):** procesar volumen en devnet durante la hackathon y citar el número real en el pitch ($70k procesó CargoBill).

**No implementar (lección de KharchaPay):** integraciones ERP reales, fiat ramps reales, privacidad ZK, multi-moneda, ledger doble completo.

## Test de "¿por qué cadena?"

Sin blockchain el producto sería peor en 3 puntos concretos: (a) la aprobación multisig 2/3 no sería verificable ni ejecutable sin confiar en un servidor, (b) el pago cross-border tardaría días y costaría 3-7% en vez de segundos, (c) el trail de auditoría sería una planilla editable, no un registro inmutable con hash de factura. **La cadena es load-bearing.**

Ojo honesto: si el proveedor es local con Transferencias 3.0, crypto no suma velocidad — ahí el valor es solo workflow + auditoría. Por eso la cuña es cross-border.

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

## Las 3 razones por las que esto fracasa

1. **Es un clon sin cuña defendible:** si la demo no transmite "argentina/latam + agente verificable", un jurado la lee como "CargoBill pero más chico".
2. **La verificación del agente queda cosmética:** si "factura correcta" es un `if` trivial, no impresiona; si es compleja, no entra en 9 días.
3. **Nadie real sufre esto en el equipo:** si no pueden nombrar usuarios concretos (test de mesa), el dolor es teórico y el pitch suena inventado.

## Test de mesa

**Pendiente — el equipo debe nombrar 3 personas reales** que hayan vivido este problema (contador, importadora, tesorero de pyme): qué hicieron, si pagaron por resolverlo o se resignaron. Si no hay nadie, asignar a quién le preguntan en la semana.

## Criterio de abortar

Si no logran nombrar ni 1 persona real que haya sufrido el dolor, o si al probar la integración Squads+Privy el flujo 2/3 no cierra en devnet en los primeros 2 días → angostar más (solo batch de pagos USDC con metadata, sin agente) o volver a `/solana-tuc-idea`.

## Veredicto

**Provisional — Construir con la cuña angosta** ("importadores/empresas argentinas-latam → proveedores del exterior"), condicionado a:

- [ ] Confirmar la frase de una línea angosta
- [ ] Completar el test de mesa (3 personas reales)

*03/10/2026 — investigación Copilot completada; faltan las 2 respuestas del equipo para veredicto final.*
