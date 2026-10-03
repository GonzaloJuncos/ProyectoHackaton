import { AccountRole, address, type Instruction } from "@solana/kit";
import type { AppClient } from "./client";

// Formato que devuelve la API (instrucción serializada).
export interface IxSerializada {
  programAddress: string;
  cuentas: { address: string; rol: "writable-signer" | "readonly-signer" | "writable" | "readonly" }[];
  data: string; // base64
}

const ROLES = {
  "writable-signer": AccountRole.WRITABLE_SIGNER,
  "readonly-signer": AccountRole.READONLY_SIGNER,
  writable: AccountRole.WRITABLE,
  readonly: AccountRole.READONLY,
} as const;

const aKitIx = (ix: IxSerializada): Instruction => ({
  programAddress: address(ix.programAddress),
  accounts: ix.cuentas.map((c) => ({ address: address(c.address), role: ROLES[c.rol] })),
  data: Uint8Array.from(atob(ix.data), (c) => c.charCodeAt(0)),
});

/**
 * Toma las instrucciones serializadas de la API, las firma con la wallet
 * conectada y las envía a devnet. Devuelve la signature.
 */
export const enviarInstrucciones = async (client: AppClient, ixs: IxSerializada[]) => {
  const kitIxs = ixs.map(aKitIx);
  const result = await client.sendTransaction(kitIxs);
  return result.context.signature;
};
