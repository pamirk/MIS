import {Card} from "antd";
import React from "react";
import Index from "../components/Complaints/index";
import {parseCookies} from "nookies";
import {redirectUser} from "../utils/auth";
import baseUrl from "../utils/baseUrl";
import axios from "axios";

function Complaints({complaints}) {
    console.log("complaints----", complaints);
    return (
        <Card style={{minHeight: '100vh'}}>
            <Index complaints={complaints}/>
        </Card>
    );
}

Complaints.getInitialProps = async (ctx) => {
    const {token} = parseCookies(ctx);
    if (!token) redirectUser(ctx, "/signin");
    const payload = {headers: {Authorization: token}};

    const url = `${baseUrl}/api/complaints_list`;
    const response = await axios.get(url, payload);

    return {complaints: response.data.rows}
};

export default Complaints;
