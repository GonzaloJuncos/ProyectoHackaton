# Requerimientos — Logis

> Documento interno del equipo, en español. La entrega final de la hackathon se redacta en inglés a partir de esto.

## 1. Introducción

**Logis** es una plataforma de gestión de pagos a proveedores para empresas. La empresa da de alta a sus proveedores, carga facturas, aprueba pagos con firma múltiple y paga en **USDC sobre Solana**, con un dashboard de conciliación que vincula cada factura con su transacción on-chain.

**Problema:** morosidad en pagos a proveedores, conciliación manual entre factura y pago, y costos/demoras del cross-border (SWIFT: días, fees, FX opaco).

**Usuario:** empresa con proveedores locales y del exterior.

## 2. Alcance

| Alcance | Incluye |
|---|---|
| **MVP (hackathon)** | Usuarios con roles → alta de proveedor → carga de factura → aprobación multisig 2/3 → pago USDC con hash de factura on-chain → dashboard de conciliación |
| **Visión futura** | Off-ramp a fiat gestionado por la plataforma, integraciones reales con bancos/contadores/ERP, escrow por recepción de mercadería, descuento por pronto pago, pagos por agentes (x402), KYB completo |

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | Login con usuario/contraseña y **roles internos**: administrador, jefe, supervisor, empleado | MVP |
| RF-02 | Conexión de wallet (Phantom) en **devnet** para las cuentas que firman aprobaciones | MVP |
| RF-03 | Alta y gestión de proveedores: datos de contacto/fiscales y wallet destino | MVP |
| RF-04 | Carga de facturas de forma manual y por CSV; referencia a orden de compra | MVP |
| RF-05 | Flujo de aprobación con **multisig 2/3 on-chain usando Squads** (SDK de Squads, ya auditado y deployado): el pago solo se ejecuta cuando 2 de 3 responsables firman (aprobadores: jefe, supervisor y administrador; el empleado carga pero no aprueba) | MVP |
| RF-06 | Ejecución del pago **exclusivamente en USDC**, con **hash de factura embebido** en la transacción (memo / Token-2022) | MVP |
| RF-07 | Dashboard de conciliación: cada factura vinculada a su pago y su tx on-chain | MVP |
| RF-08 | Historial auditable: consulta de transacciones y su evidencia | MVP |
| RF-09 | Soporte para proveedores locales y del exterior (la demo enfatiza cross-border) | MVP |
| RF-10 | Transparencia de cobro: el proveedor ve claramente que **cobra en USDC** y gestiona su propia salida a fiat (off-ramp a cargo del proveedor) | MVP |
| RF-11 | Integración con bancos, contadores y ERP reales | Futuro |
| RF-12 | Off-ramp a fiat gestionado por la plataforma | Futuro |
| RF-13 | Escrow / liberación de pago al confirmar recepción de mercadería | Futuro |
| RF-14 | Descuento por pronto pago (dynamic discounting desde vault on-chain) | Futuro |
| RF-15 | Pagos iniciados por agentes de IA (x402) | Futuro |
| RF-16 | Programa propio en la red (registro de facturas/aprobaciones on-chain), si se busca más novelty | Futuro |

### Roles internos

| Rol | Puede |
|---|---|
| Administrador | Gestionar usuarios y proveedores, configurar la empresa, **firmar aprobaciones** |
| Jefe | Revisar facturas y **firmar aprobaciones** |
| Supervisor | Revisar facturas y **firmar aprobaciones** |
| Empleado | Cargar facturas y proveedores; no aprueba pagos |

## 4. Requerimientos no funcionales

| ID | Requerimiento |
|---|---|
| RNF-01 | **Solo devnet** (red de prueba de Solana; la plata es de mentira y sale de un faucet). Jamás mainnet ni plata real |
| RNF-02 | Sin custodia de claves: la frase semilla y las claves privadas nunca van al chat ni al repo |
| RNF-03 | Toda transacción requiere aprobación manual del usuario, mostrando antes destino, monto, token y red |
| RNF-04 | Código open source con repositorio público (requisito de la competencia) |
| RNF-05 | La demo completa corre en ~3 minutos: un solo caso de uso de punta a punta |
| RNF-06 | URL pública accesible para los jurados (vale más que un link a GitHub) |
| RNF-07 | El pago on-chain liquida en segundos (el contraste con SWIFT es parte del pitch) |
| RNF-08 | Auditoría inmutable: la metadata de la factura queda trazable on-chain (RF-06) |
| RNF-09 | Web responsive; UX pensada para usuarios no-cripto (cada término técnico se explica o se oculta) |
| RNF-10 | Stack y librerías según skill `solana-dev` (librerías actuales, no las de tutoriales viejos) |
| RNF-11 | Interfaz y documentación interna **en español**; solo el código y la entrega final van en inglés |

## 5. Regulación

La normativa argentina vigente sobre uso de cripto/blockchain se menciona como **contexto en el pitch**; no se promete compliance ni se implementan features regulatorias en el MVP.

## 6. Decisiones tomadas

- Autenticación: usuario/contraseña + roles internos; la wallet se usa solo para firmar aprobaciones y pagos.
- Moneda: exclusivamente **USDC**.
- Off-ramp: a cargo del proveedor, comunicado con transparencia (RF-10).
- Multisig 2/3: se implementa con **Squads** (programa existente, auditado). Programa propio queda como opción futura (RF-16).
