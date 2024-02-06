import { For } from "solid-js"
import { type WalletInterface, UseSolidAlgoWallets } from "solid-algo-wallets"

const SolidWalletConnect = () => {
  const { connectWallet, walletInterfaces } = UseSolidAlgoWallets
  return (
    <For
      each={Object.values(walletInterfaces).filter(
        (wallet) => !["MyAlgo", "MetaMask"].includes(wallet.name),
      )}
    >
      {(wallet) => (
        <div class="flex py-1">
          <button
            class="btn btn-accent w-60 rounded-lg"
            onClick={() => connectWallet(wallet)}
          >
            {wallet.image()}
          </button>
        </div>
      )}
    </For>
  )
}

export default SolidWalletConnect
