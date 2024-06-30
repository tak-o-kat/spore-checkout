import { Component, createSignal, onMount, createEffect, Switch, Match } from "solid-js"
import { UseSolidAlgoWallets, UseNetwork } from "solid-algo-wallets"
import SolidWalletConnect from "./SolidWalletConnect"
import DispenseSpore from "./DispenseSpore"
import SelectSporeAmount from "./SelectSporeAmount"
import { Wallet } from "lucide-solid"
import { DispenserClient } from "./dapp/DispenserClient"
import { VerifierClient } from "./dapp/VerifierClient"
import VerifyTransaction from "./VerifyTransaction"
import { createStore } from "solid-js/store"
import { useGlobalContext, type Store } from "../context/store"


// App IDs
const DISPENSER_APP_ID = 692527663
const VERIFIER_APP_ID = 692527721

export function ellipseString(string = "", width = 4): string {
  return `${string.slice(0, width)}...${string.slice(-width)}`
}

export function precise(num: number): number {
  return parseFloat(num.toPrecision(2))
}

export const decimal = 1_000_000

export type Verification = {
  txnId?: string
  assetId?: number
  assetAmountSent?: number
  discountPercent?: number
  receiverAddress?: string
  senderAddress?: string
}

const SporeDiscountView: Component = () => {
  const store: Store = useGlobalContext()
  const [currentStep, setCurrentStep] = createSignal(1)
  const [sporeAmount, setSporeAmount] = createSignal(0)
  const [assetId, setAssetId] = createSignal(0)
  const [activeNet, setActiveNet] = createSignal("--")
  const [verificationObject, setVerificationObject] = createStore<Verification>({})
  const { activeWallet, address, reconnectWallet, disconnectWallet } = UseSolidAlgoWallets
  const { algodClient, setActiveNetwork, networkNames, activeNetwork } = UseNetwork

  setActiveNetwork(networkNames.filter((n) => n === "TestNet")[0])

  // Create DispenserClient and VerifierClient
  const typedClient = new DispenserClient(
    {
      resolveBy: "id",
      id: DISPENSER_APP_ID,
    },
    algodClient(),
  )

  const verifierClient = new VerifierClient(
    {
      resolveBy: "id",
      id: VERIFIER_APP_ID,
    },
    algodClient(),
  )

  const getAppState = async () => {
    try {
      const state = await typedClient.getGlobalState()
      setAssetId(Number(state.assetId?.asNumber() || 0))
      const acctInfo = await algodClient().accountAssetInformation(address(), assetId()).do()
      setSporeAmount(acctInfo["asset-holding"].amount)
    } catch (err) {
      console.log(err.message)
    }
  }

  const afterConnected = async () => {
    try {
      await getAppState()
      console.log(sporeAmount() / decimal)
    } catch (err) {
      // If we land here it means the account doesn't have the asset
      setSporeAmount(0)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address())
  }

  const disconnect = async () => {
    await disconnectWallet()
    if (store.state.discountApplied) {
      store.setState({
        ...store.state,
        showSporeView: false,
      })
    }
    setSporeAmount(0)
    setActiveNet("--")
    setCurrentStep(1)
  }

  onMount(() => {
    reconnectWallet()
  })

  createEffect(() => {
    if (activeWallet()) {
      afterConnected()
      setActiveNet(activeNetwork())
      setCurrentStep(2)
    } else {
      setCurrentStep(1)
    }
  })

  return (
    <section class="flex min-h-full w-screen flex-col sm:max-w-2xl sm:px-12 lg:col-span-7 lg:px-10 lg:py-0">
      <div class="my-5 flex h-full max-w-2xl flex-col justify-center">
        <div class="flex h-32 flex-col items-center justify-center">
          <ul
            data-theme="gradients"
            class="steps w-full text-neutral-content"
          >
            <li class={`step ${currentStep() >= 1 && "step-neutral text-slate-600"}`}>Connect</li>
            <li class={`step ${currentStep() >= 2 && "step-neutral text-slate-600"}`}>Dispense</li>
            <li class={`step ${currentStep() >= 3 && "step-neutral text-slate-600"}`}>Transact</li>
            <li class={`step ${currentStep() >= 4 && "step-neutral text-slate-600"}`}>Verify </li>
          </ul>
        </div>
        <span class="relative mt-2 flex justify-center">
          <div class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75" />
          <span class="relative z-10 bg-white px-6" />
        </span>
        <div class="flex flex-row items-center justify-end">
          <div class="flex flex-row gap-2">
            <span class="font-semibold">Address:</span>
            <span class="text-base">{ellipseString(address())}</span>
          </div>

          <div>
            <span class="flex justify-end p-2 pe-3 text-lg font-bold text-neutral-600">
              <div class="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  class="btn btn-square btn-ghost"
                >
                  <div
                    class="sm:tooltip-accent/5 sm:tooltip"
                    data-tip="Account Settings"
                  >
                    <Wallet />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  class="menu dropdown-content z-[1] w-64 rounded-box bg-base-100 p-2 shadow"
                >
                  <li
                    class=""
                    onClick={() => copyAddress()}
                  >
                    <div class="flex flex-row justify-between gap-2">
                      <span>{`Copy Address: `}</span>
                      <span>{ellipseString(address())} </span>
                    </div>
                  </li>
                  <li class="">
                    <div class="flex flex-row justify-between gap-2">
                      <span>Network:</span>
                      <span>{activeNet()}</span>
                    </div>
                  </li>
                  <li class="">
                    <div class="flex flex-row justify-between gap-2">
                      <span>Spore:</span>
                      <span>{sporeAmount() / decimal}</span>
                    </div>
                  </li>
                  <span class="my-2 flex items-center">
                    <span class="h-px flex-1 bg-gray-300" />
                  </span>
                  <li class="">
                    <a onClick={() => disconnect()}>Disconnect</a>
                  </li>
                </ul>
              </div>
            </span>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center sm:flex-1">
          <Switch>
            <Match when={currentStep() === 1}>
              <SolidWalletConnect />
            </Match>
            <Match when={currentStep() === 2}>
              <DispenseSpore
                sporeAmount={sporeAmount}
                setSporeAmount={setSporeAmount}
                typedClient={typedClient}
                verifierClient={verifierClient}
                assetId={assetId()}
                setAssetId={setAssetId}
                network={activeNetwork}
                setCurrentStep={setCurrentStep}
              />
            </Match>
            <Match when={currentStep() === 3}>
              <SelectSporeAmount
                sporeAmount={sporeAmount}
                setSporeAmount={setSporeAmount}
                assetId={assetId}
                verifierClient={verifierClient}
                setCurrentStep={setCurrentStep}
                setVerificationObj={setVerificationObject}
              />
            </Match>
            <Match when={currentStep() === 4}>
              <VerifyTransaction verificationObj={verificationObject} />
            </Match>
          </Switch>
        </div>
        {/* <div class="flex flex-row items-center justify-center gap-4">
          <button
            class="bg-teal-zeal btn rounded-lg border"
            onClick={() => back()}
          >
            <ArrowBigLeft />
          </button>
          <button
            class="btn rounded-lg border"
            onClick={() => next()}
          >
            <ArrowBigRight />
          </button>
        </div> */}
      </div>
    </section>
  )
}

export default SporeDiscountView
