import { Component, createSignal, onMount, createEffect, Show, Switch, Match } from "solid-js"
import { UseSolidAlgoWallets, UseNetwork, NetworkName } from "solid-algo-wallets"
import SolidWalletConnect from "./SolidWalletConnect"
import { AssetHolding } from "algosdk/dist/types/client/v2/algod/models/types"
import DispenseSpore from "./DispenseSpore"
import SelectSporeAmount from "./SelectSporeAmount"

export function ellipseString(string = "", width = 4): string {
  return `${string.slice(0, width)}...${string.slice(-width)}`
}

export function precise(num: number): number {
  return parseFloat(num.toPrecision(2))
}

export const decimal = 1_000_000

const SporeDiscountView: Component = () => {
  const [currentStep, setCurrentStep] = createSignal(1)
  const [sporeAmount, setSporeAmount] = createSignal(0)
  const [assetId] = createSignal(513945448)
  const { activeWallet, walletName, address, reconnectWallet } = UseSolidAlgoWallets
  const { algodClient, setActiveNetwork, networkNames } = UseNetwork

  setActiveNetwork(networkNames.filter((n) => n === "TestNet")[0])

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

  const next = () => {
    setCurrentStep(() => currentStep() + 1)
  }

  const back = () => {
    setCurrentStep(() => currentStep() - 1)
  }

  return (
    <section class="flex max-w-2xl flex-col sm:px-12 lg:col-span-7 lg:px-16 lg:py-12">
      <div class="my-5 flex h-full max-w-2xl flex-col">
        <div class="flex w-[35rem] items-center justify-center">
          <ul class="steps w-full">
            <li class={`step ${currentStep() >= 1 && "step-neutral"}`}>Connect &#x200B</li>
            <li class={`step ${currentStep() >= 2 && "step-neutral"}`}>Get &#x200B</li>
            <li class={`step ${currentStep() >= 3 && "step-neutral"}`}>Select </li>
            <li class={`step ${currentStep() >= 4 && "step-neutral"}`}>Verify </li>
          </ul>
        </div>
        <div class="my-[5rem] flex flex-1 flex-col items-center gap-2">
          <Switch>
            <Match when={currentStep() === 1}>
              <div class="py-5">
                <SolidWalletConnect />
              </div>
            </Match>
            <Match when={currentStep() === 2}>
              <DispenseSpore
                sporeAmount={sporeAmount}
                setSporeAmount={setSporeAmount}
              />
            </Match>
            <Match when={currentStep() === 3}>
              <SelectSporeAmount
                sporeAmount={sporeAmount}
                setSporeAmount={setSporeAmount}
              />
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
