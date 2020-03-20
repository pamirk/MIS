import React from 'react';
import {Avatar, Card, Col, Icon, Row} from "antd";
import LeavesList from "../../components/Leave/LeavesList";
import {parseCookies} from "nookies";
import {redirectUser} from "../../utils/auth";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import Link from "next/link";
import PaidTimeSVG from '../../static/paidTime.svg'
import SickSVG from '../../static/sick.svg'

export default function Index({user, leaves}) {
    return (
        <Card style={{minHeight: '100vh'}}>

            <h1>Time Off</h1>
            <Row>
                <Col>
                    <LeavesList user={user} leaves={leaves}/>
                </Col>
            </Row>
        </Card>
    );
}

Index.getInitialProps = async (ctx) => {
    const {token} = parseCookies(ctx);
    if (!token) redirectUser(ctx, "/signin");
    const payload = {headers: {Authorization: token}};
    const url = `${baseUrl}/api/all_leaves`;
    const response = await axios.get(url, payload);
    return {leaves: response.data.leaves}
};
