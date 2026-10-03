// Adapter Squads v4 (multisig 2/3) — construye instrucciones on-chain y las
// devuelve SERIALIZADAS para que el front las firme con la wallet del usuario.
// Nunca se firma nada acá: toda firma la hace una wallet humana en el navegador.

import * as multisig from "@sqds/multisig";
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  SystemProgram,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export const RPC_DEVNET = "https://api.devnet.solana.com";
export const SQUADS_PROGRAM_ID = multisig.PROGRAM_ID.toBase58();
// USDC oficial de Circle en devnet. El vault se fondea con faucet.circle.com (devnet).
export const USDC_MINT_DEVNET = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
export const USDC_DECIMALS = 6;
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
// Permisos: Iniciar + Votar + Ejecutar (bitfield 1|2|4)
const PERMISOS_TODOS = { mask: 7 };

export const connection = new Connection(RPC_DEVNET, "confirmed");

export type RolCuenta = "writable-signer" | "readonly-signer" | "writable" | "readonly";

export interface IxSerializada {
  programAddress: string;
  cuentas: { address: string; rol: RolCuenta }[];
  data: string; // base64
}

const serializarIx = (ix: TransactionInstruction): IxSerializada => ({
  programAddress: ix.programId.toBase58(),
  cuentas: ix.keys.map((k) => ({
    address: k.pubkey.toBase58(),
    rol: k.isSigner ? (k.isWritable ? "writable-signer" : "readonly-signer") : k.isWritable ? "writable" : "readonly",
  })),
  data: Buffer.from(ix.data).toString("base64"),
});

const pk = (s: string) => new PublicKey(s);

/** Lee la treasury del ProgramConfig de Squads (la exige multisigCreateV2). */
const getTreasury = async () => {
  const [programConfigPda] = multisig.getProgramConfigPda({});
  const config = await multisig.accounts.ProgramConfig.fromAccountAddress(connection, programConfigPda);
  return config.treasury;
};

// ---------- 1. Crear el multisig de la empresa (una sola vez) ----------
// Instrucciones: crear multisig + crear ATA USDC del vault (para fondearlo).

export const infoCrearMultisig = async (firmantes: string[], creador: string) => {
  if (firmantes.length < 2) throw new Error("se necesitan al menos 2 firmantes con wallet vinculada");
  const createKey = Keypair.generate();
  const [multisigPda] = multisig.getMultisigPda({ createKey: createKey.publicKey });
  const [vaultPda] = multisig.getVaultPda({ multisigPda, index: 0 });
  const treasury = await getTreasury();

  const ixCreate = multisig.instructions.multisigCreateV2({
    treasury,
    creator: pk(creador),
    multisigPda,
    configAuthority: null,
    threshold: 2,
    members: firmantes.map((f) => ({ key: pk(f), permissions: PERMISOS_TODOS })),
    timeLock: 0,
    createKey: createKey.publicKey,
    rentCollector: null,
    memo: undefined,
  });

  const vaultAta = await getAssociatedTokenAddress(USDC_MINT_DEVNET, vaultPda, true);
  const ixAta = createAssociatedTokenAccountIdempotentInstruction(
    pk(creador), vaultAta, vaultPda, USDC_MINT_DEVNET, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
  );

  return {
    multisigAddress: multisigPda.toBase58(),
    vaultAddress: vaultPda.toBase58(),
    vaultUsdcAta: vaultAta.toBase58(),
    instrucciones: [serializarIx(ixCreate), serializarIx(ixAta)],
  };
};

// ---------- 2. Propuesta de pago para una factura ----------

export const infoPropuestaPago = async ({
  multisigAddress,
  creador,
  destinoWallet,
  montoUsd,
  facturaHash,
}: {
  multisigAddress: string;
  creador: string;
  destinoWallet: string;
  montoUsd: number;
  facturaHash: string;
}) => {
  const multisigPda = pk(multisigAddress);
  const cuenta = await multisig.accounts.Multisig.fromAccountAddress(connection, multisigPda);
  const transactionIndex = Number(cuenta.transactionIndex) + 1;
  const [vaultPda] = multisig.getVaultPda({ multisigPda, index: 0 });

  // Mensaje que ejecuta el multisig al aprobarse: transfer USDC vault→proveedor + memo con hash de factura.
  const vaultAta = await getAssociatedTokenAddress(USDC_MINT_DEVNET, vaultPda, true);
  const provAta = await getAssociatedTokenAddress(USDC_MINT_DEVNET, pk(destinoWallet), true);
  const microUsdc = BigInt(Math.round(montoUsd * 10 ** USDC_DECIMALS));

  const msg = new TransactionMessage({
    payerKey: vaultPda,
    recentBlockhash: PublicKey.default.toBase58(), // se recompila al ejecutar
    instructions: [
      createAssociatedTokenAccountIdempotentInstruction(
        vaultPda, provAta, pk(destinoWallet), USDC_MINT_DEVNET, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
      ),
      createTransferInstruction(vaultAta, provAta, vaultPda, microUsdc, [], TOKEN_PROGRAM_ID),
      new TransactionInstruction({
        programId: MEMO_PROGRAM_ID,
        keys: [],
        data: Buffer.from(`logis:factura:${facturaHash}`, "utf8"),
      }),
    ],
  });

  const ixVaultTx = multisig.instructions.vaultTransactionCreate({
    multisigPda,
    transactionIndex: BigInt(transactionIndex),
    creator: pk(creador),
    rentPayer: pk(creador),
    vaultIndex: 0,
    ephemeralSigners: 0,
    transactionMessage: msg,
    memo: undefined,
  });

  const ixPropuesta = multisig.instructions.proposalCreate({
    multisigPda,
    creator: pk(creador),
    rentPayer: pk(creador),
    transactionIndex: BigInt(transactionIndex),
  });

  const [proposalPda] = multisig.getProposalPda({ multisigPda, transactionIndex: BigInt(transactionIndex) });

  return {
    transactionIndex,
    proposalAddress: proposalPda.toBase58(),
    vaultAddress: vaultPda.toBase58(),
    montoMicroUsdc: microUsdc.toString(),
    instrucciones: [serializarIx(ixVaultTx), serializarIx(ixPropuesta)],
  };
};

// ---------- 3. Aprobar (cada firmante, on-chain) ----------

export const infoAprobar = ({
  multisigAddress,
  miembro,
  transactionIndex,
}: {
  multisigAddress: string;
  miembro: string;
  transactionIndex: number;
}) => {
  const ix = multisig.instructions.proposalApprove({
    multisigPda: pk(multisigAddress),
    transactionIndex: BigInt(transactionIndex),
    member: pk(miembro),
    memo: undefined,
  });
  return { instrucciones: [serializarIx(ix)] };
};

// ---------- 4. Ejecutar (una vez alcanzado el umbral) ----------

export const infoEjecutar = async ({
  multisigAddress,
  miembro,
  transactionIndex,
}: {
  multisigAddress: string;
  miembro: string;
  transactionIndex: number;
}) => {
  const result = await multisig.instructions.vaultTransactionExecute({
    connection,
    multisigPda: pk(multisigAddress),
    transactionIndex: BigInt(transactionIndex),
    member: pk(miembro),
  });
  return { instrucciones: [serializarIx(result.instruction)] };
};

// ---------- Lecturas on-chain ----------

export const leerPropuesta = async (multisigAddress: string, transactionIndex: number) => {
  const [proposalPda] = multisig.getProposalPda({
    multisigPda: pk(multisigAddress),
    transactionIndex: BigInt(transactionIndex),
  });
  try {
    const propuesta = await multisig.accounts.Proposal.fromAccountAddress(connection, proposalPda);
    const status = propuesta.status as { __kind: string };
    return {
      existe: true,
      status: status.__kind,
      aprobada: multisig.types.isProposalStatusApproved(propuesta.status),
      ejecutada: multisig.types.isProposalStatusExecuted(propuesta.status),
      votos: propuesta.approved.length,
    };
  } catch {
    return { existe: false, status: null, aprobada: false, ejecutada: false, votos: 0 };
  }
};

export const leerMiembrosMultisig = async (multisigAddress: string) => {
  const cuenta = await multisig.accounts.Multisig.fromAccountAddress(connection, pk(multisigAddress));
  return {
    umbral: cuenta.threshold,
    miembros: cuenta.members.map((m) => m.key.toBase58()),
    transactionIndex: Number(cuenta.transactionIndex),
  };
};
