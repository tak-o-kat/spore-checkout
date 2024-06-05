import type { Component } from "solid-js"
import NavBar from "./component/NavBar"
import Checkout from "./component/Checkout"

const App: Component = () => {
  return (
    <div class="flex h-screen flex-col bg-base-100 pb-5 text-base-content">
      <NavBar />
      <main class="mx-auto my-10 font-roboto selection:flex">
        <Checkout />
      </main>
    </div>
  )
}

export default App
