import type { Component } from "solid-js"
import QuantityInput from "./QuantityInput"

type PropTypes = {
  items: string
}

const CheckoutItem = (props: PropTypes) => {
  return (
    <li class="flex space-x-6 py-6">
      <img
        src="https://tailwindui.com/img/ecommerce-images/checkout-page-04-product-01.jpg"
        class="flex h-40 w-40 rounded-md bg-white object-cover object-center align-middle"
      />
      <div class="flex flex-col justify-between space-y-4">
        <div class="flex flex-col space-y-1 text-sm font-medium">
          <div class="text-black">Micro Backpack</div>
          <p class="">$70.00</p>
          <p class="text-gray-400">Moss</p>
          <p class="text-gray-400">5L</p>
          <p class="w-2">
            <QuantityInput />
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
