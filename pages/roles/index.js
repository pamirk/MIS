import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, Divider, Form, Icon, List, message, Modal, Popconfirm, Tooltip} from "antd";
import {useRouter} from 'next/router'
import baseUrl, {awsb} from "../../utils/baseUrl";
import axios from "axios";
import Link from "next/link";
import {LEAVE_STATUS} from "../../server/utils/status";
import moment from "moment";
import {period} from "../../utils/common";
import SelectEmployee from "./SelectEmployee";

function Index({user}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState(null);
    const [modelVisible, setModelVisible] = useState(false);
    const [modelRole, setModelRole] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [employeesInRole, setEmployeesInRole] = useState([]);

    const handleOk = () => setModelVisible(false);
    const handleCancel = () => setModelVisible(false);

    useEffect(() => {
        getRoles();
    }, []);
    useEffect(() => {
        modelRole && getEmployeesInRole()
    }, [modelRole]);
    const getRoles = async () => {
        setLoading(true);
        const url = `${baseUrl}/api/roles_count`;
        const {status, data: {rows}} = await axios.get(url);
        setRoles(rows)
        setLoading(false);
    };
    const handleDelete = async (id) => {
        setLoading(true);
        const url = `${baseUrl}/api/role_delete`;
        const payload = {id};
        const {status} = await axios.post(url, payload);
        setLoading(false);
        if (status === 200) {
            setRoles(roles.filter(i => i.id !== id))
        }
    };
    const handleDeleteEmployeeFromRole = async (r_id, e_id) => {
        setLoading(true);
        const url = `${baseUrl}/api/employee_delete_from_role`;
        const payload = {r_id, e_id};
        const {status} = await axios.post(url, payload);
        setLoading(false);
        if (status === 200) {
            setEmployeesInRole(employeesInRole.filter(i => i.employee_id !== e_id))
        }
    };
    const showModal = (role) => {
        setModelRole(role);
        setModelVisible(true);
    };
    const getEmployeesInRole = async () => {
        try {
            const url = `${baseUrl}/api/employees_in_role/${Number(modelRole.id)}`;
            let {data: {status, rows}} = await axios.get(url);
            if (status === 200) {
                setEmployeesInRole(rows)
            }
        } catch (e) {
            message.error(e.message)
        } finally {
        }
    };
    const handleSave = async () => {
        handleCancel();
        try {
            const url = `${baseUrl}/api/add_employee_role`;
            const payload = {
                r_id: modelRole.id,
                authorizedBy: user.employee.employee_id,
                e_ids: employees.map(i => Number(i.key))
            };
            console.log("payload", payload);
            let {data: {status}} = await axios.post(url, payload);
            if (status === 200) {
                message.success("Roles are assigned Successfully");
                getRoles();
            }
        } catch (e) {
            message.error(e.message)
        } finally {
        }
    };
    const getValues = (value) => {
        setEmployees(value)
    };
    return (
        <Card className='min-vh-100'>
            <div className='d-flex justify-content-between align-items-center'>
                <span>Employee Roles</span>
                <Button style={{backgroundColor: '#0a8080', color: 'white'}} size={"large"}
                        onClick={() => router.push('/roles/new')}>
                    <div className='d-flex align-items-center'>
                        <Icon className='mr-1' type='plus-circle'/>
                        <span>New Role</span>
                    </div>
                </Button>
            </div>

            {roles && <List
                itemLayout="horizontal" dataSource={roles} loading={loading} size="large"
                renderItem={item => (<List.Item actions={[
                    <Link href={`/roles/${item.id}`}><a><Icon type='edit'/></a></Link>,
                    <Popconfirm title="Are you sure delete this Role?"
                                onConfirm={() => handleDelete(item.id)} okText="Yes" cancelText="No">
                        <a key=""><Icon type='delete'/> </a></Popconfirm>
                ]}>
                    <List.Item.Meta description={item.description}
                                    title={<Link href={`/roles/${item.id}`}><a>{item.name}</a></Link>}/>
                    <a onClick={() => showModal(item)}>{(item.count === 0) ? "Add Employees"  :  item.count + " Employees"}</a>
                </List.Item>)}
            />}
            {modelRole && <Modal
                destroyOnClose={true} width={780} visible={modelVisible}
                onOk={handleOk} onCancel={handleCancel}
                footer={null} closable={false}>
                <Card bordered={false}
                      title={<>
                          <strong className='text-large font-weight-bold'>{modelRole.name}</strong><br/>
                          <span> Employees ({modelRole.count}) </span>
                      </>}>
                    <div>
                        {employeesInRole && <List
                            itemLayout="horizontal" dataSource={employeesInRole} loading={loading} size="large"
                            renderItem={item => (<List.Item actions={[
                                <Popconfirm title="Are you sure to Remove employee from this Role?"
                                            onConfirm={() => handleDeleteEmployeeFromRole(modelRole.id, item.employee_id)} okText="Yes" cancelText="No">
                                    <a key=""><Icon type='delete'/> </a></Popconfirm>
                            ]}>

                                <List.Item.Meta title={<Link href={`/employee/${item.employee_id}`}><a target="_blank">{item.full_name}</a></Link>}
                                                avatar={<Avatar src={awsb + '/' + item.employee_photo}/>}
                                                description={'Form Number: ' + item.form_number}
                                />
                            </List.Item>)}
                        />}
                    </div>
                    <SelectEmployee  getValues={getValues}/>
                    <div className={'mt-3 flex-justify-content'}>
                        <Button size={"large"} className='text-white mr-2'
                                disabled={employees.length === 0}
                                style={{backgroundColor: '#0a8080'}}
                                onClick={handleSave}>Save</Button>
                        <Button onClick={handleCancel} size={"large"}>Cancel</Button>
                    </div>
                </Card>
            </Modal>}
        </Card>
    );
}

export default Index;
