# Validación de la idea — Logis

## La idea en una línea

"Ayudamos a empresas argentinas y extranjeras, de cualquier rubro, a gestionar y pagar a sus proveedores en USDC, para reducir la morosidad, la conciliación manual y los costos de pagos internacionales."

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

### Hackathons Colosseum (vía Copilot, sesión anterior — ver `proyecto/01-idea.md`)

- **CargoBill** — 1.º Stablecoins, Breakout ($25k). Pagos cross-border para logística/freight con multisig no-custodial, integración contable y hash de factura + Bill of Lading on-chain. **Casi esta misma idea, y ganó**: prueba que la mecánica convence a jurados.
- Zoneless (payouts masivos tipo Stripe Connect, open source), stablecorp (invoicing multi-rail + tesorería USDC), MCPay (pagos por agentes x402).
- Pendiente: pasada sin filtro de ganadores para ver si el espacio generalista es "cementerio" (requiere login de Copilot).

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
