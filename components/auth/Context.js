import React, {Component} from "react";
import cookie from "js-cookie";
import Data from './Data';
import {parseCookies} from "nookies";
import Router from "next/router";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";

const Context = React.createContext();
export const Consumer = Context.Consumer;

export function Provider({value}) {
    // const [authenticatedUser, setAuthenticatedUser] = React.useState(null);
    return (
        <Context.Provider value={value}>
            {this.props.children}
        </Context.Provider>
    );
}


/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
    return function ContextComponent(props) {
        return (
            <Context.Consumer>
                {context => <Component {...props} context={context}/>}
            </Context.Consumer>
        );
    }
}

