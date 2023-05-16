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

export default function WalletButton({
  connectedCallback = (key: string) => {},
}) {
  const [provider, setProvider] = useState(null);

  const { activeWalletKey, setActiveWalletKey, unsetActiveWalletKey } = useApp();

  const requestConnection = async () => {
    if (provider === null) {
      toast.error("Please make sure Casper Wallet is installed.");
      return;
    }

    // ================
    // = Exercise 01b =
    // ================
    //
    // Use `provider` to check if wallet is already connected.
    // If yes, then store active account's *public key* in application
    // state, by calling `setActiveWalletKey(key)`.
    // Otherwise use `provider` to request wallet connection.
    //
    // Resources:
    // - https://github.com/make-software/casper-wallet-sdk#methods
    //
    if (await provider.isConnected()) {
      const key = await provider.getActivePublicKey();
      setActiveWalletKey(key);
    } else {
      await provider.requestConnection();
    }
  }

  const handleConnected = useCallback((event: any) => {
    console.log("Got connected", event);

    // ================
    // = Exercise 01c =
    // ================
    //
    // Parse callback data - `event` - to extract active public key.
    //
    // Resources:
    // - https://github.com/make-software/casper-wallet-sdk#casperwalletstate
    //
    const state: CasperWalletState = JSON.parse(event.detail);
    const activePublicKey = state.activeKey;

    setActiveWalletKey(activePublicKey);
    connectedCallback(activePublicKey);
  }, [setActiveWalletKey]);

  const handleDisconnected = useCallback((event: any) => {
    console.log("Got disconnected", event);
    unsetActiveWalletKey();
  }, [unsetActiveWalletKey]);

  useEffectOnce(() => {
    // ================
    // = Exercise 01a =
    // ================
    //
    // Get Casper Wallet provider that is injected by browser extension.
    // Store it in this component, using `setProvider(provider)` call.
    //
    // Resources:
    // - https://github.com/make-software/casper-wallet-sdk#installation
    // - https://github.com/make-software/casper-wallet-sdk#usage
    //
    try {
      const providerConstructor = window.CasperWalletProvider;
      invariant(providerConstructor, "CasperWalletProvider not found");
      setProvider(providerConstructor());
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
    <button type="button" className="w-full rounded bg-primary-500  px-4 py-2 text-white hover:bg-primary-600"
      onClick={() => requestConnection()}
    >
      {activeWalletKey === null && <>Connect with <strong>Casper Wallet</strong></>}
      {activeWalletKey !== null && <><strong>Casper Wallet</strong> connected!</>}
    </button>
  );
}