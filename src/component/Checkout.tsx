import { Component, onMount, Show } from "solid-js"
import { Lock } from "./PaymentIcons"
import OrderSummary from "./OrderSummary"
import PaymentForm from "./PaymentForm"

import { useGlobalContext, Store } from "../context/store"

const Checkout: Component = () => {
  const store: Store = useGlobalContext()
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
          when={store.state.showSporeView}
          fallback={<PaymentForm />}
        >
          <section class="flex max-w-2xl flex-col bg-white sm:px-12 lg:col-span-7 lg:px-16 lg:py-12">
            <div class="my-5 flex h-10 w-[34rem] max-w-2xl flex-row justify-center">
              <div class="flex basis-1/3 cursor-pointer items-center justify-center">1</div>
              <div class="flex basis-1/3 cursor-pointer items-center justify-center">2</div>
              <div class="flex basis-1/3 cursor-pointer items-center justify-center">3</div>
            </div>
            <span class="relative flex justify-center py-4">
              <div class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75" />
              <span class="relative z-10 bg-white px-6">or</span>
            </span>
            <div class="mx-auto px-6 sm:px-0">
              <form
                action="#"
                class="mt-2 grid grid-cols-6 gap-6"
              >
                <div class="w-full">hi</div>
              </form>
            </div>
          </section>
        </Show>
      </div>
    </section>
  )
}

export default Checkout
