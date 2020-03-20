import React, {useEffect, useState} from "react";
import {Button, Card, Divider, Form, Icon, Input, message, Modal, Table, Upload} from "antd";
import {Col, Row} from "reactstrap";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import {parseCookies} from "nookies";
import {redirectUser} from "../../../utils/auth";
import LeavesList from "../../Leave/LeavesList";

const {Dragger} = Upload;
const FormItem = Form.Item;

function EmployeeLeaves({id, ctx, form, user}) {
    const [loading, setLoading] = useState(false);
    const [leaves, setLeaves] = useState(null);
    useEffect( () => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getLeaves();
            setLeaves(data.leaves)
            setLoading(false)
        }
        fetchData();
    }, []);
    const getLeaves = async () => {
        const url = `${baseUrl}/api/leaves/${id}`;
        const response = await axios.get(url);
        return {leaves: response.data.leaves}
    };
    return (
        <>
            <Card style={{minHeight: '100vh'}}>

                <h1>Time Off</h1>
                <Row>
                    <Col>
                        {(leaves) && <LeavesList user={user} leaves={leaves}/>}
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default Form.create()(EmployeeLeaves);
