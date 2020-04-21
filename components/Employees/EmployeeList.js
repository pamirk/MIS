import React, {useState} from 'react';
import EmployeeTable from "./EmployeeTable";

export default function EmployeeList({employees, history}) {
    const [data, setData] = useState(employees);
    return (
        <>
            <EmployeeTable data={data} history={history}/>
        </>
    );

}
