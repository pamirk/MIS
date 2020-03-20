import React from "react"
import {Button, CardBody, CardHeader, CardTitle, Col, Media, Row} from "reactstrap"
import {Edit, Trash} from "react-feather"
import Link from "next/link";
import Head from "next/head";
import {Card} from "antd";

export default function UserHeader({imgURL,name, formNumber, email, designation, status, contact}) {
    return (
        <>
            <Head>
                <link rel="stylesheet" type="text/css" href="/static/users.css"/>
                <title>{name}</title>
            </Head>
            <Row>
                <Col sm="12">
                    <Card>
                        <Row className="mx-0" col="12">
                            <Col className="pl-0" sm="12">
                                <Media className="d-sm-flex d-block">
                                    <Media className="mt-md-1 mt-0" left>
                                        <Media
                                            className="rounded mr-2"
                                            object
                                            src={imgURL}
                                            alt="image"
                                            height="112"
                                            width="112"
                                        />
                                    </Media>
                                    <Media body>
                                        <Row>
                                            <Col sm="9" md="6" lg="5">
                                                <div className="users-page-view-table">
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Name</div>
                                                        <div>{name}</div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Form Number</div>
                                                        <div>{formNumber}</div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">
                                                            Email
                                                        </div>
                                                        <div className="text-truncate">
                                                            <span>{email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md="12" lg="5">
                                                <div className="users-page-view-table">
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Designation</div>
                                                        <div>{designation}</div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Status</div>
                                                        <div>{status}</div>
                                                    </div>
                                                    <div className="d-flex user-info">
                                                        <div className="user-info-title font-weight-bold">Contact #</div>
                                                        <div>
                                                            <span>{contact}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Media>
                                </Media>
                            </Col>
                            {/*<Col className="mt-1 pl-0" sm="12">
                                <Button className="mr-1" color="primary" outline>
                                    <Link to="/app/user/edit">
                                        <>
                                            <Edit size={15}/>
                                            <span className="align-middle ml-50">Edit</span>
                                        </>
                                    </Link>
                                </Button>
                                <Button color="danger" outline>
                                    <>
                                        <Trash size={15}/>
                                        <span className="align-middle ml-50">Delete</span>
                                    </>
                                </Button>
                            </Col>*/}
                        </Row>
                    </Card>
                </Col>
                <Col sm="12" md="6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Information</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="users-page-view-table">
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">
                                        Birth Date
                                    </div>
                                    <div> 28 January 1998</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">
                                        Mobile
                                    </div>
                                    <div>+65958951757</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">
                                        Website
                                    </div>
                                    <div className="text-truncate">
                                        <span>https://rowboat.com/insititious/Crystal</span>
                                    </div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">
                                        Languages
                                    </div>
                                    <div className="text-truncate">
                                        <span>English, French</span>
                                    </div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">
                                        Gender
                                    </div>
                                    <div className="text-truncate">
                                        <span>Female</span>
                                    </div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">
                                        Contact
                                    </div>
                                    <div className="text-truncate">
                                        <span>email, message, phone</span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="12" md="6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Links</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="users-page-view-table">
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">
                                        Twitter
                                    </div>
                                    <div className="text-truncate">
                                        <span>https://twitter.com/crystal</span>
                                    </div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">
                                        Facebook
                                    </div>
                                    <div className="text-truncate">
                                        <span>https://www.facebook.com/crystal</span>
                                    </div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">
                                        Instagram
                                    </div>
                                    <div className="text-truncate">
                                        <span>https://www.instagram.com/crystal</span>
                                    </div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">
                                        Github
                                    </div>
                                    <div className="text-truncate">
                                        <span>https://github.com/crystal</span>
                                    </div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">
                                        CodePen
                                    </div>
                                    <div className="text-truncate">
                                        <span>https://codepen.io/crystal</span>
                                    </div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">
                                        Slack
                                    </div>
                                    <div className="text-truncate">
                                        <span>@crystal</span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
