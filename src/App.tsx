import type { Component } from "solid-js"
import NavBar from "./component/NavBar"
import Checkout from "./component/Checkout"

const App: Component = () => {
  return (
    <div class="flex h-screen flex-col bg-base-100 text-base-content">
      <NavBar />
      <main class="font-roboto mx-auto my-10 selection:flex">
        <Checkout />
      </main>
    </div>
  )
}

export default App
