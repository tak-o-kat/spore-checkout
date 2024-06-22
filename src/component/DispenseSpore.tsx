import { Accessor, Setter, createEffect, createSignal, onMount } from "solid-js"
import { UseSolidAlgoWallets, UseNetwork } from "solid-algo-wallets"
import { AtomicTransactionComposer, AppCreateTxn } from "algosdk"
import { TransactionSignerAccount } from "@algorandfoundation/algokit-utils/types/account"
import { ellipseString, decimal } from "./SporeDiscountView"
import { type DispenserClient, Dispenser } from "./dapp/DispenserClient"
import { type VerifierClient, Verifier } from "./dapp/VerifierClient"
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
  const { address, transactionSigner } = UseSolidAlgoWallets
  const { algodClient } = UseNetwork
  const [loading, setLoading] = createSignal(false)

  const sender = {
    addr: address(),
    signer: transactionSigner,
  }

  const createApps = async () => {
    // make an app call to the contract
    console.log("Creating app")
    try {
      // Create the dispenser app
      await props.typedClient.create.createApplication({}, { sender })
      await props.typedClient.appClient.fundAppAccount({
        sender,
        amount: algokit.microAlgos(500_000),
      })

      await props.typedClient.createSporeAsset(
        { name: "SPORE coin", unitName: "SPORE" },
        {
          sender,
          sendParams: {
            fee: algokit.microAlgos(2_000),
          },
        },
      )
      const appId = await props.typedClient.appClient.getAppReference()
      const ref = await props.typedClient.appClient.getGlobalState()
      const balance = await props.typedClient.getAssetId({}, { sender })
      console.log(ref.assetId.value)
      console.log(`Dispenser: ${appId.appId}`)
      console.log(balance.return?.returnValue)

      // Create the verifier app
      await props.verifierClient.create.createApplication({}, { sender })
      await props.verifierClient.appClient.fundAppAccount({
        sender,
        amount: algokit.microAlgos(1_000_000),
      })

      await props.verifierClient.initVerifier(
        { assetId: BigInt(ref.assetId.value) },
        {
          sender,
          sendParams: {
            fee: algokit.microAlgos(2_000),
            populateAppCallResources: true,
          },
        },
      )

      const verifierRef = await props.verifierClient.appClient.getAppReference()
      const verifierState = await props.verifierClient.appClient.getGlobalState()

      console.log(verifierState.assetId.value)
      console.log(`Verifier: ${verifierRef.appId}`)

      props.setAssetId(Number(ref.assetId.value))
    } catch (err) {
      console.log(err)
    }
  }

  const dispense = async () => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  createEffect(() => {
    if (props.sporeAmount() > 50 * decimal) {
      props.setCurrentStep(3)
    }
  })

  return (
    <div class="flex w-full flex-1 flex-col items-center justify-center p-5 sm:min-h-full">
      <p class="flex justify-center text-base">The app will opt-in to SPORE if needed</p>
      <div class="flex w-full flex-col items-center justify-center gap-3 py-3">
        <button
          class="btn h-14 w-[15rem] rounded-lg border bg-primary bg-gradient-to-r from-[#fbcfe8] via-[#f0abfc] to-[#e879f9] text-primary-content"
          onClick={() => createApps()}
        >
          Create Apps
        </button>
        <button
          class="btn-grad-dispense h-14 w-[15rem] rounded-lg border "
          onClick={() => dispense()}
          disabled={loading()}
        >
          {loading() ? (
            <span class="loading loading-spinner loading-sm">Dispensing</span>
          ) : (
            "Dispense"
          )}
        </button>
      </div>
    </div>
  )
}

export default DispenseSpore
