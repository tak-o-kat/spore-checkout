import { Component, For, createSignal, onMount } from "solid-js"
import { createStore } from "solid-js/store"
import CheckoutItem from "./CheckoutItem"
import items from "../data/items.json"
import SporeDiscount from "./SporeDiscount"
import TotalSummary from "./TotalSummary"
import { ApplePay, GooglePay, PayPal, Lock } from "./PaymentIcons"
import CreditCardForm from "./CreditCardForm"

export type Items = {
  id: string
  thumb_src: string
  title: string
  price: number
  size: string
  count: number
}

const Checkout: Component = () => {
  const [totalPrice, setTotalPrice] = createSignal(
    items.products.map((p) => p.price * p.count).reduce((a, v) => a + v, 0),
  )
  onMount(() => {})
  return (
    <section class="bg-white">
      <div class="-mt-10 flex items-center justify-center p-5">
        <h2 class="flex flex-row text-2xl font-bold text-neutral-500">
          <div class="pointer-events-none inset-y-0 start-0 flex items-center px-2">
            <Lock />
          </div>
          Payment Processing
        </h2>
      </div>
      <div class="border bg-slate-50 lg:grid lg:min-h-full lg:grid-cols-12">
        {/* Order Summary */}
        <section class="flex flex-col space-x-6 bg-slate-50 lg:col-span-5 ">
          <ul
            role="list"
            class="h-[40rem] flex-auto divide-y overflow-y-auto px-6"
          >
            <For each={items.products}>{(item) => <CheckoutItem item={item} />}</For>
          </ul>
          <div class="border-opacity-1 !-ml-px w-full border-t p-6">
            <SporeDiscount />
            <TotalSummary total={totalPrice()} />
          </div>
        </section>
        {/* Payment Section */}
        <section class="flex max-w-2xl flex-col bg-white sm:px-12 lg:col-span-7 lg:px-16 lg:py-12">
          <div class="mx-auo my-5 flex h-10 flex-row justify-center">
            <div class="flex basis-1/3 cursor-pointer items-center justify-center">
              <ApplePay />
            </div>
            <div class="flex basis-1/3 cursor-pointer items-center justify-center">
              <GooglePay />
            </div>
            <div class="flex basis-1/3 cursor-pointer items-center justify-center">
              <PayPal />
            </div>
          </div>
          <span class="relative flex justify-center py-4">
            <div class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>
            <span class="relative z-10 bg-white px-6">or</span>
          </span>
          <CreditCardForm />
        </section>
      </div>
    </section>
  )
}

export default Checkout
