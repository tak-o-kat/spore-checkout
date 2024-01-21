import { createEffect, createSignal, onMount, Show, untrack } from "solid-js"
import { createStore } from "solid-js/store"

type Total = {
  total: number
}

const TotalSummary = (props: Total) => {
  const [isCalc, setIsCalc] = createSignal(true)
  const [percent, setPercent] = createSignal(5)
  const [totalSummary, setTotalSummary] = createStore({
    subtotal: props.total,
    discount: 0,
    taxes: 23.68,
    shipping: 6.0,
    total: 0.0,
  })

  function precisionRound(number, precision) {
    var factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor
  }

  function hasDecimal(n: number) {
    var result = n - Math.floor(n) !== 0

    if (result) return true
    else return false
  }

  createEffect(() => {
    setIsCalc(true)
    // Use untrack() for createEffect when updating discount
    const taxRate = 0.0725
    const taxes = taxRate * totalSummary.subtotal
    let discount: number

    if (percent() > 0) {
      // apply discount here
      const decPercent = percent() * 0.01
      discount = decPercent * totalSummary.subtotal
    }
    const total = taxes + totalSummary.subtotal + totalSummary.shipping - discount

    setTotalSummary({
      ...totalSummary,
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
          <dd class="text-gray-800">{`${totalSummary.discount > 0 ? "-$" : "$"}${totalSummary.discount}`}</dd>
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
              ? totalSummary.shipping.toPrecision(4)
              : `${totalSummary.shipping}.00`}
          </dd>
        </div>
        <div class="flex items-center justify-between border-t pt-6 text-gray-900">
          <dt class="text-base">Total</dt>
          <dd>${totalSummary.total}</dd>
        </div>
      </div>
    </Show>
  )
}

export default TotalSummary
