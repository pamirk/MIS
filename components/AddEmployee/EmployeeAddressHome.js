import React, {Component, useEffect, useState} from "react";
import EmployeeBioDataComponent from "./EmployeeBioDataComponent";
import {Button, Divider} from "antd";
import ProgressStepper from "./ProgressStepper";
import EmployeeAddressComponent from "./EmployeeAddressComponent";
import baseUrl from "../../utils/baseUrl";
import Router from "next/router";
import Error from "next/error";

export default function EmployeeAddressHome({id}) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [address_data, setAddress_data] = useState(null);

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
                setLoading(false);

            })
    };

    const gotoEmployeeDesignationForm = () => {
        Router.push(`/employeeDesignation/${data.employee_id}`);
    };
    return ( (data && data.length !== 0) ?
        <>
            <ProgressStepper curr={2}/>
            <div className="p-5">
                <Divider orientation="left" type="horizontal">Employee Bio Dataa</Divider>
                {data && <EmployeeBioDataComponent data={data}/>}
                <Divider orientation="left" type="horizontal">Employee Address</Divider>
                {address_data && <EmployeeAddressComponent data={address_data}/>}
                <div className='pt-5'>
                    <Button color="primary" size="large" onClick={gotoEmployeeDesignationForm}>
                        Add Employee Designation</Button>
                </div>
            </div>
        </> : <Error statusCode={404} title={`Employee with ${id} id does't exists`} />
    );

}
