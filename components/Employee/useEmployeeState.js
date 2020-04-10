import React, { createContext, useReducer, useContext } from "react"

const Context = createContext();

export function EmployeeStateProvider({ reducer, initialState = {}, children }) {
    const value = useReducer(reducer, initialState);
    return <Context.Provider value={value} children={children} />
}

export function useEmployeeState() {
    return useContext(Context)
}
