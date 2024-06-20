import type { Accessor, Setter } from "solid-js"
import { createSignal, onMount, createMemo } from "solid-js"
import { type SetStoreFunction } from "solid-js/store"

import { UseSolidAlgoWallets, UseNetwork } from "solid-algo-wallets"
import { ellipseString, decimal, Verification } from "./SporeDiscountView"
import { TransactionSignerAccount } from "@algorandfoundation/algokit-utils/types/account"
import * as algokit from "@algorandfoundation/algokit-utils"
import {
  AtomicTransactionComposer,
  makeAssetTransferTxnWithSuggestedParamsFromObject,
} from "algosdk"
import { type VerifierClient } from "./dapp/VerifierClient"

import SporeIcon from "./SporeIcon"

type PropTypes = {
  sporeAmount: Accessor<number>
  setSporeAmount: Setter<number>
  assetId: Accessor<number>
  verifierClient: VerifierClient
  setCurrentStep: Setter<number>
  setVerificationObj: SetStoreFunction<Verification>
}

const SelectSporeAmount = (props: PropTypes) => {
  const [verifierAddress, setVerifierAddress] = createSignal("")
  const [sporeUsed, setSporeUsed] = createSignal(0)
  const [percent, setPercent] = createSignal(0)
  const [isDisabled, setIsDisabled] = createSignal(true)
  const [sendingTxn, setSendingTxn] = createSignal(false)
  const { address, transactionSigner } = UseSolidAlgoWallets
  const { algodClient, activeNetwork } = UseNetwork

  onMount(async () => {
    const ref = await props.verifierClient.appClient.getAppReference()
    setVerifierAddress(ref.appAddress)
  })

  const updateDiscount = (percent: string) => {
    // update the SPORE amount
    const numPercent = parseInt(percent)
    const MAX = 5000
    const sporeAmt = Math.floor(MAX * (numPercent / 100))
    if (props.sporeAmount() / decimal >= sporeAmt) {
      setPercent(numPercent)
      setSporeUsed(sporeAmt)
      const sporeLimit = props.sporeAmount() / decimal
      // Check and see if SporeUsed is more than Spore Amount
      setIsDisabled(sporeUsed() > sporeLimit || sporeUsed() === 0)
    } else {
      return
    }
  }

  const transactionSignerAccount = createMemo<TransactionSignerAccount>(() => ({
    addr: address(),
    signer: transactionSigner,
  }))

  const sendTxn = async () => {
    setSendingTxn(true)

    // Setup up transaction using an atomic transaction composer
    const suggestedParams = await algodClient().getTransactionParams().do()
    const assetTxn = makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: address(),
      to: verifierAddress(),
      amount: sporeUsed() * decimal,
      assetIndex: props.assetId(),
      suggestedParams,
    })
    const txn = await algokit.getTransactionWithSigner(assetTxn, transactionSignerAccount())
    const atc = new AtomicTransactionComposer()
    atc.addTransaction(txn)

    // Execute and save txn
    const result = await atc.execute(algodClient(), 4)

    props.setVerificationObj({
      txnId: result.txIDs[0],
      assetAmountSent: sporeUsed() * decimal,
      assetId: props.assetId(),
      receiverAddress: verifierAddress(),
      senderAddress: address(),
    })

    // Update Spore amount in user account
    const acctInfo = await algodClient()
      .accountAssetInformation(address(), Number(props.assetId()))
      .do()
    props.setSporeAmount(Number(acctInfo["asset-holding"].amount))

    setSendingTxn(false)
    props.setCurrentStep(4)
  }

  return (
    <div class="flex flex-1 flex-col items-center justify-center p-5 sm:min-h-full">
      <div
        class={`${sendingTxn() ? "visible" : "hidden"} absolute inset-0 z-10 flex w-full items-center justify-center opacity-0 transition-opacity`}
      />
      <div class="flex flex-col px-6 sm:px-0">
        <p>
          Spore: <span class="font-semibold">{`${props.sporeAmount() / decimal}`}</span>
        </p>
      </div>

      <div class="flex w-full flex-col justify-center gap-4 p-3">
        <div class="flex items-center justify-center p-4 text-gray-400">
          <input
            type="number"
            placeholder="20"
            class="w-full border-r bg-white pe-12 text-right text-5xl outline-none sm:w-[15rem]"
            value={percent()}
            disabled
          />
          <span class="absolute pr-12 text-2xl">%</span>
          <input
            type="number"
            placeholder="1000"
            class="w-full bg-white ps-12 text-left text-5xl outline-none sm:w-[15rem]"
            value={sporeUsed()}
            disabled
          />
          <span class="absolute fill-gray-400 pl-12">
            <SporeIcon />
          </span>
        </div>
        <div class="col-span-6 py-3">
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
      <div class="flex items-center justify-center bg-gradient-to-r from-[#fa8cff] via-[#9182ff] to-[#0476ff] bg-clip-text p-5 text-center text-transparent">
        Send SPORE coin to get a discount on your purchase
      </div>
      <div class="flex w-full justify-center py-5 sm:w-[12rem]">
        <button
          class="btn h-14 w-full rounded-lg border-none bg-gradient-to-r from-[#99f6e4] via-[#5eead4] to-[#2dd4bf] text-white"
          disabled={isDisabled()}
          onClick={sendTxn}
        >
          Send Spore
        </button>
      </div>
    </div>
  )
}

export default SelectSporeAmount
