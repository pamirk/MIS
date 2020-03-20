import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import React from "react";
import {useRouter} from 'next/router'
import EmployeeAddressHome from "../../components/AddEmployee/EmployeeAddressHome";

function EmployeeHome() {
    const router = useRouter();
    const {employee_id} = router.query;

    console.log(employee_id);
    return (
        <div style={{minHeight: '100vh'}}>
            <EmployeeAddressHome id={employee_id}/>
        </div>
    );
}

export default EmployeeHome;
