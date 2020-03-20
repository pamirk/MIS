import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import React from "react";
import {useRouter} from 'next/router'
import EmployeeDesignationHome from "../../components/AddEmployee/EmployeeDesignationHome";

function EmployeeDesignation() {
    const router = useRouter();
    const {employee_id} = router.query;

    console.log(employee_id);
    return (
        <div style={{minHeight: '100vh'}}>
            <EmployeeDesignationHome id={employee_id}/>
        </div>
    );
}

export default EmployeeDesignation;
