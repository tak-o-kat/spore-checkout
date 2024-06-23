import algosdk from "algosdk"
import { UseNetwork } from "solid-algo-wallets"
import { Switch, Match, onMount, createSignal } from "solid-js"
import { UserRound, ReceiptText, BadgeCheck, ArrowRightLeft } from "lucide-solid"
import { ConfettiExplosion } from "solid-confetti-explosion"

import { Verification, decimal } from "./SporeDiscountView"
import { ellipseString } from "./SporeDiscountView"
import SporeIcon from "./SporeIcon"
import { useGlobalContext, type Store } from "../context/store"

type PropTypes = {
  verificationObj: Verification
}

const VerifyTransaction = (props: PropTypes) => {
  const store: Store = useGlobalContext()
  const [isLoading, setIsLoading] = createSignal(true)
  const [verified, setVerified] = createSignal(false)
  const { algodClient } = UseNetwork

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

      if (
        rcvAddress === props.verificationObj.receiverAddress &&
        sendAddress === props.verificationObj.senderAddress &&
        assetID === props.verificationObj.assetId &&
        assetAmountSent === props.verificationObj.assetAmountSent
      ) {
        setVerified(true)
        store.setState({
          ...store.state,
          percent: props.verificationObj.discountPercent,
          discountApplied: true,
        })
      }
      // Need to match each prop with the txnID details given from algod
    } catch (err) {
      console.log(err.message)
    }
    setIsLoading(false)
  })

  return (
    <div class="flex flex-row items-center justify-center py-4">
      <div class="flex flex-col items-center justify-center gap-2">
        <Switch fallback={<div>Loading...</div>}>
          <Match when={!isLoading() && verified()}>
            <ConfettiExplosion
              stageHeight={560}
              stageWidth={700}
              class="-mt-2"
            />
            <div class="flex items-center justify-center bg-gradient-to-r from-[#fa8cff] via-[#9182ff] to-[#0476ff] bg-clip-text text-center text-lg text-transparent">
              Successfully applied discount!
            </div>
            <div class="flex items-center justify-center p-4 text-center text-sm">
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
                <div class="stat-desc flex flex-row items-center gap-2 ">
                  <span class="text-accent">
                    <BadgeCheck />
                  </span>
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
                  <span class="text-accent">
                    <BadgeCheck />
                  </span>
                  <span>Verfied</span>
                </div>
              </div>
            </div>
            <div class="stats stats-vertical bg-slate-50 shadow sm:stats-horizontal">
              <div class="stat">
                <div class="stat-figure fill-current text-neutral">
                  <ArrowRightLeft />
                </div>
                <div class="stat-title">Transaction ID</div>
                <div class="stat-value w-32 text-xl">{`${ellipseString(props.verificationObj.txnId)}`}</div>
                <div class="stat-desc flex flex-row items-center gap-2">
                  <span class="text-accent">
                    <BadgeCheck />
                  </span>
                  <span>Verfied</span>
                </div>
              </div>
              <div class="stat">
                <div class="stat-figure fill-current text-neutral">
                  <SporeIcon />
                </div>
                <div class="stat-title">SPORE coin sent</div>
                <div class="stat-value text-xl">{`${props.verificationObj.discountPercent}% - ${props.verificationObj.assetAmountSent / decimal}`}</div>
                <div class="stat-desc flex flex-row items-center gap-2">
                  <span class="text-accent">
                    <BadgeCheck />
                  </span>
                  <span>Verfied</span>
                </div>
              </div>
            </div>
          </Match>
          <Match when={!isLoading() && !verified()}>
            <div>Something is wrong</div>
          </Match>
        </Switch>
      </div>
    </div>
  )
}

export default VerifyTransaction
