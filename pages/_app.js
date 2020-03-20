import App from "next/app";
import React from "react";
import {parseCookies, destroyCookie} from "nookies";
import Layout from "../components/_App/Layout";
import baseUrl from "../utils/baseUrl";
import axios from "axios";
import {redirectUser} from "../utils/auth";
const adminRoutes = [
    '/create_employee',
    '/create_designation',
    '/create_department',
    '/create_division',
    '/create_sub_division',
    '/employees',
    '/leave',
];
const authRoutes = [
    ...adminRoutes,
    '/',
    '/complain_dashboard',
    '/employee',
    '/complaints',
];
const isProtectedRoute = (path) => authRoutes.includes(path);
const isNotPermitted = (is_admin, path) => !is_admin && adminRoutes.includes(path);

class MyApp extends App {
    static async getInitialProps({Component, ctx}) {
        const {token} = parseCookies(ctx);
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        if (!token) {
            if (isProtectedRoute(ctx.pathname) || ctx.pathname.split('/')[1] === 'employee') {
                redirectUser(ctx, "/signin");
            }

        } else {
            try {
                const payload = {headers: {Authorization: token}};
                const url = `${baseUrl}/api/account`;
                const response = await axios.get(url, payload);
                const user = response.data;
                const isAdmin = user.employeeLogin.is_admin === 1;
                // if authenticated, but not of role 'admin' or 'root', redirect from '/create' page
                if (isNotPermitted(isAdmin, ctx.pathname) || (!isAdmin && ctx.pathname.split('/')[1] === 'employee')) redirectUser(ctx, "/");
                pageProps.user = user;
            } catch (error) {
                console.error("Error getting current user", error);
                // 1) Throw out invalid token
                destroyCookie(ctx, "token");
                // 2) Redirect to signin
                redirectUser(ctx, "/signin");
            }
        }

        return {pageProps};
    }

    render() {
        const {Component, pageProps} = this.props;
        return (
            <Layout {...pageProps}>
                <Component {...pageProps} />
            </Layout>
        );
    }
}

export default MyApp;
