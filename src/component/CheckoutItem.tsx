import type { Component } from "solid-js"
import QuantityInput from "./QuantityInput"

type PropTypes = {
  item: {
    id: string
    thumb_src: string
    title: string
    price: number
    size: string
    count: number
  }
}

const CheckoutItem = (props: PropTypes) => {
  return (
    <li class="flex space-x-6 py-6">
      <img
        src={`/images/${props.item.thumb_src}`}
        class="flex h-40 w-40 rounded-md bg-white object-cover object-center align-middle"
      />
      <div class="flex flex-col justify-between space-y-4">
        <div class="flex flex-col space-y-1 text-sm font-medium">
          <div class="text-black">{props.item.title}</div>
          <p class="">{`$${props.item.price}.00`}</p>
          <p class="text-gray-400">{props.item.size}</p>
          <p class="w-2">
            <QuantityInput value={props.item.count} />
          </p>
        </div>
        <div class="mt-4 flex space-x-4">
          <button
            type="button"
            class="cursor-pointer text-sm font-medium text-blue-600"
          >
            Edit
          </button>
          <div class="flex border-l border-gray-200 pl-4">
            <button
              type="button"
              class="cursor-pointer text-sm font-medium text-blue-600"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default CheckoutItem
