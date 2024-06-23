import { SetStoreFunction, createStore } from "solid-js/store"
import { createContext, useContext } from "solid-js"

type GlobalState = {
  showSporeView: boolean
  percent: number
  discountApplied: boolean
}

export type Store = {
  state?: GlobalState
  setState?: SetStoreFunction<GlobalState>
}

const store: GlobalState = {
  showSporeView: false,
  percent: 0,
  discountApplied: false,
}

const GlobalContext = createContext()

export function GlobalContextProvider(props) {
  const [state, setState] = createStore(store)

  return (
    <GlobalContext.Provider value={{ state, setState }}>{props.children}</GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext)!
