# api — Backend

**Dueños:** Gonzalo + Maxi

- Gonzalo: endpoints y lógica de negocio.
- Maxi: persistencia e integraciones onchain (lecturas RPC, indexación, transacciones).

Expone los endpoints definidos en `packages/shared`. Si la API cambia, primero se actualiza el contrato en `shared` y se avisa al front.

Stack a definir en `/solana-tuc-planificar` (probable: Node + Fastify/Express u Hono).
