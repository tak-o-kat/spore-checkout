import type { Component } from "solid-js"
import SporeIcon from "./SporeIcon"
import SporeModal from "./SporeModal"

const SporeDiscount: Component = () => {
  const ModalClick = () => {
    const modal = document.getElementById("spore_modal")
    modal.showModal()
  }
  return (
    <div class="flex justify-center">
      <span class="flex items-center pr-2 text-base">Apply Discount with</span>
      <button
        class="btn btn-link -ml-4 text-base text-secondary"
        onclick={() => ModalClick()}
      >
        SPORE
        <SporeIcon />
        <SporeModal />
      </button>
    </div>
  )
}

export default SporeDiscount
