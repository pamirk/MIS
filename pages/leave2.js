import React from 'react';
import {Card, Col, Divider, Row} from "antd";
import baseUrl from "../utils/baseUrl";
import axios from "axios";
import {parseCookies} from "nookies";
import {redirectUser} from "../utils/auth";
import Link from "next/link";

export default function Leave({user, count}) {
    console.log("response: ", count.data);
    const causalCount = count && count.data[0] && count.data[0].count
    const earnedCount = count && count.data[1] && count.data[1].count
    return (
        <Card className='p-5' style={{minHeight: '100vh'}}>
            <h1>Time Off</h1>
            <Divider/>
            <Row gutter={24} type="flex" style={{marginTop: 24,}}>
                <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                    <Link href={'/leave/casual'}>
                        <a><Card hoverable={true}>
                            <img style={{width: '50px', marginBottom: '15p  x'}} src='../static/paidTime.svg'/>
                            <h4 style={{fontSize: '21px', lineHeight: '27px'}}>Casual Leaves</h4>
                            <div className="mt-3"><h1 style={{color: '#525257'}}>{causalCount}</h1></div>
                            <Card.Meta description="Leaves Availed this year"/>
                        </Card></a>
                    </Link>
                </Col>
                <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                    <Link href={'/leave/earned'}>
                        <a>
                            <Card hoverable={true}>
                                <img style={{width: '50px', marginBottom: '15px'}} src='../static/sick.svg'/>
                                <h4 style={{fontSize: '21px', lineHeight: '27px'}}>Earned Leaves</h4>
                                <div className="mt-3"><h1 style={{color: '#525257'}}>{earnedCount}</h1></div>
                                <Card.Meta description="Leaves Availed"/>
                            </Card>
                        </a>
                    </Link>
                </Col>
            </Row>
        </Card>
    );
}

Leave.getInitialProps = async (ctx) => {
    const {token} = parseCookies(ctx);
    if (!token) redirectUser(ctx, "/signin");
    const payload = {headers: {Authorization: token}};
    const url = `${baseUrl}/api/leaves_count`;
    let response = await axios.get(url, payload);
    response = response.data
    return {count: response}
};
