import React, {useEffect, useState} from 'react';
import {Button, Card, Checkbox, Col, Divider, Form, Input, message, Row} from "antd";
import {formItemLayout} from "../../components/Common/UI";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import catchErrors from "../../utils/catchErrors";
import moment from "moment";

const FI = Form.Item;

function RolesForm({form, handlerSubmit, data}) {
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState(null);
    const fd = form.getFieldDecorator;
    useEffect(() => {
        getPermissions();
        if (data) {
            console.log(data);
            setBaseInfo();
        }
    }, []);

    const setBaseInfo = () => {
        if (data) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                obj[key] = data[key] || null;
                form.setFieldsValue(obj);
            });
        }
    };
    const getPermissions = async () => {
        const url = `${baseUrl}/api/permissions`;
        const {status, data: {rows}} = await axios.get(url);
        let myMap = new Map();
        rows.forEach(value => {
            if (myMap.get(value.type)) {
                myMap.set(value.type,  [...myMap.get(value.type), {name: value.name, id: value.id, key: value.id}])
            } else {
                myMap.set(value.type, [{name: value.name, id: value.id}])
            }
        });
        setPermissions(myMap)
    };
    const permissionsList = () => {
        const list = [];
        permissions.forEach((value, index) => {
                list.push(<h3 key={index} className='font-weight-bold text-capitalize'>{index}</h3>);
                value.map(v => {
                        list.push(<Row key={v.id}>
                            <Col span={8} push={2}>
                                <Checkbox value={v.id}>{v.name}</Checkbox>
                            </Col>
                        </Row>)
                    }
                )
            }
        );
        return list
    };

    return (
        <Card>
            <Form className='p-2' layout='vertical' onSubmit={(e) => handlerSubmit(e, form)} {...formItemLayout} >
                <div className='d-flex flex-wrap justify-content-between align-items-center'>
                    <span>Employee Roles</span>
                    <div>
                        <Button size={"large"} className='mr-1' onClick={null}>Cancel</Button>
                        <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                                disabled={loading}> {loading ? "Saving" : "Save"}</Button>
                    </div>
                </div>
                <Divider/>
                <FI label="Name">{fd('name', {rules: [{required: true, message: "Name is required"}]})
                (<Input size='large' className='w-100' placeholder="Name"/>)}</FI>

                <FI label="Description">{fd('description', {rules: [{required: true, message: "Description is required"}]
                })
                (<Input size='large' className='w-100' placeholder="Description"/>)}</FI>

                <Divider/>

                <FI label="">{fd('permissions', {rules: [{
                        required: true,
                        message: "At least on Permission should be selected"
                    }]
                })
                (<Checkbox.Group style={{width: '100%'}}>{permissions && permissionsList()}</Checkbox.Group>)}</FI>

            </Form>
        </Card>
    );
}
export default Form.create()(RolesForm);
