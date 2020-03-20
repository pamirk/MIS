import React, {Component, useState} from 'react';
import EmployeeTable from "./EmployeeTable";
import baseUrl from "../../utils/baseUrl";
import {Layout} from "antd";

export default function EmployeeList({employees, history}) {
    const [data, setData] = useState(employees);

    let handleEmployeeClicked = (index) => {


        console.log(index);
        this.setState(() => {
            return {};
        });
    };

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
        <Layout>
            {/*<SearchForm onSearch={this.performSearch}/>*/}
            <EmployeeTable data={data} history={history}/>
            {/*{(this.state.loading) ? "" :
                        <EMenuList handleEmployeeClicked={this.handleEmployeeClicked} data={this.state.data}
                                   history={this.props.history}/>}*/}
        </Layout>
    );

}
