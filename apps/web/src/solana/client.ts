import { createClient } from "@solana/kit";
import { solanaRpc } from "@solana/kit-plugin-rpc";
import { walletSigner } from "@solana/kit-plugin-wallet";

// Un solo cliente para toda la app: RPC de devnet + wallet conectada.
// La wallet conectada ocupa los roles payer/identity (firma aprobaciones, paga fees).
// transactionConfig version:1 — formato nuevo de transacciones (hasta 4096 bytes).
export const client = createClient()
  .use(walletSigner({ chain: "solana:devnet" }))
  .use(solanaRpc({ rpcUrl: "https://api.devnet.solana.com", transactionConfig: { version: 1 } }));

export type AppClient = Awaited<typeof client>;
