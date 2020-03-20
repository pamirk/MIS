import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import React from "react";
import Router, {useRouter} from 'next/router'
import EmployeeAddressForm from "../../components/AddEmployee/EmployeeAddressForm";
import AddAddressDetails from "../../components/Employee/components/AddAddressDetails";

function EmployeeHome() {
    const router = useRouter();
    const {employee_id} = router.query;

    console.log(employee_id);
    const addAddressHideHandler = () => {
        Router.push(`/employeeAddressHome/${employee_id}`)
    };
    return (
        <div style={{minHeight: '100vh'}}>
            {/*<EmployeeAddressForm id={employee_id}/>*/}
            <AddAddressDetails type={1} hideHandler={addAddressHideHandler} id={employee_id} handleCancel={null} />
        </div>
    );
}

export default EmployeeHome;
