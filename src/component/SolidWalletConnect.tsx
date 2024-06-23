import { For } from "solid-js"
import { UseSolidAlgoWallets } from "solid-algo-wallets"
import { useGlobalContext, type Store } from "../context/store"

const SolidWalletConnect = () => {
  const store: Store = useGlobalContext()
  const { connectWallet, walletInterfaces } = UseSolidAlgoWallets
  return (
    <div class="flex w-full flex-1 flex-col items-center justify-center p-5 sm:min-h-full">
      <For
        each={Object.values(walletInterfaces).filter(
          (wallet) => !["MyAlgo", "MetaMask", "WalletConnect", "Ledger"].includes(wallet.name),
        )}
      >
        {(wallet) => (
          <div class="flex flex-col gap-1 py-1">
            <button
              class={`${store.state.discountApplied && "pointer-events-none"} btn w-60 rounded-lg border-none bg-gradient-to-r from-[#bfdbfe] to-[#a5f3fc] hover:bg-gradient-to-r hover:from-[#a5f3fc] hover:to-[#bfdbfe]`}
              onClick={() => connectWallet(wallet)}
              disabled={store.state.discountApplied}
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
