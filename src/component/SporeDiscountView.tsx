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
  receiverAddress?: string
  senderAddress?: string
}

const SporeDiscountView: Component = () => {
  const [currentStep, setCurrentStep] = createSignal(1)
  const [sporeAmount, setSporeAmount] = createSignal(0)
  const [assetId, setAssetId] = createSignal(0)
  const [verificationObject, setVerificationObject] = createStore<Verification>({})
  const { activeWallet, address, reconnectWallet, disconnectWallet } = UseSolidAlgoWallets
  const { algodClient, setActiveNetwork, networkNames, activeNetwork } = UseNetwork

  // App IDs
  const dispenserAppId = 1001
  const verifierAppId = 1006

  setActiveNetwork(networkNames.filter((n) => n === "LocalNet")[0])

  // Create DispenserClient and VerifierClient
  const typedClient = new DispenserClient(
    {
      resolveBy: "id",
      id: dispenserAppId,
    },
    algodClient(),
  )

  const verifierClient = new VerifierClient(
    {
      resolveBy: "id",
      id: verifierAppId,
    },
    algodClient(),
  )

  console.log(`network: ${activeNetwork()}`)

  const getState = async () => {
    try {
      const state = await typedClient.getGlobalState()
      setAssetId(Number(state.assetId?.asNumber() || 0))
      const acctInfo = await algodClient().accountAssetInformation(address(), assetId()).do()
      setSporeAmount(acctInfo["asset-holding"].amount)
      console.log(`assetID: ${state.assetId?.asNumber()}`)
    } catch (err) {
      console.log(err)
    }
  }

  onMount(() => {
    reconnectWallet()
  })

  createEffect(() => {
    if (activeWallet()) {
      afterConnected()
      setCurrentStep(2)
    } else {
      console.log("not connected")
      setCurrentStep(1)
    }
  })

  const afterConnected = async () => {
    try {
      await getState()
      console.log(sporeAmount() / decimal)
    } catch (err) {
      // If we land here it means the account doesn't have the asset
      console.log(err)
      setSporeAmount(0)
    }
  }

  const next = () => {
    if (currentStep() === 4) return
    setCurrentStep(() => currentStep() + 1)
  }

  const back = () => {
    if (currentStep() === 1) return
    setCurrentStep(() => currentStep() - 1)
  }

  return (
    <section class="flex min-h-full w-screen flex-col sm:max-w-2xl sm:px-12 lg:col-span-7 lg:px-10 lg:py-0">
      <div class="my-5 flex h-full max-w-2xl flex-col justify-center">
        <div class="flex h-32 flex-col items-center justify-center">
          <ul class="steps w-full">
            <li class={`step ${currentStep() >= 1 && "step-accent"}`}>Connect &#x200B</li>
            <li class={`step ${currentStep() >= 2 && "step-accent"}`}>Dispense</li>
            <li class={`step ${currentStep() >= 3 && "step-accent"}`}>Transact</li>
            <li class={`step ${currentStep() >= 4 && "step-accent"}`}>Verify </li>
          </ul>
        </div>
        <span class="relative mt-2 flex justify-center">
          <div class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75" />
          <span class="relative z-10 bg-white px-6" />
        </span>
        <div>
          <span class="flex justify-end p-2 pe-3 text-lg font-bold text-neutral-600">
            <div class="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                class="btn btn-square btn-ghost"
              >
                <Wallet />
              </div>
              <ul
                tabIndex={0}
                class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
              >
                <li class="">
                  <a onClick={() => disconnectWallet()}>Disconnect</a>
                </li>
              </ul>
            </div>
          </span>
        </div>
        <div class="flex h-32 flex-1 flex-col items-center justify-center gap-2 sm:h-full">
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
        <div class="flex flex-row items-center justify-center gap-4">
          <button
            class="btn h-14 w-40 rounded-lg border bg-primary text-primary-content"
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
