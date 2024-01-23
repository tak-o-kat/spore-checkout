import { createSignal, For } from "solid-js"
import CheckoutItem from "./CheckoutItem"
import SporeDiscount from "./SporeDiscount"
import TotalSummary from "./TotalSummary"
import items from "../data/items.json"

export type Items = {
  id: string
  thumb_src: string
  title: string
  price: number
  size: string
  count: number
}

const OrderSummary = () => {
  const [subTotal, setsubTotal] = createSignal(
    items.products.map((p) => p.price * p.count).reduce((a, v) => a + v, 0),
  )
  return (
    <section class="flex flex-col space-x-6 bg-slate-50 lg:col-span-5 ">
      <ul
        role="list"
        class="h-[40rem] flex-auto divide-y overflow-y-auto px-6"
      >
        <For each={items.products}>{(item) => <CheckoutItem item={item} />}</For>
      </ul>
      <div class="border-opacity-1 !-ml-px w-full border-t p-6">
        <SporeDiscount />
        <TotalSummary total={subTotal()} />
      </div>
    </section>
  )
}

export default OrderSummary
