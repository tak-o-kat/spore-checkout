import { createStore } from "solid-js/store"
import { createContext, useContext } from "solid-js"

export type GlobalStore = {
  showSporeView: boolean
}

const store: GlobalStore = {
  showSporeView: false,
}

const GlobalContext = createContext()

export function GlobalContextProvider(props) {
  const [state, setState] = createStore(store)

  return (
    <GlobalContext.Provider value={{ state, setState }}>{props.children}</GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext)!
