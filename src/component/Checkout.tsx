import { Component } from "solid-js"
import CheckoutItem from "./CheckoutItem"

const Checkout: Component = () => {
  const items = new Array(3)
  return (
    <section class="my-10 bg-white">
      <div class="lg:grid lg:min-h-full lg:grid-cols-12">
        {/* Order Summary */}
        <section class="flex max-w-md flex-1 flex-col space-x-6 border bg-slate-50 lg:col-span-5 xl:col-span-5">
          <ul
            role="list"
            class="flex-auto  divide-y overflow-y-auto px-6"
          >
            <CheckoutItem items={"here"} />
            <CheckoutItem items={"here"} />
            <CheckoutItem items={"here"} />
          </ul>
        </section>
        {/* Payment Section */}
        <section class="flex max-w-xl border px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-7">
          <div class="mx-auto max-w-xl">
            <form
              action="#"
              class="mt-8 grid grid-cols-6 gap-6"
            >
              <div class="col-span-6 sm:col-span-3">
                <label
                  for="FirstName"
                  class="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>

                <input
                  type="text"
                  id="FirstName"
                  name="first_name"
                  class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div class="col-span-6 sm:col-span-3">
                <label
                  for="LastName"
                  class="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>

                <input
                  type="text"
                  id="LastName"
                  name="last_name"
                  class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div class="col-span-6">
                <label
                  for="Email"
                  class="block text-sm font-medium text-gray-700"
                >
                  {" "}
                  Email{" "}
                </label>

                <input
                  type="email"
                  id="Email"
                  name="email"
                  class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div class="col-span-6 sm:col-span-3">
                <label
                  for="Password"
                  class="block text-sm font-medium text-gray-700"
                >
                  {" "}
                  Password{" "}
                </label>

                <input
                  type="password"
                  id="Password"
                  name="password"
                  class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div class="col-span-6 sm:col-span-3">
                <label
                  for="PasswordConfirmation"
                  class="block text-sm font-medium text-gray-700"
                >
                  Password Confirmation
                </label>

                <input
                  type="password"
                  id="PasswordConfirmation"
                  name="password_confirmation"
                  class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div class="col-span-6">
                <label
                  for="MarketingAccept"
                  class="flex gap-4"
                >
                  <input
                    type="checkbox"
                    id="MarketingAccept"
                    name="marketing_accept"
                    class="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
                  />

                  <span class="text-sm text-gray-700">
                    I want to receive emails about events, product updates and company
                    announcements.
                  </span>
                </label>
              </div>

              <div class="col-span-6">
                <p class="text-sm text-gray-500">
                  By creating an account, you agree to our
                  <a
                    href="#"
                    class="text-gray-700 underline"
                  >
                    {" "}
                    terms and conditions{" "}
                  </a>
                  and
                  <a
                    href="#"
                    class="text-gray-700 underline"
                  >
                    privacy policy
                  </a>
                  .
                </p>
              </div>

              <div class="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button class="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                  Create an account
                </button>

                <p class="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?
                  <a
                    href="#"
                    class="text-gray-700 underline"
                  >
                    Log in
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </section>
  )
}

export default Checkout
