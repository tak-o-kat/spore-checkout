import { Component, onMount, Show } from "solid-js"
import { Lock } from "./PaymentIcons"
import OrderSummary from "./OrderSummary"
import PaymentForm from "./PaymentForm"

import { useGlobalContext, type Store } from "../context/store"
import SporeDiscountView from "./SporeDiscountView"

const Checkout: Component = () => {
  const store: Store = useGlobalContext()
  onMount(() => {})
  return (
    <section class="flex flex-col items-center bg-white">
      <div class="flex flex-row items-center justify-center p-5 sm:mt-5">
        <h2 class="flex flex-row text-2xl font-bold text-neutral-600">
          <div class="pointer-events-none inset-y-0 start-0 flex items-center px-2">
            <Lock />
          </div>
          Payment Processing
        </h2>
      </div>
      <div class="border  lg:grid lg:min-h-full lg:grid-cols-12">
        <OrderSummary />
        <Show
          when={store.state.showSporeView}
          fallback={<PaymentForm />}
        >
          <SporeDiscountView />
        </Show>
      </div>
    </section>
  )
}

export default Checkout
