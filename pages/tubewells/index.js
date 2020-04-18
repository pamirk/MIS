import {parseCookies} from "nookies";
import {redirectUser} from "../../utils/auth";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import React from "react";
import Index from "../../components/Tubewells/index";


function index({tubewells}) {
    return (
        <div className='p-2'>
            <Index tubewells={tubewells} />
        </div>
    );
}

index.getInitialProps = async (ctx) => {
    const { token } = parseCookies(ctx);
    if (!token) redirectUser(ctx, "/signin");
    const payload = { headers: { Authorization: token } };
    const url = `${baseUrl}/api/tubewells`;
    const response = await axios.get(url, payload);
    return {tubewells: response.data.tubewells}
};
export default index;
