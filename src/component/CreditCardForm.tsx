import { Component } from "solid-js"

const CreditCardForm = () => {
  return (
    <div class="mx-auto px-6 sm:px-0">
      <form
        action="#"
        class="mt-2 grid grid-cols-6 gap-6"
      >
        <div class="col-span-6">
          <label
            for="FirstName"
            class="mb-1 block text-sm font-medium text-gray-700"
          >
            Name on card
          </label>

          <input
            type="text"
            placeholder="Name"
            class="w-full rounded-lg border border-gray-300 bg-white p-3"
          />
        </div>

        <div class="col-span-6 sm:col-span-6">
          <label
            for="Card"
            class="block text-sm font-medium text-gray-700"
          >
            {" "}
            Card number{" "}
          </label>

          <input
            type="number"
            placeholder="1234 1234 1234 1234"
            data-inputmask="'mask': '9999 9999 9999 9999'"
            class="w-full rounded-lg border border-gray-300 bg-white p-3"
          />
        </div>

        <div class="col-span-4">
          <label
            for="FirstName"
            class="mb-1 block text-sm font-medium text-gray-700"
          >
            Expiration Date
          </label>

          <input
            type="text"
            placeholder="MM / YY"
            class="w-full rounded-lg border border-gray-300 bg-white p-3"
          />
        </div>
        <div class="col-span-6 sm:col-span-2">
          <label
            for="Card"
            class="block text-sm font-medium text-gray-700"
          >
            {" "}
            CVV / CVC{" "}
          </label>

          <input
            type="number"
            placeholder="000"
            class="w-full rounded-lg border border-gray-300 bg-white p-3"
          />
        </div>
        <div class="col-span-6">
          <label
            for="FirstName"
            class="mb-1 block text-sm font-medium text-gray-700"
          >
            Address
          </label>

          <input
            type="text"
            placeholder="Address"
            class="w-full rounded-lg border border-gray-300 bg-white p-3"
          />
        </div>
        <div class="col-span-4">
          <label
            for="FirstName"
            class="mb-1 block text-sm font-medium text-gray-700"
          >
            City
          </label>

          <input
            type="text"
            placeholder="City"
            class="w-full rounded-lg border border-gray-300 bg-white p-3"
          />
        </div>
        <div class="col-span-2">
          <label
            for="FirstName"
            class="mb-1 block text-sm font-medium text-gray-700"
          >
            State
          </label>

          <input
            type="text"
            placeholder="State"
            class="w-full rounded-lg border border-gray-300 bg-white p-3"
          />
        </div>
        <div class="col-span-2">
          <div class="">
            <label
              for="FirstName"
              class="mb-1 block text-sm font-medium text-gray-700"
            >
              Zip code
            </label>

            <input
              type="text"
              placeholder="Zip"
              class="w-full rounded-lg border border-gray-300 bg-white p-3"
            />
          </div>
        </div>
        <div class="col-span-6">
          <label class="flex cursor-pointer items-center justify-start">
            <input
              type="checkbox"
              class="checkbox-primary checkbox"
            />
            <span class="label-text pl-2">Billing Address is the same as shipping address</span>
          </label>
        </div>
        <div class="col-span-6">
          <button class="h-14 w-full rounded-lg border bg-primary text-primary-content">
            Create an account
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreditCardForm
