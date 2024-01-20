import { Component } from "solid-js"

const QuantityInput: Component = () => {
  return (
    <div>
      <label
        for="Quantity"
        class="sr-only"
      >
        {" "}
        Quantity{" "}
      </label>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="h-5 w-5 leading-5 text-gray-600 transition hover:opacity-75"
        >
          &minus;
        </button>
        <input
          type="number"
          id="Quantity"
          value="1"
          class="h-8 w-10 rounded border-gray-200 pl-2 sm:text-sm"
        />
        <button
          type="button"
          class="h-5 w-5 leading-5 text-gray-600 transition hover:opacity-75"
        >
          &plus;
        </button>
      </div>
    </div>
  )
}

export default QuantityInput
