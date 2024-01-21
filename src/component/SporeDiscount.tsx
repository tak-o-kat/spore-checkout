import type { Component } from "solid-js"
import SporeIcon from "./SporeIcon"

const SporeDiscount: Component = () => {
  return (
    <div class="flex justify-center">
      <span class="flex items-center pr-2 text-base">Apply Discount with</span>
      <button class="btn btn-link -ml-4 text-base text-secondary">
        SPORE <SporeIcon />
      </button>
    </div>
  )
}

export default SporeDiscount
