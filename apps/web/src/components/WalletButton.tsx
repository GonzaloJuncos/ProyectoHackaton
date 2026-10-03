import { useEffect } from "react";
import {
  useWallets,
  useConnectedWallet,
  useConnect,
  useDisconnect,
  WalletReadyGate,
} from "@solana/kit-plugin-wallet/react";
import type { AppClient } from "../solana/client";
import type { Usuario } from "@logis/shared";
import { api } from "../api";
import { useAuth } from "../auth";

const corta = (addr: string) => `${addr.slice(0, 4)}…${addr.slice(-4)}`;

function Botones({ client }: { client: AppClient }) {
  const wallets = useWallets(client);
  const connected = useConnectedWallet(client);
  const { dispatch: connect } = useConnect(client);
  const { dispatch: disconnect } = useDisconnect(client);
  const { usuario, actualizarUsuario } = useAuth();

  // Al conectar, la pubkey queda vinculada al usuario (RF-02: es la que firma aprobaciones).
  useEffect(() => {
    if (!connected || !usuario) return;
    const addr = connected.account.address;
    if (usuario.walletPubkey === addr) return;
    api<Usuario>("/usuarios/me/wallet", {
      method: "PUT",
      body: JSON.stringify({ walletPubkey: addr }),
    })
      .then(actualizarUsuario)
      .catch((e) => console.error("no se pudo vincular la wallet", e));
  }, [connected, usuario, actualizarUsuario]);

  if (!connected) {
    if (wallets.length === 0) {
      return (
        <span className="muted small" title="Instalá Phantom y recargá">
          sin wallet detectada
        </span>
      );
    }
    // Phantom primero en la lista
    const ordenadas = [...wallets].sort((a, b) =>
      (b.name === "Phantom" ? 1 : 0) - (a.name === "Phantom" ? 1 : 0)
    );
    return (
      <>
        {ordenadas.map((w) => (
          <button key={w.name} className="wallet-btn" onClick={() => connect(w)}>
            Conectar {w.name}
          </button>
        ))}
      </>
    );
  }

  const firmante = usuario?.walletPubkey === connected.account.address;

  return (
    <span className="wallet-info" title={connected.account.address}>
      <span className="wallet-dot" />
      <code>{corta(connected.account.address)}</code>
      <em className="muted small">{firmante ? "firmante" : "vinculando…"} · devnet</em>
      <button className="link" onClick={() => disconnect()}>desconectar</button>
      {!connected.supportedTransactionVersions.has(1) && (
        <p className="error small">Actualizá tu wallet para firmar transacciones v1.</p>
      )}
    </span>
  );
}

export default function WalletButton({ client }: { client: AppClient }) {
  return (
    <WalletReadyGate client={client} fallback={<span className="muted small">buscando wallets…</span>}>
      <Botones client={client} />
    </WalletReadyGate>
  );
}
