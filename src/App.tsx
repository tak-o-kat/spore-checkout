import type { Component } from "solid-js"
import NavBar from "./component/NavBar"
import Checkout from "./component/Checkout"
import Footer from "./component/Footer"

const App: Component = () => {
  return (
    <div class="flex h-screen w-full flex-col justify-between bg-base-100 pb-5 text-base-content">
      <NavBar />
      <main class="mx-auto mb-auto font-roboto selection:flex">
        <Checkout />
      </main>
      <Footer />
    </div>
  )
}

export default App
