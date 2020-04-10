import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import Index from "../../components/Employee/Index";
import React from "react";
import {useRouter} from 'next/router'
import Error from "next/error";

function Employee_id({employee, address, designations, ctx, user, roles}) {
    const router = useRouter();
    const {employee_id} = router.query;
    if (!employee) {
        return <Error statusCode={404} title={`Employee with ${employee_id} id does't exists`}/>
    }
    return (
        <div style={{minHeight: '100vh'}}>
            <Index roles={roles} user={user} employee={employee} address={address} designations={designations} ctx={ctx}/>
        </div>
    );
}

Employee_id.getInitialProps = async ({query: {employee_id}, ctx}) => {
    const url = `${baseUrl}/api/show_one_employee/${employee_id}`;
    const url2 = `${baseUrl}/api/show_one_employee_address/${employee_id}`;
    const url3 = `${baseUrl}/api/employee_designation_details/${employee_id}`;
    const employe_res = await axios.get(url);
    const address_res = await axios.get(url2);
    const des_res = await axios.get(url3);
    const url4 = `${baseUrl}/api/roles/${employee_id}`;
    const {status, data} = await axios.get(url4);
    return {
        employee: employe_res.data[0],
        address: address_res.data,
        designations: des_res.data,
        roles: data.rows,
        ctx
    };
};
export default Employee_id;
