import { For } from "solid-js"
import { type WalletInterface, UseSolidAlgoWallets } from "solid-algo-wallets"

const SolidWalletConnect = () => {
  const { connectWallet, walletInterfaces } = UseSolidAlgoWallets
  return (
    <div class="flex w-full flex-1 flex-col items-center justify-center p-5 sm:min-h-full">
      <For
        each={Object.values(walletInterfaces).filter(
          (wallet) => !["MyAlgo", "MetaMask"].includes(wallet.name),
        )}
      >
        {(wallet) => (
          <div class="flex gap-4 py-1">
            <button
              class="btn btn-accent w-60 rounded-lg"
              onClick={() => connectWallet(wallet)}
            >
              {wallet.image()}
            </button>
          </div>
        )}
      </For>
    </div>
  )
}

export default SolidWalletConnect
