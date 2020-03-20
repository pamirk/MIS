import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import React from "react";
import {useRouter} from 'next/router'
import Employee from "../../components/AddEmployee/Employee";

function EmployeeHome() {
    const router = useRouter();
    const {employee_id} = router.query;
    return (
        <div style={{minHeight: '100vh'}}>
            <Employee id={employee_id}/>
        </div>
    );
}

export default EmployeeHome;
