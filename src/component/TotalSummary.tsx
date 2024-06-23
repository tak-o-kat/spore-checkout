import { createEffect, createSignal, Show } from "solid-js"
import { createStore } from "solid-js/store"
import { ArrowBigRight } from "lucide-solid"

import { useGlobalContext, type Store } from "../context/store"

type Total = {
  total: number
}

const TotalSummary = (props: Total) => {
  const store: Store = useGlobalContext()
  const [isCalc, setIsCalc] = createSignal(true)
  const [totalSummary, setTotalSummary] = createStore({
    subtotal: 0,
    discount: 0,
    taxes: 23.68,
    shipping: 6.0,
    total: 0.0,
  })

  function precisionRound(number, precision) {
    const factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor
  }

  function hasDecimal(n: number) {
    const result = n - Math.floor(n) !== 0

    // if (result) return true
    // else return false
    return result
  }

  createEffect(() => {
    setIsCalc(true)
    // Use untrack() for createEffect when updating discount
    const taxRate = 0.0725
    const taxes = taxRate * totalSummary.subtotal

    // if (store.state.percent > 0) {
    //   // apply discount here
    const decPercent = store.state.percent * 0.01
    const discount = decPercent * totalSummary.subtotal
    // }
    const total = taxes + totalSummary.subtotal + totalSummary.shipping - discount

    setTotalSummary({
      ...totalSummary,
      subtotal: props.total,
      discount: discount,
      taxes: precisionRound(taxes, 2),
      shipping: precisionRound(totalSummary.shipping, 2),
      total: precisionRound(total, 2),
    })
    setIsCalc(false)
  })

  return (
    <Show
      when={!isCalc()}
      fallback={<div>Loading...</div>}
    >
      <div class="mt-10 flex flex-col space-y-6 text-sm font-medium text-slate-500">
        <div class="flex justify-between">
          <dt>Subtotal</dt>
          <dd class="text-gray-800">
            $
            {hasDecimal(totalSummary.subtotal)
              ? totalSummary.subtotal.toPrecision(4)
              : `${totalSummary.subtotal}.00`}
          </dd>
        </div>
        <div class="flex justify-between">
          <dt>Discount</dt>
          <dd class="flex flex-row items-center gap-3 text-gray-800">
            <span class="">{`${store.state.percent > 0 ? `${store.state.percent}% off` : ""}`}</span>
            <span class="">{store.state.percent > 0 && <ArrowBigRight class="h-5" />}</span>
            <span class="font-semibold">{`${totalSummary.discount > 0 ? "-$" : "$"}${precisionRound(totalSummary.discount, 2).toFixed(2)}`}</span>
          </dd>
        </div>
        <div class="flex justify-between">
          <dt>Taxes</dt>
          <dd class="text-gray-800">${totalSummary.taxes}</dd>
        </div>
        <div class="flex justify-between">
          <dt>Shipping</dt>
          <dd class="text-gray-800">
            $
            {hasDecimal(totalSummary.shipping)
              ? totalSummary.shipping.toPrecision(2)
              : `${totalSummary.shipping.toFixed(2)}`}
          </dd>
        </div>
        <div class="flex items-center justify-between border-t pt-6 text-gray-900">
          <dt class="text-base">Total</dt>
          <dd class="font-bold">${totalSummary.total.toFixed(2)}</dd>
        </div>
      </div>
    </Show>
  )
}

export default TotalSummary
