import React, {Component, useEffect, useState} from 'react';
import {Button, Divider} from "antd";
import ProgressStepper from "./ProgressStepper";
import EmployeeBioDataComponent from "./EmployeeBioDataComponent";
import baseUrl from "../../utils/baseUrl";
import Router from "next/router";
import Error from "next/error";

export default function Employee({id}) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        getData();
    }, []);

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
                setLoading(false);
            })
    };
    const gotoEmployeeAddress = () => {
        Router.push(`/employeeAddress/${data.employee_id}`);
    };

    return (
        (data && data.length !== 0) ?
            <>
                <ProgressStepper curr={1}/>
                <div className='p-5'>
                    <Divider orientation="left" type="horizontal">Employee Bio Dataa</Divider>
                    {data && <EmployeeBioDataComponent data={data}/>}
                    <div className='pt-5'>
                        <Button color="primary" size="large" onClick={gotoEmployeeAddress}>Add Employee
                            Address</Button>
                    </div>
                </div>
            </> :
            <Error statusCode={404} title={`Employee with ${id} id does't exists`}/>
    )
}
