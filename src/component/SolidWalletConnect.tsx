import { For } from "solid-js"
import { type WalletInterface } from "solid-algo-wallets"

type PropTypes = {
  walletInterfaces: WalletInterface[]
  connectWallet: (wallet: WalletInterface) => Promise<void>
}

const SolidWalletConnect = (props: PropTypes) => {
  return (
    <For
      each={Object.values(props.walletInterfaces).filter(
        (wallet) => !["MyAlgo", "MetaMask"].includes(wallet.name),
      )}
    >
      {(wallet) => (
        <div class="flex py-1">
          <button
            class="btn btn-accent w-60 rounded-lg"
            onClick={() => props.connectWallet(wallet)}
          >
            {wallet.image()}
          </button>
        </div>
      )}
    </For>
  )
}

export default SolidWalletConnect
