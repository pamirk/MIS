import {Button, Form, Col, Icon, Input, message, Switch, Card, Checkbox, Modal} from 'antd';
import * as React from 'react';
import {Component} from 'react';
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import {Check, Lock} from "react-feather";
import {Table} from "reactstrap";
import {useState} from "react";
import {useEffect} from "react";
import {cardTitleIcon} from "../../Common/UI";
import moment from "moment";
import Link from "next/link";
import EditDesignationDetails from "./EditDesignationDetails";
import EditAccountSettings from "./EditAccountSettings";
import ResetPassword from "./ResetPassword";

function AccountSettings({id}) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [editModel, setEditModel] = useState(false);
    const [resetPasswordModel, setResetPassword] = useState(false);

    const hideEditModal = () => setEditModel(false);
    const showEditModal = () => setEditModel(true);
    const hideResetPasswordModal = () => setResetPassword(false);
    const showResetPasswordModal = () => setResetPassword(true);
    const handleSuccess = () => {
        setEditModel(false)
        message.success("Updated settings")
    };
    const handleResetPassSuccess = () => {
        setResetPassword(false)
        message.success("Password Updated")
    };

    useEffect(() => {
        getData()
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();

        this.setState({loading: true,});
        const fd = new FormData();
        fd.append('id', this.props.id);
        fd.append('password', this.password.value);

        axios.post(baseUrl + '/api/set_employee_password', fd)
            .then(d => {
                const data = d.data;
                console.log(data);
                this.setState({
                    loading: false,
                });
                if (data.err || data.status === 500) {
                    message.error("Sorry, Try again")
                } else if (data.status === 200) {
                    message.success("Password Changed")
                }

            });
        this.password.value = ''
    };
    const postStatusData = (checked) => {
        this.setState({loading: true,});
        const fd = new FormData();
        fd.append('id', this.props.id);
        fd.append('status', checked);

        axios.post(baseUrl + '/api/set_employee_status', fd)
            .then(d => {
                const data = d.data;
                console.log(data);
                this.setState({
                    loading: false,
                });
                if (data.err) {
                    message.error("Sorry, Try again")
                } else if (data.status === 200) {
                    message.success("Status Changed")
                }

            })
    };
    const getData = async () => {
        setLoading(true);
        const url = `${baseUrl}/api/get_employee_status/${id}`;
        const response = await axios.get(url);
        setLoading(false);
        const data = response.data;
        console.log("data", data);
        if (data.status === 200) {
            setData(data.rows);
        } else if (data.status === 500) {
            message.error(data.err)
        }
    };
    return (
        <>
            {data ?
                <Card bordered={false}
                      title={cardTitleIcon('Account Settings', "edit", showEditModal)}>
                    <div className="users-page-view-table">
                        <div className="d-flex user-info">
                            <div className="user-info-title font-weight-bold">Status last Changed</div>
                            <div>{moment(data.last_update_ts).format('YYYY-MM-DD')}</div>
                        </div>
                        <div className="d-flex user-info">
                            <div className="user-info-title font-weight-bold">Status</div>
                            <div>{(data.employee_is_active === 1) ? 'Active' : 'Disabled'}</div>
                        </div>
                        <div className="d-flex user-info">
                            <div className="user-info-title font-weight-bold">Role</div>
                            <div className="text-truncate">{data.is_admin === 0 ? "Employee" : "Admin"}</div>
                        </div>
                    </div>
                    <Button size={"large"} className='mr-5' onClick={showResetPasswordModal}
                            style={{backgroundColor: '#0a8080', color: 'white'}}>Reset Password</Button>
                </Card>
                : <Card bordered={false}
                        title={cardTitleIcon('Add Account Settings', "plus", showEditModal)}/>
            }

            <Modal
                width={'90%'}
                destroyOnClose={true}
                visible={editModel}
                onOk={hideEditModal}
                onCancel={hideEditModal}
                footer={null}
                closable={false}>
                <Card bordered={false}
                      title={<strong className={'text-large font-weight-bold'}>Edit Account settings</strong>}>
                    <EditAccountSettings data={data} id={id} handleCancel={hideEditModal}
                                         handleSuccess={handleSuccess}/>
                </Card>
            </Modal>
            <Modal
                width={'90%'}
                destroyOnClose={true}
                visible={resetPasswordModel}
                onOk={hideResetPasswordModal}
                onCancel={hideResetPasswordModal}
                footer={null}
                closable={false}>
                <Card bordered={false}
                      title={<strong className={'text-large font-weight-bold'}>Reset Password</strong>}>
                    <ResetPassword  id={id} handleCancel={hideResetPasswordModal}
                                         handleSuccess={handleResetPassSuccess}/>
                </Card>
            </Modal>
        </>
    );
}

export default AccountSettings;
{/* <Switch loading={this.state.loading} title='Status '
                                onChange={this.onStatusChange}
                                checkedChildren={<Icon type="check"/>}
                                unCheckedChildren={<Icon type="close"/>}/>*/
}
{/*<Col sm="12">
                <Card headStyle={{borderBottom: '1px solid #dee2e6', paddingBottom:'.25rem', marginRight:'.5rem', paddingLeft: 0}} title={<><Lock size={18} /><span className="align-middle ml-50">Permissions</span></>}>
                    <>
                        {" "}
                        <Table className="permissions-table" borderless responsive>
                            <thead>
                            <tr>
                                <th>Module</th>
                                <th>Read</th>
                                <th>Write</th>
                                <th>Create</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Users</td>
                                <td>
                                    <Checkbox
                                        disabled
                                        color="primary"
                                        icon={<Check className="vx-icon" size={16} />}
                                        label=""
                                        defaultChecked={true}
                                    />
                                </td>
                                <td>
                                    <Checkbox
                                        disabled
                                        color="primary"
                                        icon={<Check className="vx-icon" size={16} />}
                                        label=""
                                        defaultChecked={false}
                                    />
                                </td>
                                <td>
                                    <Checkbox
                                        disabled
                                        color="primary"
                                        icon={<Check className="vx-icon" size={16} />}
                                        label=""
                                        defaultChecked={false}
                                    />
                                </td>
                                <td>
                                    {" "}
                                    <Checkbox
                                        disabled
                                        color="primary"
                                        icon={<Check className="vx-icon" size={16} />}
                                        label=""
                                        defaultChecked={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Articles</td>
                                <td>
                                    <Checkbox
                                        disabled
                                        color="primary"
                                        icon={<Check className="vx-icon" size={16} />}
                                        label=""
                                        defaultChecked={false}
                                    />
                                </td>
                                <td>
                                    <Checkbox
                                        disabled
                                        color="primary"
                                        icon={<Check className="vx-icon" size={16} />}
                                        label=""
                                        defaultChecked={true}
                                    />
                                </td>
                                <td>
                                    <Checkbox
                                        disabled
                                        color="primary"
                                        icon={<Check className="vx-icon" size={16} />}
                                        label=""
                                        defaultChecked={false}
                                    />
                                </td>
                                <td>
                                    {" "}
                                    <Checkbox
                                        disabled
                                        color="primary"
                                        icon={<Check className="vx-icon" size={16} />}
                                        label=""
                                        defaultChecked={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Staff</td>
                                <td>
                                    <Checkbox
                                        disabled
                                        color="primary"
                                        icon={<Check className="vx-icon" size={16} />}
                                        label=""
                                        defaultChecked={true}
                                    />
                                </td>
                                <td>
                                    <Checkbox
                                        disabled
                                        color="primary"
                                        icon={<Check className="vx-icon" size={16} />}
                                        label=""
                                        defaultChecked={true}
                                    />
                                </td>
                                <td>
                                    <Checkbox
                                        disabled
                                        color="primary"
                                        icon={<Check className="vx-icon" size={16} />}
                                        label=""
                                        defaultChecked={false}
                                    />
                                </td>
                                <td>
                                    {" "}
                                    <Checkbox
                                        disabled
                                        color="primary"
                                        icon={<Check className="vx-icon" size={16} />}
                                        label=""
                                        defaultChecked={false}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                    </>
                </Card>
            </Col>*/
}