import axios from "axios";
import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router'
import Error from "next/error";
import baseUrl, {awsb} from "../../utils/baseUrl";
import {Card, CardBody, Col, Media, Row, Table} from "reactstrap";
import {Button, Input} from "antd";
import {Download, FileText, Mail, Phone} from "react-feather";

function EmployeeReport({employee, address, designations, p_roles, ctx, user}) {

    const router = useRouter();
    const {employee_id} = router.query;
    if (!employee) {
        return <Error statusCode={404} title={`Employee with ${employee_id} id does't exists`}/>
    }
    return (
        <div className='min-vh-100'>
            <Row>
                <Col className="mb-1 invoice-header" md="5" sm="12">
                    <Input.Group>
                        <Input placeholder="Email"/>
                        <Input.Group addonType="append">
                            <Button color="primary" outline>
                                Send Invoice
                            </Button>
                        </Input.Group>
                    </Input.Group>
                </Col>
                <Col
                    className="d-flex flex-column flex-md-row justify-content-end invoice-header mb-1"
                    md="7"
                    sm="12"
                >
                    <Button className="mr-1 mb-md-0 mb-1" type="primary" onClick={() => window.print()}>
                        <FileText size="15"/>
                        <span className="align-middle ml-50">Print</span>
                    </Button>
                    <Button color="primary" outline>
                        <Download size="15"/>
                        <span className="align-middle ml-50">Download</span>
                    </Button>
                </Col>
                <Col className="invoice-wrapper" sm="12">
                    <Card className="invoice-page">
                        <CardBody>
                            <Row>
                                <Col md="6" sm="12" className="pt-1">
                                    <Media className="pt-1">
                                        <img className='img-fluid img-thumbnail' src={awsb + '/'+ employee.employee_photo} alt="logo"/>
                                    </Media>
                                </Col>
                                <Col md="6" sm="12" className="text-right">
                                    <h1>Invoice</h1>
                                    <div className="invoice-details mt-2">
                                        <h6>INVOICE NO.</h6>
                                        <p>001/2020</p>
                                        <h6 className="mt-2">INVOICE DATE</h6>
                                        <p>10 Dec 2018</p>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="pt-2">
                                <Col md="6" sm="12">
                                    <h5>Recipient</h5>
                                    <div className="recipient-info my-2">
                                        <p>Peter Stark</p>
                                        <p>8577 West West Drive</p>
                                        <p>Holbrook, NY</p>
                                        <p>90001</p>
                                    </div>
                                    <div className="recipient-contact pb-2">
                                        <p>
                                            <Mail size={15} className="mr-50"/>
                                            peter@mail.com
                                        </p>
                                        <p>
                                            <Phone size={15} className="mr-50"/>
                                            +91 988 888 8888
                                        </p>
                                    </div>
                                </Col>
                                <Col md="6" sm="12" className="text-right">
                                    <h5>Microsion Technologies Pvt. Ltd.</h5>
                                    <div className="company-info my-2">
                                        <p>9 N. Sherwood Court</p>
                                        <p>Elyria, OH</p>
                                        <p>94203</p>
                                    </div>
                                    <div className="company-contact">
                                        <p>
                                            <Mail size={15} className="mr-50"/>
                                            hello@pixinvent.net
                                        </p>
                                        <p>
                                            <Phone size={15} className="mr-50"/>
                                            +91 999 999 9999
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                            <div className="invoice-items-table pt-1">
                                <Row>
                                    <Col sm="12">
                                        <Table responsive borderless>
                                            <thead>
                                            <tr>
                                                <th>TASK DESCRIPTION</th>
                                                <th>HOURS</th>
                                                <th>RATE</th>
                                                <th>AMOUNT</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>Website Redesign</td>
                                                <td>60</td>
                                                <td>15 USD</td>
                                                <td>90000 USD</td>
                                            </tr>
                                            <tr>
                                                <td>Newsletter template design</td>
                                                <td>20</td>
                                                <td>12 USD</td>
                                                <td>24000 USD</td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </div>
                            <div className="invoice-total-table">
                                <Row>
                                    <Col
                                        sm={{ size: 7, offset: 5 }}
                                        xs={{ size: 7, offset: 5 }}
                                    >
                                        <Table responsive borderless>
                                            <tbody>
                                            <tr>
                                                <th>SUBTOTAL</th>
                                                <td>114000 USD</td>
                                            </tr>
                                            <tr>
                                                <th>DISCOUNT (5%)</th>
                                                <td>5700 USD</td>
                                            </tr>
                                            <tr>
                                                <th>TOTAL</th>
                                                <td>108300 USD</td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </div>
                            <div className="text-right pt-3 invoice-footer">
                                <p>
                                    Transfer the amounts to the business amount below. Please
                                    include invoice number on your check.
                                </p>
                                <p className="bank-details mb-0">
                    <span className="mr-4">
                      BANK: <strong>FTSBUS33</strong>
                    </span>
                                    <span>
                      IBAN: <strong>G882-1111-2222-3333</strong>
                    </span>
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

EmployeeReport.getInitialProps = async ({query: {employee_id}, ctx}) => {
    const url = `${baseUrl}/api/show_one_employee/${employee_id}`;
    const url2 = `${baseUrl}/api/show_one_employee_address/${employee_id}`;
    const url3 = `${baseUrl}/api/employee_designation_details/${employee_id}`;
    const url4 = `${baseUrl}/api/training_list/${employee_id}`;
    const response = await axios.all([axios.get(url), axios.get(url2), axios.get(url3), axios.get(url4)]);
    return {
        employee: response[0].data[0],
        address: response[1].data,
        designations: response[2].data,
        p_roles: response[3].data.rows,
        ctx
    };
};
export default EmployeeReport;
