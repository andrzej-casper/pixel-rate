import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import invariant from 'tiny-invariant';
import useApp from '~/context';
import { useEffectOnce } from '~/hooks';

export type CasperWalletState = {
  /** contain wallet is locked flag */
  isLocked: boolean;
  /** if unlocked contain connected status flag of active key otherwise null */
  isConnected: boolean | null;
  /** if unlocked and connected contain active key otherwise null */
  activeKey: string | null;
};

export default function Wallet() {
  const [provider, setProvider] = useState(null);

  const { activeWalletKey, setActiveWalletKey } = useApp();

  const requestConnection = async () => {
    if (provider === null) {
      toast.error("Please make sure Casper Wallet is installed.");
      return;
    }

    if (await provider.isConnected()) {
      //console.log("already connected!");
      const key = await provider.getActivePublicKey();
      setActiveWalletKey(key);
    } else {
      //await provider.disconnectFromSite();
      let request_res = await provider.requestConnection();
      //console.log("Request", request_res);
    }
  }

  const handleConnected = useCallback((event: any) => {
    console.log("Got connected", event);

    const state: CasperWalletState = JSON.parse(event.detail);
    setActiveWalletKey(state.activeKey);
  }, [setActiveWalletKey]);

  const handleDisconnected = useCallback((event: any) => {
    console.log("Got disconnected", event);
  }, []);

  useEffectOnce(() => {
    try {
      const providerConstructor = window.CasperWalletProvider;
      invariant(providerConstructor, "CasperWalletProvider not found");
      //const provider = providerConstructor();
      setProvider(providerConstructor());
      console.log("Provider set");
    } catch (e) {
      console.error(e);
    }
  });

  useEffect(() => {
    if (provider === null) {
      return;
    }

    // Workaround for weird Casper Wallet issue.
    setTimeout(() => {
      window.addEventListener("casper-wallet:connected", handleConnected);
      window.addEventListener("casper-wallet:disconnected", handleDisconnected);
    }, 1000);

    return () => {
      window.removeEventListener("casper-wallet:connected", handleConnected);
      window.removeEventListener("casper-wallet:disconnected", handleDisconnected);
    };
  }, [provider, handleConnected, handleDisconnected]);

  return (
    <div className="container mx-auto">
      state: { activeWalletKey }
      <button onClick={() => requestConnection()}>x</button>
    </div>
  );
}