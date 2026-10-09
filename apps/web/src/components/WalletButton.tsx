import { useEffect, useState } from "react";
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
import {
  importarClaveDevnet,
  quitarSignerManual,
  useSignerManual,
} from "../solana/manual";

const corta = (addr: string) => `${addr.slice(0, 4)}…${addr.slice(-4)}`;
const PUBKEY_BASE58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function EntradaManual() {
  const signerManual = useSignerManual();
  const { usuario, actualizarUsuario } = useAuth();
  const [direccion, setDireccion] = useState("");
  const [clave, setClave] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  const vincular = async (pubkey: string) => {
    const u = await api<Usuario>("/usuarios/me/wallet", {
      method: "PUT",
      body: JSON.stringify({ walletPubkey: pubkey }),
    });
    actualizarUsuario(u);
  };

  const onVincular = async () => {
    setError(null);
    setMsg(null);
    const addr = direccion.trim();
    if (!PUBKEY_BASE58.test(addr)) {
      setError("dirección inválida (base58 de Solana)");
      return;
    }
    setOcupado(true);
    try {
      await vincular(addr);
      setMsg("wallet vinculada");
      setDireccion("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "no se pudo vincular");
    } finally {
      setOcupado(false);
    }
  };

  const onImportar = async () => {
    setError(null);
    setMsg(null);
    setOcupado(true);
    try {
      const s = await importarClaveDevnet(clave);
      await vincular(s.address);
      setMsg(`firmante devnet ${corta(s.address)} listo`);
      setClave("");
    } catch {
      setError("clave inválida — pegá el secret key en base58 o JSON");
    } finally {
      setOcupado(false);
    }
  };

  if (signerManual) {
    const coincide = usuario?.walletPubkey === signerManual.address;
    return (
      <div className="manual-wallet">
        <span className="small" title={signerManual.address}>
          firmante manual: <code>{corta(signerManual.address)}</code>
          {!coincide && <em className="error small"> ≠ wallet vinculada</em>}
        </span>
        <button className="link" onClick={quitarSignerManual}>quitar</button>
      </div>
    );
  }

  return (
    <div className="manual-wallet">
      <input
        className="manual-input"
        placeholder="dirección devnet (para vincular)"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />
      <button className="secundario small-btn" onClick={onVincular} disabled={ocupado || !direccion.trim()}>
        vincular
      </button>
      <details className="manual-clave">
        <summary className="muted small">¿Sin Phantom? firmá con clave devnet</summary>
        <input
          className="manual-input"
          type="password"
          placeholder="secret key devnet (base58 o JSON)"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />
        <p className="muted small">Solo en esta pestaña; nunca se envía al servidor.</p>
        <button className="secundario small-btn" onClick={onImportar} disabled={ocupado || !clave.trim()}>
          importar y firmar
        </button>
      </details>
      {msg && <p className="ok small">{msg}</p>}
      {error && <p className="error small">{error}</p>}
    </div>
  );
}

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
    return (
      <div className="wallet-box">
        {wallets.length === 0 ? (
          <span className="muted small">sin wallet detectada</span>
        ) : (
          [...wallets]
            .sort((a, b) => (b.name === "Phantom" ? 1 : 0) - (a.name === "Phantom" ? 1 : 0))
            .map((w) => (
              <button key={w.name} className="wallet-btn" onClick={() => connect(w)}>
                Conectar {w.name}
              </button>
            ))
        )}
        <EntradaManual />
      </div>
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
