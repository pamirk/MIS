import React, {useState} from "react";
import {Row, Col} from "reactstrap";
import {Card, Modal} from "antd";
import Link from "next/link";
import Address from "../components/Employee/components/Address";
import CreateDepartment from "../components/AdminSettings/CreateDepartment";
import CreateDesignation from "../components/AdminSettings/CreateDesignation";
import CreateDivision from "../components/AdminSettings/CreateDivision";
import CreateSubDivision from "../components/AdminSettings/CreateSubDivision";


function index({}) {
    const [addDivisionModal, setAddDivisionModal] = useState(false);
    const [addSubDivisionModal, setAddSubDivisionModal] = useState(false);
    const [addDepartmentModal, setAddDepartmentModal] = useState(false);
    const [addDesignationModal, setAddDesignationModal] = useState(false);

    return (
        <div className='min-vh-100'>
            <Row>
                <Col>
                    <Card bordered={false} hoverable={true} onClick={() => setAddDivisionModal(true)}>
                        <span>Add Division</span>
                    </Card>
                </Col>
                <Col>
                    <Card bordered={false} hoverable={true} onClick={() => setAddSubDivisionModal(true)}>
                        <span>Add Sub Division</span>
                    </Card>
                </Col>
                <Col>
                    <Card bordered={false} hoverable={true} onClick={() => setAddDepartmentModal(true)}>
                        <span>Add Department</span>
                    </Card>
                </Col>
                <Col>
                    <Card bordered={false} hoverable={true} onClick={() => setAddDesignationModal(true)}>
                        <span>Add Designation</span>
                    </Card>
                </Col>
            </Row>

            <Modal
                width={780} destroyOnClose={true} visible={addDepartmentModal}
                onOk={() => setAddDepartmentModal(false)} onCancel={() => setAddDepartmentModal(false)}
                footer={null} closable={false}>
                <Card bordered={false}
                      title={<strong className={'text-large font-weight-bold'}>Add Department</strong>}>
                    <CreateDepartment handleCancel={() => setAddDepartmentModal(false)}
                                      handleSuccess={() => setAddDepartmentModal(false)}/>
                </Card>

            </Modal>

            <Modal
                width={780} destroyOnClose={true}
                visible={addDesignationModal}
                onOk={() => setAddDesignationModal(false)}
                onCancel={() => setAddDesignationModal(false)}
                footer={null} closable={false}>
                <Card bordered={false}
                      title={<strong className={'text-large font-weight-bold'}>Add Designation</strong>}>
                    <CreateDesignation handleCancel={() => setAddDesignationModal(false)}
                                       handleSuccess={() => setAddDesignationModal(false)}/>
                </Card>

            </Modal>
            <Modal
                width={780} destroyOnClose={true}
                visible={addDivisionModal}
                onOk={() => setAddDivisionModal(false)}
                onCancel={() => setAddDivisionModal(false)}
                footer={null} closable={false}>
                <Card bordered={false}
                      title={<strong className={'text-large font-weight-bold'}>Add Division</strong>}>
                    <CreateDivision handleCancel={() => setAddDivisionModal(false)}
                                    handleSuccess={() => setAddDivisionModal(false)}/>
                </Card>

            </Modal>
            <Modal
                width={780} destroyOnClose={true}
                visible={addSubDivisionModal}
                onOk={() => setAddSubDivisionModal(false)}
                onCancel={() => setAddSubDivisionModal(false)}
                footer={null} closable={false}>
                <Card bordered={false}
                      title={<strong className={'text-large font-weight-bold'}>Add Division</strong>}>
                    <CreateSubDivision handleCancel={() => setAddSubDivisionModal(false)}
                                       handleSuccess={() => setAddSubDivisionModal(false)}/>
                </Card>

            </Modal>
        </div>
    );
}

export default index;

const  c = "Sir I want to buy a course online from a site on 11.99 $  , but unable to pay due my card issue. i will send you a link where you can enter details , Sir if you can do the transaction i will pay you 12 $ later "