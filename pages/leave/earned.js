import React from 'react';
import Index from "../../components/Leave/user";
import {Card, Col, Divider, Row} from "antd";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import Employees from "../employees";
import {parseCookies} from "nookies";
import {redirectUser} from "../../utils/auth";
import Link from "next/link";

export default function Leave({user, response}) {
    console.log("response: ", response.leaves)
    return (
        <Card className='p-5' style={{minHeight: '100vh'}}>
            <h1>Earned Leaves</h1>
            <Divider />
            <Index user={user} lt={2} leaves={response.leaves}/>
        </Card>
    );
}

Leave.getInitialProps = async (ctx) => {
    const { token } = parseCookies(ctx);
    if (!token) redirectUser(ctx, "/signin");
    const payload = { headers: { Authorization: token } };
    const url = `${baseUrl}/api/earned_leaves`;
    const response = await axios.get(url, payload);
    return {response: response.data}
};
