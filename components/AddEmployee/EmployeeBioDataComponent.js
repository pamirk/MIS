import React, {Component} from "react";
import {Avatar, Card, Descriptions, Divider, Icon, Typography} from "antd";
import {Col, Media, Row} from "reactstrap";

import baseUrl from "../../utils/baseUrl";
import Head from "next/head";

const {Text} = Typography;

export default function EmployeeBioDataComponent({data}) {

    if (!data) return "No"
    return (
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
                                    <Media className="mt-md-1 mt-0" left>
                                        <div className="gx-profile-banner-avatar">
                                            <div className='profile-pic'>
                                            <span className='profile-photo-img'>
                                                <Avatar className="gx-size-112 rounded mr-2"
                                                        src={`${baseUrl}/${data.employee_photo}`}/>
                                            </span>
                                            </div>
                                        </div>
                                    </Media>
                                    <Media body>
                                        <Row>
                                            <Col sm="9" md="6" lg="5">
                                                <div className="users-page-view-table">
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Full Name
                                                        </div>
                                                        <div>{data.full_name}</div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Father Name
                                                        </div>
                                                        <div>{data.father_name}</div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">CNIC</div>
                                                        <div className="text-truncate"><span>{data.cnic}</span></div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Gender</div>
                                                        <div><span>{data.gender}</span></div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md="12" lg="5">
                                                <div className="users-page-view-table">
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Date of
                                                            Appointment
                                                        </div>
                                                        <div>{data.appointment_date.substring(0, 10)}</div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Date of Birth</div>
                                                        <div>{data.birth_date.substring(0, 10)}</div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Email</div>
                                                        <div><span>{data.email}</span></div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Locality</div>
                                                        <div><span>{data.local}</span></div>
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
    );
}


/*<>
            <div style={{background: '#F9F9FB', padding: '30px'}}>
                <Divider orientation="left" type="horizontal">
                    Employee Bio Dataa
                </Divider>

                {(data) &&
                <Row>
                    <Col>
                        <Descriptions size={'middle'}>
                            <Descriptions.Item span={12} label="Full Name"> <Text
                                strong>{data.full_name}</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="Father Name"><Text
                                strong>{data.father_name}</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="CNIC"><Text
                                strong>{data.cnic}</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="Date of Appointment"><Text
                                strong>{data.appointment_date.substring(0, 10)}</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="Date of Birth"><Text
                                strong>{data.birth_date.substring(0, 10)}</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="Gender"><Text
                                strong>{data.gender}</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="Email"><Text
                                strong>{data.email}</Text></Descriptions.Item>
                            <Descriptions.Item span={12} label="Locality"><Text
                                strong>{data.local}</Text></Descriptions.Item>
                        </Descriptions>
                    </Col>
                    <Col>
                        <Avatar shape="square" size={200}
                                src={`${baseUrl}/${data.employee_photo}`}/>
                    </Col>

                </Row>
                }

            </div>

        </>*/