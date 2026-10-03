# Equipo y división de trabajo

5 personas, 4 computadoras. Trabajo por **ramas de GitHub**.

| Persona | Rol | Dueña de | No toca sin avisar |
|---|---|---|---|
| Luz | Frontend 1 | `apps/web/` — pantallas y UX | contratos en `packages/shared/` |
| Luli | Frontend 2 | `apps/web/` — wallet, estado, integración con API | `apps/api/` |
| Gonzalo | Backend 1 | `apps/api/` — endpoints y lógica | `apps/web/` |
| Maxi | Backend 2 | `apps/api/` — datos e integraciones onchain | `apps/web/` |
| Matías | Apoyo general (fullstack) | `packages/shared/` + `programa/` — contratos, glue, deploy | pisa todo, pero avisa |

Matías flota entre las 4 máquinas: destraba a quien esté frenado, lleva los contratos de `shared/` y los merges.

## Flujo con ramas

- **Nada directo a `main`.** Todo entra por PR.
- Nombre de rama: `<nombre>/<qué>` en minúsculas, ej: `luz/pantalla-deposito`, `gonzalo/api-depositos`, `matias/contratos-v1`.
- Un PR = una tarea chica que se puede verificar. Mejor 5 PRs chicos que uno grande al final del día.
- Quien abre el PR lo pasa por chat y otro lo mira. Matías prioriza los PRs de `packages/shared/` porque destraban a todos.
- `main` siempre tiene que andar: si algo rompe la demo, se revierte el PR, no se arregla encima.
- Antes de pushear: `git pull --rebase origin main` para achicar conflictos.

## Requisitos mínimos del proyecto

La entrega tiene que tener, como piso:

1. **Wallet** — un usuario real que conecta su wallet (Phantom en devnet) y necesita hacer una transacción. Vive en `apps/web` (Luli).
2. **Blockchain** — esa transacción viaja de verdad por la red de Solana en devnet, no es una simulación. Si el producto andaría igual con una planilla compartida, falta la parte onchain.
3. **Programa que corre en la red** — un programa propio desplegado en devnet con el que la transacción interactúa. Vive en `programa/` (Matías + Maxi) y se consume desde `apps/api` / `apps/web`.

Criterio de chequeo: la demo debe mostrar a un usuario firmando una transacción real en devnet que toca nuestro programa. Eso es lo que los jurados miran primero ("si puede existir sin cadena, lo notan").

## Reglas de trabajo conjunto

1. **Contratos primero.** Antes de que front y back avancen en paralelo, Matías define en `packages/shared/` los tipos y endpoints (request/response). Luz y Luli pueden mockear contra eso desde el minuto cero.
2. **Carpetas = permiso implícito.** Podés editar tu carpeta sin preguntar; fuera de ella, avisá en el grupo antes.
3. **Tareas chicas y verificables.** Cada tarea que se le pide al agente debe poder comprobarse en pantalla.
4. **Una sola fuente de verdad:** `proyecto/` tiene la memoria (idea, validación, MVP, plan). Si no está ahí, no existe.
5. **Solo devnet.** Nada de mainnet ni plata real. Frase semilla y claves privadas nunca en el chat ni en el repo.
6. Stack definitivo: se decide en `/solana-tuc-planificar` y se anota en `AGENTS.md`.

## Estructura

```
apps/
  web/         frontend (Luz + Luli)
  api/         backend (Gonzalo + Maxi)
packages/
  shared/      tipos, constantes y cliente compartidos (Matías)
programa/      programa onchain, si la idea lo necesita (Matías + Maxi)
proyecto/      memoria del equipo — lo escriben las skills
docs/          contexto de la hackathon
```
