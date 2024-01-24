import { Component } from "solid-js"
import { ApplePay, GooglePay, PayPal } from "./PaymentIcons"
import CreditCardForm from "./CreditCardForm"

const PaymentForm: Component = () => {
  return (
    <section class="flex max-w-2xl flex-col bg-white sm:px-12 lg:col-span-7 lg:px-16 lg:py-12">
      <div class="my-5 flex h-10 flex-row justify-center">
        <div
          class="tooltip tooltip-accent flex basis-1/3 cursor-pointer items-center justify-center"
          data-tip="Apple Pay"
        >
          <ApplePay />
        </div>
        <div
          class="tooltip tooltip-accent flex basis-1/3 cursor-pointer items-center justify-center"
          data-tip="Google Pay"
        >
          <GooglePay />
        </div>
        <div
          class="tooltip tooltip-accent flex basis-1/3 cursor-pointer items-center justify-center"
          data-tip="Pay Pal"
        >
          <PayPal />
        </div>
      </div>
      <span class="relative flex justify-center py-4">
        <div class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75" />
        <span class="relative z-10 bg-white px-6">or</span>
      </span>
      <CreditCardForm />
    </section>
  )
}

export default PaymentForm
