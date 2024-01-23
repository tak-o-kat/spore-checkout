import { Component } from "solid-js"

const SporeDiscountView: Component = () => {
  return (
    <section class="flex max-w-2xl flex-col bg-white opacity-100 transition duration-500 ease-in-out sm:px-12 lg:col-span-7 lg:px-16 lg:py-12">
      <div class="my-5 flex h-10 w-[34rem] max-w-2xl flex-row justify-center">
        <div class="flex basis-1/3 cursor-pointer items-center justify-center">1</div>
        <div class="flex basis-1/3 cursor-pointer items-center justify-center">2</div>
        <div class="flex basis-1/3 cursor-pointer items-center justify-center">3</div>
      </div>
      <span class="relative flex justify-center py-4">
        <div class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75" />
        <span class="relative z-10 bg-white px-6">or</span>
      </span>
      <div class="mx-auto px-6 sm:px-0">
        <form
          action="#"
          class="mt-2 grid grid-cols-6 gap-6"
        >
          <div class="w-full">hi</div>
        </form>
      </div>
    </section>
  )
}

export default SporeDiscountView
