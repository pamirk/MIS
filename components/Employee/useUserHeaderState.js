import React, { createContext, useReducer, useContext } from "react"

const Context = createContext();

export function UserHeaderStateProvider({ reducer, initialState = {}, children }) {
    const value = useReducer(reducer, initialState);
    return <Context.Provider value={value} children={children} />
}

export function useUserHeaderState() {
    return useContext(Context)
}
