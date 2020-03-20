import React, {useEffect, useState} from "react";
import EmployeeBioDataComponent from "./EmployeeBioDataComponent";
import ProgressStepper from "./ProgressStepper";
import EmployeeAddressComponent from "./EmployeeAddressComponent";
import EmployeeDesignationComponent from "./EmployeeDesignationComponent";
import {Divider, Result, Button, Modal} from "antd";
import baseUrl from "../../utils/baseUrl";
import Link from "next/link";
import Router from "next/router";
import Error from "next/error";


export default function EmployeeDesignationHome({id}) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [address_data, setAddress_data] = useState(null);
    const [designation_data, setDesignation_data] = useState(null);

    useEffect(() => getData(), []);

    const getData = () => {
        fetch(baseUrl + `/api/show_one_employee/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                setData(data[0]);
                getEmployeeAddress()
            })
    };
    const getEmployeeAddress = () => {
        fetch(baseUrl + `/api/show_one_employee_address/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                setAddress_data(data[0]);
                getEmployeeDesignation()
            })
    };
    const getEmployeeDesignation = () => {
        fetch(baseUrl + `/api/employee_designation_details/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                setDesignation_data(data[0]);
                setLoading(false);
            })
    };

    return ( (data && data.length !== 0) ?
        <>
            <ProgressStepper curr={10}/>
            {(!loading) ?
                <div className='p-5'>
                    <Result
                        status="success"
                        title="Employee Successfully Added "
                        subTitle=""
                        extra={[
                            <Button onClick={() => Router.push('/')}>
                                Go back to Main Page
                            </Button>,
                            <Button onClick={() => Router.push('/add_employee')}>Add another Employee</Button>,
                        ]}
                    />
                    <Divider orientation="left" type="horizontal">Employee Bio Dataa</Divider>
                    <EmployeeBioDataComponent data={data}/><Divider/>
                    <Divider orientation="left" type="horizontal">Employee Address</Divider>
                    {address_data && <EmployeeAddressComponent data={address_data}/>}<Divider/>
                    <Divider orientation="left" type="horizontal">Employee Designation Details</Divider>
                    {designation_data && <EmployeeDesignationComponent data={designation_data}/>}<Divider/>
                </div>
                : ""
            }
        </> : (loading) ? "loading" : <Error statusCode={404} title={`Employee with ${id} id does't exists`} />
    );


}
