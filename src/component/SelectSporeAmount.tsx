import type { Accessor, Setter } from "solid-js"
import { createSignal, onMount, createMemo } from "solid-js"
import { UseSolidAlgoWallets, UseNetwork } from "solid-algo-wallets"
import { ellipseString, decimal } from "./SporeDiscountView"
import { TransactionSignerAccount } from "@algorandfoundation/algokit-utils/types/account"
import * as algokit from "@algorandfoundation/algokit-utils"
import { AtomicTransactionComposer, makePaymentTxnWithSuggestedParamsFromObject } from "algosdk"

import SporeIcon from "./SporeIcon"

type PropTypes = {
  sporeAmount: Accessor<number>
  setSporeAmount: Setter<number>
}

const SelectSporeAmount = (props: PropTypes) => {
  const [sporeUsed, setSporeUsed] = createSignal(0)
  const [percent, setPercent] = createSignal(0)
  const [isDisabled, setIsDisabled] = createSignal(false)
  const [confirmedTxn, setConfirmedTxn] = createSignal("")

  const { address, transactionSigner } = UseSolidAlgoWallets
  const { algodClient, activeNetwork, getTxUrl } = UseNetwork

  const updateDiscount = (percent: string) => {
    // update the SPORE amount
    const numPercent = parseInt(percent)
    const MAX = 5000
    const sporeAmt = Math.floor(MAX * (numPercent / 100))

    setPercent(numPercent)
    setSporeUsed(sporeAmt)
    const sporeLimit = props.sporeAmount() / decimal
    // Check and see if SporeUsed is more than Spore Amount
    setIsDisabled(sporeUsed() > sporeLimit)
    console.log(sporeUsed())
    console.log(sporeLimit)
    console.log(isDisabled())
  }

  onMount(() => {
    console.log(props.sporeAmount())
  })

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
    <div class="flex flex-col items-start justify-center gap-5 px-3">
      <div class="flex flex-col px-6 sm:px-0">
        <p>
          Address: <span class="font-semibold">{ellipseString(address())}</span>
        </p>
        <p>
          Network: <span class="font-semibold">{`${activeNetwork()}`}</span>
        </p>
        <p>
          Spore:{" "}
          <span class="font-semibold">{`${(props.sporeAmount() / decimal).toPrecision(5)}`}</span>
        </p>
      </div>
      <div class="flex w-full flex-col gap-4">
        <div class="flex w-full items-center justify-center p-4 text-gray-400">
          <input
            type="number"
            placeholder="20"
            class="w-[15rem] border-r bg-white pe-12 text-right text-5xl outline-none"
            value={percent()}
            disabled
          />
          <span class="absolute pr-12 text-2xl">%</span>
          <input
            type="number"
            placeholder="1000"
            class="w-[15rem] bg-white ps-12 text-left text-5xl outline-none"
            value={sporeUsed()}
            disabled
          />
          <span class="absolute fill-gray-400 pl-12">
            <SporeIcon />
          </span>
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
      <div class="flex w-full py-5">
        <button
          class="btn btn-accent h-14 w-full rounded-lg  border bg-accent text-accent-content sm:w-[12rem]"
          disabled={isDisabled()}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default SelectSporeAmount
