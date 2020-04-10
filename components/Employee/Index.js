import React, {useEffect, useState} from "react";
import baseUrl from "../../utils/baseUrl";
import {Layout, Menu} from 'antd';
import Promotion from "./components/Promotion";
import Job from "./components/Job";
import Personal from "./components/Personal.js";
import ETraining from "./components/ETraining.js";
import Transfer from "./components/Transfer.js";
import AccountSettings from "./components/AccountSettings.js";
import Head from "next/head";
import Documents from "./components/Documents";
import EmployeeLeaves from "./components/EmployeeLeaves";
import UserHeader from "./UserHeader";
import {EmployeeStateProvider, useEmployeeState} from "./useEmployeeState";
import EmployeeLogs from "./components/EmployeeLogs";

const {Content} = Layout;
const {Item} = Menu;
let placeholderAvatarURL = './../../static/placeholderAvatar.svg';

const employeeStateReducer = (state, action) => {
    switch (action.type) {
        case "add": {
            return {...state, count: state.count + 1}
        }
        default:
            return state
    }
};
const initialState = {
    count: 30,
    employee: null,
    address: null,
    designations: null,
    ctx: null,
    user: null,
    roles: null,
};

const menuMap = {
    job: "Job",
    personal: "Personal",
    training: "Trainings",
    leave: "Leaves",
    promotion: "Promotions",
    transfer: "Transfers",
    documents: "Documents",
    accountSettings: "Account Settings",
    logs: "Logs",
};

function Index({employee, address, designations, ctx, user, roles}) {
    let id = employee.employee_id;
    const [selectKey, setSelectKey] = useState('job');
    const [state, dispatch] = useEmployeeState();

    useEffect(() => {
        employee.appointment_date = employee.appointment_date.toString().substring(0, 10);
        employee.birth_date = employee.birth_date.toString().substring(0, 10);

    }, []);


    const getMenu = () => {
        return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
    };
    const renderChildren = () => {
        switch (selectKey) {
            case 'job':
                return <Job id={id} employee={employee} address={address}
                            designations={designations}/>;
            case 'personal':
                return <Personal id={id} p_employee={employee} p_address={address}/>;
            case 'training':
                return <ETraining id={id} ctx={ctx} employee={employee}/>;
            case 'promotion':
                return <Promotion selectKey={selectKey} employee={employee} id={id} designations={designations}/>;
            case 'transfer':
                return <Transfer id={id} employee={employee}/>;
            case 'documents':
                return <Documents id={id} employee={employee} user={user}/>;
            case 'leave':
                return <EmployeeLeaves id={id} ctx={ctx} user={user}/>;
            case 'accountSettings':
                return <AccountSettings id={id}/>;
            case 'logs':
                return <EmployeeLogs id={id}/>;
            default:
                break;
        }
    };
    return (
        <>
            <Head>
                <link rel="stylesheet" type="text/css" href="/static/users.css"/>
            </Head>
            <UserHeader id={id} name={employee.full_name} email={employee.email} formNumber={employee.form_number}
                        designation={designations[0] && designations[0].des_title} status='Active'
                        url={employee.employee_photo ? baseUrl + '/' + employee.employee_photo : placeholderAvatarURL}
                        contact={(address[0]) && address[0].phone_number + " " + address[0].phone_number2}/>
            <div className='main'>
                <Menu
                    mode='horizontal'
                    selectedKeys={[selectKey]}
                    onClick={({key}) => setSelectKey(key)}>
                    {getMenu()}
                </Menu>
                <div className='right'>
                    {renderChildren()}
                </div>
            </div>
        </>
    );
}

export default (props) => (
    <EmployeeStateProvider reducer={employeeStateReducer} initialState={{...initialState, ...props}}>
        <Index {...props} />
    </EmployeeStateProvider>
)


