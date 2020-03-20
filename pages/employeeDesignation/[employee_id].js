import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import React from "react";
import Router, {useRouter} from 'next/router'
import EmployeeDesignationForm from "../../components/AddEmployee/EmployeeDesignationForm";
import AddDesignationDetails from "../../components/Employee/components/AddDesignationDetails";

function EmployeeDesignation() {
    const router = useRouter();
    const {employee_id} = router.query;

    const hideHandler = () => {
        Router.push(`/employee_designationHome/${employee_id}`);
    };
    return (
        <div style={{minHeight: '100vh'}}>
            {/*<EmployeeDesignationForm employee_id={employee_id}/>*/}
            <AddDesignationDetails  hideHandler={hideHandler} id={employee_id} />
        </div>
    );
}

export default EmployeeDesignation;
