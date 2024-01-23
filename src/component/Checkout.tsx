import { Component, createSignal, onMount, Show } from "solid-js"
import { Lock } from "./PaymentIcons"
import OrderSummary from "./OrderSummary"
import PaymentForm from "./PaymentForm"

const Checkout: Component = () => {
  const [showSporeView, setShowSporeView] = createSignal(true)
  onMount(() => {})
  return (
    <section class="bg-white">
      <div class="-mt-10 flex items-center justify-center p-5">
        <h2 class="flex flex-row text-2xl font-bold text-neutral-600">
          <div class="pointer-events-none inset-y-0 start-0 flex items-center px-2">
            <Lock />
          </div>
          Payment Processing
        </h2>
      </div>
      <div class="border bg-slate-50 lg:grid lg:min-h-full lg:grid-cols-12">
        <OrderSummary />
        <Show
          when={showSporeView()}
          fallback={<PaymentForm />}
        >
          test
        </Show>
      </div>
    </section>
  )
}

export default Checkout
