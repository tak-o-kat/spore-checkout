import { Component } from "solid-js"

const SporeModal: Component = () => {
  return (
    <dialog
      id="spore_modal"
      class=" modal"
    >
      <div class="modal-box h-4/6 w-11/12 max-w-5xl text-primary-content">
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">x</button>
        </form>
        <h3 class="text-lg font-bold">Hello!</h3>
        <p class="py-4">Click the button below to close</p>
        <div class="modal-action" />
      </div>
    </dialog>
  )
}

export default SporeModal
