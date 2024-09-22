import { Accessor, Setter, Show, createEffect, createSignal } from "solid-js"
import { UseSolidAlgoWallets, UseNetwork } from "solid-algo-wallets"
import { decimal } from "./SporeDiscountView"
import { type DispenserClient, Dispenser } from "./dapp/DispenserClient"
import { type VerifierClient } from "./dapp/VerifierClient"
import * as algokit from "@algorandfoundation/algokit-utils"
import algosdk from "algosdk"

type DispenserDispenseArgs = Dispenser["methods"]["dispense(uint64)void"]["argsObj"]

type PropTypes = {
  sporeAmount: Accessor<number>
  setSporeAmount: Setter<number>
  typedClient: DispenserClient
  verifierClient: VerifierClient
  assetId: DispenserDispenseArgs["assetId"]
  setAssetId: Setter<number>
  network: Accessor<string>
  setCurrentStep: Setter<number>
}

const DispenseSpore = (props: PropTypes) => {
  const [isLoading, setIsLoading] = createSignal(true)
  const [initialLoad, seInitalLoad] = createSignal(true)
  const { address, transactionSigner } = UseSolidAlgoWallets
  const { algodClient } = UseNetwork

  const sender = {
    addr: address(),
    signer: transactionSigner,
  }

  const dispense = async () => {
    setIsLoading(true)
    try {
      try {
        await algodClient().accountAssetInformation(address(), Number(props.assetId)).do()
      } catch (err) {
        // If errors, then opt into asset
        const suggestedParams = await algodClient().getTransactionParams().do()

        const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: sender.addr,
          to: sender.addr,
          assetIndex: Number(props.assetId),
          amount: 0,
          suggestedParams: suggestedParams,
        })
        // Send optInTxn
        await algokit.sendTransaction({ from: sender, transaction: optInTxn }, algodClient())
      }

      await props.typedClient.dispense(
        {
          assetId: props.assetId,
        },
        {
          sender,
          sendParams: {
            fee: algokit.microAlgos(2_000),
            populateAppCallResources: true,
          },
        },
      )
      const acctInfo = await algodClient()
        .accountAssetInformation(address(), Number(props.assetId))
        .do()
      props.setSporeAmount(Number(acctInfo["asset-holding"].amount))
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }

  createEffect(() => {
    if (props.sporeAmount() > 50 * decimal) {
      props.setCurrentStep(3)
    } else {
      seInitalLoad(false)
      setIsLoading(false)
    }
  })

  return (
    <div class="flex w-full flex-1 flex-col items-center justify-center p-2 sm:min-h-full sm:p-5">
      <Show
        when={!initialLoad()}
        fallback={<span class="loading loading-spinner loading-lg text-info" />}
      >
        <div>
          <p class="flex justify-center bg-gradient-to-r from-[#fa8cff] via-[#9182ff] to-[#0476ff] bg-clip-text p-5 text-center text-transparent">
            The app will opt-in to SPORE coin automatically
          </p>
          <div class="flex w-full flex-col items-center justify-center gap-3 py-3">
            <button
              class={`btn-grad-main h-14 w-full cursor-pointer rounded-lg border sm:w-[15rem]`}
              onClick={() => dispense()}
              disabled={isLoading()}
            >
              {isLoading() ? (
                <div class="pointer-events-none flex flex-row justify-center gap-2">
                  <span class="loading loading-spinner loading-sm " />
                  Dispensing
                </div>
              ) : (
                "Dispense"
              )}
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default DispenseSpore
