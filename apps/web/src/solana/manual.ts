// Firmante manual para la demo: permite operar sin Phantom importando una
// clave de devnet. La clave vive SOLO en sessionStorage de esta pestaña:
// nunca se envía al servidor ni se commitea. Al cerrar la pestaña desaparece.
// Modo prueba: solamente devnet.

import {
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  appendTransactionMessageInstructions,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  sendAndConfirmTransactionFactory,
  getSignatureFromTransaction,
  getBase58Encoder,
  assertIsTransactionWithBlockhashLifetime,
  pipe,
  type Instruction,
  type TransactionSigner,
} from "@solana/kit";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "logis_devnet_signer";
const RPC_URL = "https://api.devnet.solana.com";

// ---------- store mínimo con suscripción (compartido entre componentes) ----------

let signer: TransactionSigner | null = null;
const listeners = new Set<() => void>();
const notificar = () => listeners.forEach((l) => l());

export const getSignerManual = () => signer;
export const useSignerManual = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => signer
  );

const parsearClave = (texto: string): Uint8Array => {
  const t = texto.trim();
  // Formato JSON (solana-keygen): [12,34,...]
  if (t.startsWith("[")) {
    const arr = JSON.parse(t) as number[];
    return Uint8Array.from(arr);
  }
  // Base58 (export de Phantom)
  return Uint8Array.from(getBase58Encoder().encode(t));
};

/** Importa una clave secreta de devnet (base58 o JSON) y la usa como firmante. */
export const importarClaveDevnet = async (texto: string): Promise<TransactionSigner> => {
  const bytes = parsearClave(texto);
  const s = await createKeyPairSignerFromBytes(bytes);
  signer = s;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(bytes)));
  notificar();
  return s;
};

export const quitarSignerManual = () => {
  signer = null;
  sessionStorage.removeItem(STORAGE_KEY);
  notificar();
};

// Restaurar firmante si la pestaña se recargó (demo: sobrevive F5).
const guardado = sessionStorage.getItem(STORAGE_KEY);
if (guardado) {
  try {
    const bytes = Uint8Array.from(JSON.parse(guardado) as number[]);
    createKeyPairSignerFromBytes(bytes).then((s) => {
      signer = s;
      notificar();
    });
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

// ---------- envío de transacciones con el firmante manual ----------

const rpc = createSolanaRpc(RPC_URL);
const rpcSubscriptions = createSolanaRpcSubscriptions("wss://api.devnet.solana.com");
const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });

/**
 * Firma y envía instrucciones con la clave importada (sin extensión de wallet).
 * Devuelve la signature de la tx confirmada en devnet.
 */
export const enviarConSignerManual = async (
  ixs: Instruction[],
  signer: TransactionSigner
): Promise<string> => {
  const { value: blockhash } = await rpc.getLatestBlockhash().send();
  const mensaje = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(signer, m),
    (m) => appendTransactionMessageInstructions(ixs, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash, m)
  );
  const firmada = await signTransactionMessageWithSigners(mensaje);
  assertIsTransactionWithBlockhashLifetime(firmada);
  await sendAndConfirm(firmada, { commitment: "confirmed" });
  return getSignatureFromTransaction(firmada);
};
