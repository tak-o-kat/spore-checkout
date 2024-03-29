import type { Component } from "solid-js"
import SporeIcon from "./SporeIcon"
import { useGlobalContext, type Store } from "../context/store"

const SporeDiscountButton: Component = () => {
  const store: Store = useGlobalContext()
  const switchView = () => {
    store.setState({
      showSporeView: !store.state.showSporeView,
    })
  }

  return (
    <div class="flex justify-center">
      <span class="flex items-center pr-2 text-base">Apply Discount with</span>
      <button
        class="btn btn-link -ml-4 text-base text-secondary "
        onClick={() => switchView()}
      >
        SPORE
        <SporeIcon />
      </button>
    </div>
  )
}

export default SporeDiscountButton
