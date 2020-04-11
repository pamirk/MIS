import * as React from 'react';
import {useEffect, useState} from 'react';
import {Button, Card, Icon, Modal} from 'antd';
import Address from "./Address";
import baseUrl from "../../../utils/baseUrl";
import {awsb} from "../../../utils/baseUrl";
import {Col, Row} from "reactstrap";
import Head from "next/head";
import EditDesignationDetails from "./EditDesignationDetails";
import moment from "moment";
import {cardTitleIcon} from "../../Common/UI";
import Link from "next/link";
import AddDesignationDetails from "./AddDesignationDetails";
import {useEmployeeState} from "../useEmployeeState";
import {VIEW__EMPLOYMENT_DETAILS, EDIT__EMPLOYMENT_DETAILS} from "../../../utils/role_constants";

export default function Job({id, employee, address, designations}) {
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [des_data, setDes_data] = useState(null);
    const [workAddress, setWorkAddress] = useState(null);
    const [visible_showEditAddressModal, setVisible_showEditAddressModal] = useState(false);
    const [visible_showEditDesignationModal, setVisible_showEditDesignationModal] = useState(false);
    const [addDesignationModalVisible, setAddDesignationModalVisible] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [{ count, roles }, dispatch] = useEmployeeState();
    const [rolesInts, setRolesInts] = useState([]);
    const handlePreview = async file => {
        setPreviewImage(file);
        setPreviewVisible(true)
    };

    useEffect(() => {
        let cd = designations[0];
        if (cd && cd.emp_des_order_date && cd.emp_des_appointment_date) {
            cd.emp_des_order_date = moment(cd.emp_des_order_date).format('YYYY-MM-DD');
            cd.emp_des_appointment_date = moment(cd.emp_des_appointment_date).format('YYYY-MM-DD');
        }
        setDes_data(cd);
        setWorkAddress(address.filter(i => i.type === 2));
        let arr = [];
        roles.map(i => arr.push(i.p_id));
        setRolesInts(arr)

    }, []);
    const showEditAddressModal = () => setVisible_showEditAddressModal(true);
    const handleOk = e => {
        setVisible_showEditAddressModal(false);
        setVisible_showEditDesignationModal(false);
        setAddDesignationModalVisible(false);
    };
    const handleCancel = () => {
        setVisible_showEditAddressModal(false);
        setVisible_showEditDesignationModal(false);
        setAddDesignationModalVisible(false);
    };
    const showEditDesignationModal = () => setVisible_showEditDesignationModal(true);
    const showAddDesignationModal = () => setAddDesignationModalVisible(true);
    const hideHandler = () => {
        setVisible_showEditDesignationModal(false);
        setAddDesignationModalVisible(false);
        setLoading(true);
        getDesignationData();
    };
    const getDesignationData = () => {
        fetch(baseUrl + `/api/employee_designation_details/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                setDes_data(data[0]);
                setLoading(false);
            })
    };

    return (
        <>
            <Head>
                <link rel="stylesheet" type="text/css" href="/static/users.css"/>
            </Head>
            {(!loading) &&
            <><Row>
                <Col sm="12" md="6">
                    {(des_data && rolesInts.includes(VIEW__EMPLOYMENT_DETAILS)) ?
                        <Card bordered={false}
                              title={cardTitleIcon('Employment Details', "edit", rolesInts.includes(VIEW__EMPLOYMENT_DETAILS) && rolesInts.includes(EDIT__EMPLOYMENT_DETAILS) && showEditDesignationModal)}>
                            <div className="users-page-view-table">
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Start Date</div>
                                    <div>{moment(des_data.emp_des_appointment_date).format('YYYY-MM-DD')}</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Designation Title</div>
                                    <div>{des_data.des_title}</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Designation Scale</div>
                                    <div className="text-truncate">{des_data.des_scale}</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Department Name</div>
                                    <div className="text-truncate">{des_data.department_name}</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Department Location</div>
                                    <div className="text-truncate">Quetta</div>
                                </div>
                                {/*des_data.emp_des_order_letter_photo*/}
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Order Copy</div>
                                    <div className="text-truncate">
                                        <span>
                                            <Link>
                                              <a onClick={() => handlePreview(awsb + `/${des_data.emp_des_order_letter_photo}`)}>
                                                  <Icon type="eye" theme="twoTone" title='View Order Letter photo'/></a>
                                            </Link>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        : <Card bordered={false}
                                title={cardTitleIcon('Add Employment Details', "plus",rolesInts.includes(VIEW__EMPLOYMENT_DETAILS) && rolesInts.includes(EDIT__EMPLOYMENT_DETAILS) &&  showAddDesignationModal)}>
                        </Card>
                    }

                </Col>
                <Col sm="12" md="6">
                    {(workAddress && workAddress[0]) ?
                        <Card bordered={false} title={cardTitleIcon('Work Address', 'menu', showEditAddressModal)}>
                            <div className="users-page-view-table">
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Current Address</div>
                                    <div>{workAddress[0].current_address}</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Permanent Address</div>
                                    <div>{workAddress[0].permanent_address}</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Postal Code</div>
                                    <div>{workAddress[0].postal_code}</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">City</div>
                                    <div className="text-truncate"><span>Quetta</span></div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Phone 1</div>
                                    <div className="text-truncate"><span>{workAddress[0].phone_number}</span></div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Phone 2</div>
                                    <div className="text-truncate"><span>{workAddress[0].phone_number2}</span></div>
                                </div>
                            </div>

                        </Card>
                        : <Card title={cardTitleIcon('Add Work Address', 'plus', showEditAddressModal)}
                                bordered={false}>
                        </Card>
                    }
                </Col>
            </Row>
                <Modal
                    width={780}
                    destroyOnClose={true}
                    visible={visible_showEditDesignationModal}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                    closable={false}>
                    <Card bordered={false}
                          title={<strong className={'text-large font-weight-bold'}>Edit Employment Details</strong>}>
                        <EditDesignationDetails handleOk={handleOk} hideHandler={hideHandler}
                                                id={id} data={des_data}/>
                    </Card>
                </Modal>
                <Modal
                    width={780}
                    destroyOnClose={true}
                    visible={addDesignationModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                    closable={false}>
                    <Card bordered={false}
                          title={<strong className={'text-large font-weight-bold'}>Add Employment Details</strong>}>
                        <AddDesignationDetails handleOk={handleOk} hideHandler={hideHandler} id={id} />
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
                          title={<strong className={'text-large font-weight-bold'}>Work Address History</strong>}>
                        <p>{`This is a list of all of ${employee.full_name}’s, current and previous addresses..`}</p>
                        <Address id={id} address_data={address} handleCancel={handleCancel} type={2}/>
                    </Card>

                </Modal>
            </>
            }

            <Modal
                width='50%'
                destroyOnClose={true}
                visible={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={null}>
                <Card bordered={false}
                    title={<strong className={'text-large font-weight-bold'}>Photo of Designation Order</strong>}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                    <div className='mt-3 flex-justify-content'>
                        <Button onClick={() => setPreviewVisible(false)} size={"large"}>Looks Good</Button>
                    </div>
                </Card>
            </Modal>
        </>
    );
}
