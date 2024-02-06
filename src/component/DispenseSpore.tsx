import { Accessor, Setter } from "solid-js"
import { UseSolidAlgoWallets } from "solid-algo-wallets"
import { ellipseString, decimal } from "./SporeDiscountView"

type PropTypes = {
  sporeAmount: Accessor<number>
  setSporeAmount: Setter<number>
}

const DispenseSpore = (props: PropTypes) => {
  const { address, disconnectWallet } = UseSolidAlgoWallets

  const dispense = async () => {
    // make an app call to the contract
    console.log("Calling app by it's dispense method")
  }

  return (
    <div class="mx-auto flex w-full flex-col px-6 sm:px-0">
      <form
        action="#"
        class="mt-2 flex flex-col"
      >
        <p class="">
          Address: <span class="font-semibold">{ellipseString(address())}</span>
        </p>
        <p class="">
          You currently have <span class="font-semibold">{props.sporeAmount() / decimal}</span>{" "}
          SPORE!
        </p>

        <p class="text-red-400">
          If your address hasn't opted into SPORE, it will do so when you dispense!
        </p>
        <div class="flex flex-col items-center justify-center gap-3 py-3">
          <button
            class="btn btn-primary h-14 w-[15rem] rounded-lg border bg-primary text-primary-content"
            onClick={() => dispense()}
          >
            Dispense
          </button>
          <button
            class="btn btn-primary h-14 w-[15rem] rounded-lg border bg-primary text-primary-content"
            onClick={() => disconnectWallet()}
          >
            Disconnect
          </button>
        </div>
      </form>
    </div>
  )
}

export default DispenseSpore
