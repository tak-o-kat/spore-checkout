import type { Component } from "solid-js"
import NavBar from "./component/NavBar"
import Checkout from "./component/Checkout"

const App: Component = () => {
  return (
    <div class="flex h-screen w-full flex-col bg-base-100 pb-5 text-base-content">
      <NavBar />
      <main class="mx-auto font-roboto selection:flex">
        <Checkout />
      </main>
    </div>
  )
}

export default App
