import React, {Component} from "react";
import {Avatar, Card, Descriptions, Divider, Typography} from "antd";
import {Col, Media, Row} from "reactstrap";
import Head from "next/head";
import baseUrl from "../../utils/baseUrl";

const {Text} = Typography;

export default function EmployeeAddressComponent({data}) {
    if (!data) return;

    return (
        <>
            <>
                <Head>
                    <link rel="stylesheet" type="text/css" href="/static/users.css"/>
                </Head>
                <Row>
                    <Col sm="12">
                        <Card>
                            <Row className="mx-0" col="12">
                                <Col className="pl-0" sm="12">
                                    <Media className="d-sm-flex d-block">
                                        <Media body>
                                            <Row>
                                                <Col sm="9" md="6" lg="5">
                                                    <div className="users-page-view-table">
                                                        <div className="d-flex user-info">
                                                            <div className="user-info-title font-weight-bold">Current Address</div>
                                                            <div>{data.current_address}</div>
                                                        </div>
                                                        <div className="d-flex user-info">
                                                            <div className="user-info-title font-weight-bold">Permanent Address</div>
                                                            <div>{data.permanent_address}</div>
                                                        </div>
                                                        <div className="d-flex user-info">
                                                            <div className="user-info-title font-weight-bold">Postal Code</div>
                                                            <div className="text-truncate"><span>{data.postal_code}</span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex user-info">
                                                            <div className="user-info-title font-weight-bold">Phone number 1
                                                            </div>
                                                            <div><span>{data.phone_number}</span></div>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="12" lg="5">
                                                    <div className="users-page-view-table">
                                                        <div className="d-flex user-info">
                                                            <div className="user-info-title font-weight-bold">Phone Number 2</div>
                                                            <div>{data.phone_number2 ? data.phone_number2 : 'Not Provided'}</div>
                                                        </div>
                                                        <div className="d-flex user-info">
                                                            <div className="user-info-title font-weight-bold">City</div>
                                                            <div>Quetta</div>
                                                        </div>
                                                        <div className="d-flex user-info">
                                                            <div className="user-info-title font-weight-bold">Country</div>
                                                            <div>Pakistan</div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Media>
                                    </Media>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </>
        </>
    );
}

/*
* <div style={{background: '#F9F9FB', padding: '30px'}}>
                {(data) && <Row>

                    <Col span={6} pull={18}>
                        <Descriptions size={'middle'}>

                            <Descriptions.Item span={12} label="Current Address"> <Text
                                strong>{data.current_address}</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="Permanent Address"><Text
                                strong>{data.permanent_address}</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="Postal Code"><Text
                                strong>{data.postal_code}</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="Phone number 1"><Text
                                strong>{data.phone_number}</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="Phone Number 2"><Text
                                strong>{data.phone_number2}</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="City"><Text strong>Quetta</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="Country"><Text
                                strong>Pakistan</Text></Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>}


            </div>*/