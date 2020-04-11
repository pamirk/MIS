import React from "react";
import {Avatar, Badge, Card} from "antd";
import {Col, Media, Row} from "reactstrap";
import {awsb} from "../../utils/baseUrl";
import Head from "next/head";

export default function EmployeeDesignationComponent({data}) {
    if (!data) return "No"
    const isActive = ((data.emp_des_is_active === 1) ? "Active" : "UnActive");
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
                                                        src={`${awsb}/${data.emp_des_order_letter_photo}`}/>
                                            </span>
                                            </div>
                                        </div>
                                    </Media>
                                    <Media body>
                                        <Row>
                                            <Col sm="9" md="6" lg="5">
                                                <div className="users-page-view-table">
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Designation Date</div>
                                                        <div>{data.emp_des_order_date.substring(0, 10)}</div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Appointment date</div>
                                                        <div>{data.emp_des_appointment_date.substring(0, 10)}</div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Designation Status</div>
                                                        <Badge status="processing" text={isActive}/>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Designation Title</div>
                                                        <div><span>{data.des_title}</span></div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Designation Scale</div>
                                                        <div>{data.des_scale}</div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md="12" lg="5">
                                                <div className="users-page-view-table">
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Department Name</div>
                                                        <div>{data.department_name}</div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Department Description</div>
                                                        <div>{data.department_description}</div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Department City</div>
                                                        <div>{data.department_city_name}</div>
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