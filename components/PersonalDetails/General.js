import {Card, Modal} from "antd";
import {cardTitleIcon} from "../Common/UI";
import moment from "moment";
import React, {useState} from "react";
import Address from "../Employee/components/Address";
import EditEmail from "./EditEmail";

export default function General({p_employee, p_address}) {
    const [employee, setEmployee] = useState(p_employee);
    const [address, setAddress] = useState(p_address);
    const [editAddressModal, setEditAddressModal] = useState(false);
    const [editEmailModal, setEditEmailModal] = useState(false);
    const handleEditEmailSuccess = (email) => {
        setEmployee({...employee, email});
        setEditEmailModal(false)
    };
    return <>
        {(employee) &&
        <Card bordered={false}
              title={cardTitleIcon('Basic Details', "edit", () => setEditEmailModal(true))}>
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
                    <div className="user-info-title font-weight-bold">Form #</div>
                    <div className="text-truncate">{employee.form_number}</div>
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
                    <div className="text-truncate">{moment(employee.birth_date).format('DD/MM/YYYY')}</div>
                </div>
                <div className="d-flex user-info">
                    <div className="user-info-title font-weight-bold">Service Join Date
                    </div>
                    <div
                        className="text-truncate">{moment(employee.appointment_date).format('DD/MM/YYYY')}</div>
                </div>
                <div className="d-flex user-info">
                    <div className="user-info-title font-weight-bold">Gender</div>
                    <div className="text-truncate">{employee.gender}</div>
                </div>
            </div>
        </Card>
        }
        {(address && address[0]) ?
            <Card bordered={false} className='mt-2'
                  title={cardTitleIcon('Home Address', "menu", () => setEditAddressModal(true))}>
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
            : <Card bordered={false} className='mt-2'
                    title={cardTitleIcon('Add Home Address', "plus", () => setEditAddressModal(true))}>
            </Card>
        }


        <Modal
            width={780} destroyOnClose={true}
            visible={editAddressModal}
            onOk={() => setEditAddressModal(false)}
            onCancel={() => setEditAddressModal(false)}
            footer={null} closable={false}>
            <Card bordered={false}
                  title={<strong className={'text-large font-weight-bold'}>Home Address History</strong>}>
                <p>{`This is a list of all of ${employee.full_name}’s, current and previous addresses..`}</p>
                <Address id={employee.employee_id} address_data={address}
                         handleCancel={() => setEditAddressModal(false)} type={1}/>
            </Card>

        </Modal>
        <Modal
            width={780} destroyOnClose={true} visible={editEmailModal}
            onOk={() => setEditEmailModal(false)}
            onCancel={() => setEditEmailModal(false)}
            footer={null} closable={false}>
            <EditEmail id={employee.employee_id} data={{email: employee.email}}
                       handleSuccess={handleEditEmailSuccess} handleCancel={() => setEditEmailModal(false)}/>
        </Modal>
    </>

}