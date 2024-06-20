import algosdk from "algosdk"
import { UseNetwork } from "solid-algo-wallets"
import { Show, onMount, createSignal } from "solid-js"
import { UserRound, ReceiptText, BadgeCheck, ArrowRightLeft } from "lucide-solid"

import { Verification, decimal } from "./SporeDiscountView"
import { ellipseString } from "./SporeDiscountView"
import SporeIcon from "./SporeIcon"

type PropTypes = {
  verificationObj: Verification
}

const VerifyTransaction = (props: PropTypes) => {
  const [isLoading, setIsLoading] = createSignal(true)
  const { algodClient, activeNetwork } = UseNetwork

  onMount(async () => {
    console.log(props.verificationObj)
    try {
      const pending = await algodClient()
        .pendingTransactionInformation(props.verificationObj.txnId)
        .do()
      console.log(pending)
      const rcvArray = pending?.txn?.txn?.arcv
      const sendArray = pending?.txn?.txn?.snd
      const assetID = pending?.txn?.txn?.xaid
      const assetAmountSent = pending?.txn?.txn?.aamt

      const rcvAddress = algosdk.encodeAddress(rcvArray)
      const sendAddress = algosdk.encodeAddress(sendArray)

      console.warn(rcvAddress)
      console.warn(sendAddress)
      console.warn(assetID)
      console.warn(assetAmountSent / decimal)
    } catch (err) {
      console.log(err.message)
    }
    setIsLoading(false)
  })
  return (
    <div class="flex flex-row items-center justify-center py-4">
      <div class="flex flex-col items-center justify-center gap-2">
        <Show
          when={!isLoading()}
          fallback={<div>Loading...</div>}
        >
          <div class="flex text-lg text-success">Successfully applied discount!</div>
          <div class="flex p-4 text-sm">
            Disconnect your wallet and proceed to our secured payment portal
          </div>
          <div class="stats stats-vertical bg-slate-50 shadow sm:stats-horizontal">
            <div class="stat">
              <div class="stat-figure text-neutral">
                <UserRound />
              </div>
              <div class="stat-title">User Account</div>
              <div class="stat-value w-32 text-xl ">
                {ellipseString(props.verificationObj.senderAddress)}
              </div>
              <div class="stat-desc flex flex-row items-center gap-2">
                <BadgeCheck />
                <span>Verfied</span>
              </div>
            </div>

            <div class="stat">
              <div class="stat-figure text-neutral">
                <ReceiptText />
              </div>
              <div class="stat-title">Contract Account</div>
              <div class="stat-value text-xl">
                {ellipseString(props.verificationObj.receiverAddress)}
              </div>
              <div class="stat-desc flex flex-row items-center gap-2">
                <BadgeCheck />
                <span>Verfied</span>
              </div>
            </div>
          </div>
          <div class="stats stats-vertical bg-slate-50 shadow sm:stats-horizontal ">
            <div class="stat">
              <div class="stat-figure fill-current text-neutral">
                <ArrowRightLeft />
              </div>
              <div class="stat-title">Transaction ID</div>
              <div class="stat-value w-32 text-xl">{`${ellipseString(props.verificationObj.txnId)}`}</div>
              <div class="stat-desc flex flex-row items-center gap-2">
                <BadgeCheck />
                <span>Verfied</span>
              </div>
            </div>
            <div class="stat">
              <div class="stat-figure fill-current text-neutral">
                <SporeIcon />
              </div>
              <div class="stat-title">SPORE coin sent</div>
              <div class="stat-value text-xl">{`${"asdf"} - ${props.verificationObj.assetAmountSent / decimal}`}</div>
              <div class="stat-desc flex flex-row items-center gap-2">
                <BadgeCheck />
                <span>Verfied</span>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  )
}

export default VerifyTransaction
