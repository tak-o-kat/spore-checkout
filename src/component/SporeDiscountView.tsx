import {
  Component,
  createSignal,
  onMount,
  createEffect,
  createMemo,
  Show,
  Switch,
  Match,
} from "solid-js"
import { TransactionSignerAccount } from "@algorandfoundation/algokit-utils/types/account"
import * as algokit from "@algorandfoundation/algokit-utils"
import { AtomicTransactionComposer, makePaymentTxnWithSuggestedParamsFromObject } from "algosdk"
import { UseSolidAlgoWallets, UseNetwork, NetworkName } from "solid-algo-wallets"
import { createStore } from "solid-js/store"
import SolidWalletConnect from "./SolidWalletConnect"
import { AssetHolding } from "algosdk/dist/types/client/v2/algod/models/types"

export function ellipseString(string = "", width = 4): string {
  return `${string.slice(0, width)}...${string.slice(-width)}`
}

const decimal = 1_000_000

const SporeDiscountView: Component = () => {
  const [currentStep, setCurrentStep] = createSignal(1)
  const [percent, setPercent] = createSignal(0)
  const [sporeAmount, setSporeAmount] = createSignal(0)
  const [assetId] = createSignal(513945448)
  const {
    activeWallet,
    walletName,
    address,
    connectWallet,
    reconnectWallet,
    disconnectWallet,
    walletInterfaces,
    transactionSigner,
  } = UseSolidAlgoWallets
  const { algodClient, activeNetwork, setActiveNetwork, networkNames, getTxUrl } = UseNetwork
  const [confirmedTxn, setConfirmedTxn] = createSignal("")

  setActiveNetwork(networkNames.filter((n) => n === "TestNet")[0])

  onMount(() => {
    reconnectWallet()
  })

  createEffect(() => {
    if (activeWallet()) {
      connected()
    }
  })

  const connected = async () => {
    console.log(ellipseString(address()))
    console.log(walletName())
    try {
      const acctInfo = await algodClient().accountAssetInformation(address(), assetId()).do()
      setSporeAmount(acctInfo["asset-holding"].amount)
      console.log(sporeAmount())
    } catch (err) {
      console.log(err)
      setSporeAmount(0)
    }
  }

  const dispense = async () => {
    // make an app call to the contract
    console.log("Calling app by it's dispense method")
  }

  const next = () => {
    setCurrentStep(() => currentStep() + 1)
  }

  const back = () => {
    setCurrentStep(() => currentStep() - 1)
  }

  const updateDiscount = (percent: string) => {
    // update the SPORE amount
    const numPercent = parseInt(percent)
    const MAX = 5000
    const sporeAmt = MAX * (numPercent / 100)
    setPercent(numPercent)
    setSporeAmount(sporeAmt)
  }

  const transactionSignerAccount = createMemo<TransactionSignerAccount>(() => ({
    addr: address(),
    signer: transactionSigner,
  }))

  async function sendTxn() {
    setConfirmedTxn("")
    const suggestedParams = await algodClient().getTransactionParams().do()

    const payTxn = makePaymentTxnWithSuggestedParamsFromObject({
      from: address(),
      to: address(),
      amount: 0,
      suggestedParams,
    })
    const txn = await algokit.getTransactionWithSigner(payTxn, transactionSignerAccount())

    const atc = new AtomicTransactionComposer()
    atc.addTransaction(txn)
    const result = await atc.execute(algodClient(), 4)
    console.log("Txn confirmed: ", result)
    setConfirmedTxn(result.txIDs[0])
  }

  return (
    <section class="flex max-w-2xl flex-col sm:px-12 lg:col-span-7 lg:px-16 lg:py-12">
      <div class="my-5 flex h-full max-w-2xl flex-col">
        <div class="flex">
          <ul class="steps">
            <li class={`step ${currentStep() >= 1 && "step-neutral"}`}>Connect Wallet</li>
            <li class={`step ${currentStep() >= 2 && "step-neutral"}`}>Get SPORE</li>
            <li class={`step ${currentStep() >= 3 && "step-neutral"}`}>Select Discount Amount</li>
            <li class={`step ${currentStep() >= 4 && "step-neutral"}`}>Sign Transaction</li>
            <li class={`step ${currentStep() >= 5 && "step-neutral"}`}>Verify</li>
          </ul>
        </div>
        <div class="flex flex-1 flex-col items-center justify-center gap-2">
          <Switch>
            <Match when={currentStep() === 1}>
              <div class="py-5">
                <SolidWalletConnect
                  walletInterfaces={walletInterfaces}
                  connectWallet={connectWallet}
                />
              </div>
            </Match>
            <Match when={currentStep() === 2}>
              <div class="mx-auto flex w-full flex-col px-6 sm:px-0">
                <form
                  action="#"
                  class="mt-2 flex flex-col"
                >
                  <p class="">
                    Address: <span class="font-semibold">{ellipseString(address())}</span>
                  </p>
                  <p class="">
                    You currently have <span class="font-semibold">{sporeAmount() / decimal}</span>{" "}
                    SPORE!
                  </p>

                  <p class="text-red-400">
                    If your address hasn't opted into SPORE, it will do so when you dispense!
                  </p>
                  <div class="flex items-center justify-center py-3">
                    <button
                      class="h-14 w-[15rem] rounded-lg border bg-primary text-primary-content"
                      onClick={() => dispense()}
                    >
                      Dispense
                    </button>
                  </div>
                </form>
              </div>
            </Match>
            <Match when={currentStep() === 3}>
              <div class="mx-auto flex flex-col px-6 sm:px-0">
                <p>
                  Address:{" "}
                  <span class="font-semibold">{`${address().slice(0, 5)}...${address().slice(-5)}`}</span>
                </p>
                <p>
                  Network: <span class="font-semibold">{`${activeNetwork()}`}</span>
                </p>
              </div>
              <div class="flex w-full flex-col gap-4">
                <div class="flex w-full items-center justify-center p-4 text-gray-400">
                  <input
                    type="number"
                    placeholder="20%"
                    class="w-40 border-r bg-white p-3 text-right text-5xl outline-none"
                    value={percent()}
                  />
                  <input
                    type="number"
                    placeholder="1000"
                    class="col-span-2 w-40 bg-white p-2 text-left text-5xl outline-none"
                    value={sporeAmount()}
                  />
                </div>
                <div class="col-span-6">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={percent()}
                    onInput={(e) => updateDiscount(e.currentTarget.value)}
                    class="range range-accent range-lg"
                    step="1"
                  />
                  <div class="flex w-full justify-between px-2 text-xs">
                    <span>0%</span>
                    <span>5%</span>
                    <span>10%</span>
                    <span>15%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>
            </Match>
            <Match when={currentStep() === 4}>hi</Match>
          </Switch>
        </div>
        <div class="flex flex-row items-center justify-center gap-4">
          <button
            class="btn btn-primary h-14 w-40 rounded-lg border bg-primary text-primary-content"
            onClick={() => back()}
          >
            Cancel
          </button>
          <button
            class="btn btn-primary h-14 w-40 rounded-lg border bg-primary text-primary-content"
            onClick={() => next()}
          >
            Skip
          </button>
        </div>
      </div>
    </section>
  )
}

export default SporeDiscountView
