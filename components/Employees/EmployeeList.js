import React, {useState} from 'react';
import EmployeeTable from "./EmployeeTable";
import baseUrl from "../../utils/baseUrl";

export default function EmployeeList({employees, history}) {
    const [data, setData] = useState(employees);

    let performSearch = (query) => {
        let url = `search?search=${query}`;

        fetch(baseUrl + `/api/${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                this.setState({
                    data: data,
                    loading: false
                });
            })
            .catch(error => {
                console.log('Error fetching and parsing data', error);
            });
    };

    return (
        <>
            <EmployeeTable data={data} history={history}/>
        </>
    );

}
