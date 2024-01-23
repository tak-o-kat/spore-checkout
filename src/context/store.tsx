import { createStore } from "solid-js/store"
import { createContext, useContext } from "solid-js"

export type Store = {
  state?: GlobalState
}

type GlobalState = {
  showSporeView: boolean
}

const store: GlobalState = {
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
