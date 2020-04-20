import * as React from 'react';
import {useState} from 'react';
import {useEffect} from "react";
import baseUrl from "../../../utils/baseUrl";
import axios from "axios";
import {List, Skeleton} from "antd";
import moment from "moment";

function EmployeeLogs({id}) {
    const [loading, setLoading] = useState(false);
    const [employeeEvents, setEmployeeEvents] = useState(null);
    useEffect(() => {
        getEmployeeEvents()
    }, []);

    const getEmployeeEvents = async () => {
        setLoading(true);
        const url4 = `${baseUrl}/api/employee_events/${id}`;
        const {status, data} = await axios.get(url4);
        setEmployeeEvents(data.rows)
        setLoading(false);
    };
    return (
        <>
            {employeeEvents && <List
                size="large"
                className="demo-loadmore-list"
                loading={loading}
                itemLayout="horizontal"
                dataSource={employeeEvents}
                renderItem={item => (
                    <List.Item className='p-5'>
                        <List.Item.Meta
                            title={item.type}
                            description={item.description}/>

                            <div>{moment(item.ts).fromNow()}</div>
                    </List.Item>
                )}/>
            }
        </>
    );
}

export default EmployeeLogs;