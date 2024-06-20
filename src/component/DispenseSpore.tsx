import { Accessor, Setter, createEffect, createSignal } from "solid-js"
import { UseSolidAlgoWallets, UseNetwork } from "solid-algo-wallets"
import { AtomicTransactionComposer, AppCreateTxn } from "algosdk"
import { TransactionSignerAccount } from "@algorandfoundation/algokit-utils/types/account"
import { ellipseString, decimal } from "./SporeDiscountView"
import { type DispenserClient, Dispenser } from "./dapp/DispenserClient"
import { type VerifierClient, Verifier } from "./dapp/VerifierClient"
import { Transaction } from "algosdk"
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
}

const DispenseSpore = (props: PropTypes) => {
  const { address, transactionSigner } = UseSolidAlgoWallets
  const { algodClient, setActiveNetwork, networkNames, activeNetwork } = UseNetwork
  const [loading, setLoading] = createSignal(false)

  const sender = {
    addr: address(),
    signer: transactionSigner,
  }

  setActiveNetwork(networkNames.filter((n) => n === "LocalNet")[0])

  createEffect(() => {})

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

  return (
    <div class="flex w-full flex-1 flex-col items-center justify-center p-5 sm:min-h-full">
      <p class="p=2">
        Address: <span class="font-semibold">{ellipseString(address())}</span>
      </p>
      <p>
        Network: <span class="font-semibold">{`${activeNetwork()}`}</span>
      </p>
      <p>
        Spore:{" "}
        <span class="font-semibold">{`${(props.sporeAmount() / decimal).toPrecision(5)}`}</span>
      </p>

      <p class="flex justify-center text-red-400">Will automatically opt-in to SPORE!</p>
      <div class="flex w-full flex-col items-center justify-center gap-3 py-3">
        <button
          class="btn btn-primary h-14 w-[15rem] rounded-lg border bg-primary text-primary-content"
          onClick={() => createApps()}
        >
          Create Apps
        </button>
        <button
          class="btn btn-primary h-14 w-full rounded-lg border bg-primary text-primary-content lg:w-[15rem]"
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
