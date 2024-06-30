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
          <div class="flex w-full flex-col items-center justify-center gap-1 py-1">
            <button
              class={`${store.state.discountApplied && "pointer-events-none"} btn-grad-main flex w-full flex-col items-center justify-center rounded-lg border-none text-center sm:w-[15rem]`}
              onClick={async () => await connectWallet(wallet)}
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
