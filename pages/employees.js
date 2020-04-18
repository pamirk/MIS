import EmployeeList from "../components/Employees/EmployeeList";
import React from "react";
import baseUrl from "../utils/baseUrl";
import axios from "axios";

function Employees({employees}) {
    return <div className='min-vh-100'>
         <EmployeeList employees={employees}/>
    </div>;
}

Employees.getInitialProps = async ctx => {
    const url = `${baseUrl}/api/employee_list`;
    const response = await axios.get(url);

    return { employees: response.data };
};
export default Employees;
