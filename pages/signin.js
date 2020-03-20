import EmployeeSignin from "../components/auth/EmployeeSignin";
import React from "react";

function sigin() {
    return (
        <>
            <EmployeeSignin/>
        </>
    );
}

sigin.getInitialProps = async ctx => {

    return {path: ctx.pathname};
};
export default sigin;
