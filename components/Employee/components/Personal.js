import * as React from 'react';
import {useState} from 'react';
import {Button, Card, Modal, Typography} from 'antd';
import {Col, Row} from "reactstrap";
import BaseView from "./base";
import Address from "./Address";
import baseUrl from "../../../utils/baseUrl";
import EditDesignationDetails from "./EditDesignationDetails";
import EditBasicDetails from "./EditBasicDetails";
import {cardTitleIcon} from "../../Common/UI";
import {useEffect} from "react";
import moment from "moment";

const {Text} = Typography;
export default function Personal({id, p_employee, p_address}) {
    const [employee, setEmployee] = useState(p_employee);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [visible_showEditBasicModal, setVisible_showEditBasicModal] = useState(false);
    const [visible_showEditAddressModal, setVisible_showEditAddressModal] = useState(false);

    const showEditBasicModal = () => setVisible_showEditBasicModal(true);
    const showEditAddressModal = () => setVisible_showEditAddressModal(true);
    useEffect(() => {
        setAddress(p_address.filter(i => i.type === 1));
    }, []);
    const handleOk = e => {
        setVisible_showEditBasicModal(false);
        setVisible_showEditAddressModal(false)
    };
    const handleCancel = e => {
        setVisible_showEditBasicModal(false)
        setVisible_showEditAddressModal(false)
    };

    const getBasicData = () => {
        fetch(baseUrl + `/api/show_one_employee/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                let cd = data[0];
                cd.appointment_date = cd.appointment_date.toString().substring(0, 10);
                cd.birth_date = cd.birth_date.toString().substring(0, 10);
                setEmployee(cd)
                setLoading(false);

                //getaddressData();
            })
    };
    const getaddressData = () => {
        fetch(baseUrl + `/api/show_one_employee_address/${id}`,
            {method: 'GET', headers: {'Content-Type': 'application/json'},})
            .then(data => data.json())
            .then(data => {
                let cd = data[0];
                if (cd !== undefined && cd.city_id !== undefined) cd.city_id = 'Quetta';
                setAddress(cd);
                setLoading(false);
            })
    };

    const hideHandler = () => {
        setVisible_showEditBasicModal(false)
        setVisible_showEditAddressModal(false)
        setLoading(true);
        getBasicData();
    };

    return (
        <>
            <>
                {(!loading) &&
                <>
                    <Row>
                        {(employee) &&
                        <Col sm="12" md="6">
                            <Card bordered={false} title={cardTitleIcon('Basic Details', "edit", showEditBasicModal)}>
                                <div className="users-page-view-table">
                                    <div className="d-flex user-info">
                                        <div className="user-info-title font-weight-bold">Full Name</div>
                                        <div>{employee.full_name}</div>
                                    </div>
                                    <div className="d-flex user-info">
                                        <div className="user-info-title font-weight-bold">Father Name</div>
                                        <div>{employee.father_name}</div>
                                    </div>
                                    <div className="d-flex user-info">
                                        <div className="user-info-title font-weight-bold">CNIC Number</div>
                                        <div className="text-truncate">{employee.cnic}</div>
                                    </div>
                                    <div className="d-flex user-info">
                                        <div className="user-info-title font-weight-bold">Email</div>
                                        <div className="text-truncate">{employee.email}</div>
                                    </div>
                                    <div className="d-flex user-info">
                                        <div className="user-info-title font-weight-bold">Birthday</div>
                                        <div className="text-truncate">{employee.birth_date}</div>
                                    </div>
                                    <div className="d-flex user-info">
                                        <div className="user-info-title font-weight-bold">Service Join Date
                                        </div>
                                        <div className="text-truncate">{employee.appointment_date}</div>
                                    </div>
                                    <div className="d-flex user-info">
                                        <div className="user-info-title font-weight-bold">Gender</div>
                                        <div className="text-truncate">{employee.gender}</div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        }

                        <Col sm="12" md="6">
                            {(address && address[0]) ?
                                <Card bordered={false}
                                      title={cardTitleIcon('Home Address', "menu", showEditAddressModal)}>
                                    <div className="users-page-view-table">
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">Current Address</div>
                                            <div>{address[0].current_address}</div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">Permanent Address
                                            </div>
                                            <div>{address[0].permanent_address}</div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">Postal Code</div>
                                            <div className="text-truncate">{address[0].postal_code}</div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">City</div>
                                            <div className="text-truncate">Quetta</div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">Phone 1</div>
                                            <div className="text-truncate">{address[0].phone_number}</div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">Phone 2</div>
                                            <div
                                                className="text-truncate">{(address[0].phone_number2 !== "") ? address[0].phone_number2 : "None"}</div>
                                        </div>
                                    </div>
                                </Card>
                                :  <Card bordered={false}
                                         title={cardTitleIcon('Add Home Address', "plus", showEditAddressModal)}>
                                </Card>

                            }
                        </Col>

                    </Row>

                    <Modal
                        width={780}
                        destroyOnClose={true}
                        visible={visible_showEditBasicModal}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                        closable={false}>
                        <Card bordered={false}
                              title={<strong className={'text-large font-weight-bold'}>Edit Basics Details</strong>}>
                            <EditBasicDetails handleCancel={handleCancel} hideHandler={hideHandler}
                                              id={id} data={employee}/>
                        </Card>
                    </Modal>

                    <Modal
                        width={780}
                        destroyOnClose={true}
                        visible={visible_showEditAddressModal}
                        confirmLoading={confirmLoading}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                        closable={false}>
                        <Card bordered={false}
                              title={<strong className={'text-large font-weight-bold'}>Home Address History</strong>}>
                            <p>{`This is a list of all of ${employee.full_name}’s, current and previous addresses..`}</p>
                            <Address id={id} address_data={address} handleCancel={handleCancel} type={1}/>
                        </Card>

                    </Modal>

                </>

                }

            </>

        </>
    );
}

/*

/*{(address) &&
                            <>
                                <Row>
                                    <Col span={20}>

                                        <Descriptions title="Home Address" style={{marginBottom: 32}}>
                                            <Descriptions.Item
                                                label="Current Address">{address.current_address}</Descriptions.Item><br/>
                                            <Descriptions.Item
                                                label="Permanent Address">{address.permanent_address}</Descriptions.Item>
                                            <Descriptions.Item
                                                label="Postal Code">{address.postal_code}</Descriptions.Item>
                                            <Descriptions.Item label="City">Quetta</Descriptions.Item>
                                            <Descriptions.Item
                                                label="Phone 1">{address.phone_number}</Descriptions.Item>
                                            <Descriptions.Item
                                                label="Phone 2">{(address.phone_number2 !== "") ? address.phone_number2 : "None"}</Descriptions.Item>
                                        </Descriptions>

                                    </Col>
                                    <Col span={4}>
                                        <Icon style={{fontSize: 30}} onClick={showEditAddressModal} type="menu"
                                              title='Manage Employee address'/>
                                    </Col>
                                </Row>
                                <Divider style={{marginBottom: 32}}/>
                            </>}
*/
