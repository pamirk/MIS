import {Button, Divider, Form, message, Select} from 'antd';
import React, {useEffect, useState} from 'react';
import catchErrors from "../../../utils/catchErrors";
import * as _ from "lodash";
import {formItemLayout} from "../../Common/UI";
import moment from "moment";
import baseUrl from "../../../utils/baseUrl";
import axios from "axios";
const FormItem = Form.Item;
const {Option} = Select;

function EditAccountSettings({handleCancel,handleSuccess, id, data, form}) {
    const [loading, setLoading] = useState(false);
    const [fieldsValue, setFieldsValue] = useState(null);
    const {getFieldDecorator} = form;

    useEffect(() => {
        setBaseInfo();
    }, []);
    const setBaseInfo = () => {
        if (data) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                obj[key] = data[key] || null;
                if (key === 'employee_is_active' || key === 'is_admin') {
                    obj[key] = data[key]
                }
                form.setFieldsValue(obj);
            });
            setFieldsValue(form.getFieldsValue())
        }
    };
    const handlerSubmit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err && !_.isEqual(values, fieldsValue)) {
                try {
                    setLoading(true);//update_employee_status
                    const url = `${baseUrl}/api/update_employee_status`;
                    const payload = {...values, id};
                    console.log(payload)
                    const response = await axios.post(url, payload);
                    const data = response.data;
                    if (data.status === 200) {
                        handleSuccess()
                    }
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    setLoading(false);
                }
            }
        });
    };
    return (
        <div className='p-5'>
            <Form layout='vertical' onSubmit={handlerSubmit} {...formItemLayout} >

                <FormItem label="Status">{
                    getFieldDecorator('employee_is_active', {
                        rules: [{required: true, message: "Status not selected"}]
                    })
                    (
                        <Select size='large' className='w-50'>
                            <Option value={1}>Active</Option>
                            <Option value={0}>Disabled</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label="Role">{
                    getFieldDecorator('is_admin', {
                        rules: [{required: true, message: "Status not selected"}]
                    })
                    (
                        <Select size='large' className='w-50'>
                            <Option value={0}>Employee</Option>
                            <Option value={1}>Admin</Option>
                        </Select>
                    )}
                </FormItem>
                <Divider/>
                <div className='flex-justify-content'>
                    <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                            disabled={loading}
                            style={{backgroundColor: '#0a8080', color: 'white'}}>Update</Button>
                    <Button onClick={handleCancel} size={"large"}>Cancel</Button>
                </div>
            </Form>
        </div>
    );
}


export default Form.create()(EditAccountSettings);
