import {Button, Divider, Form, message, Select, Input} from 'antd';
import React, {useEffect, useState} from 'react';
import catchErrors from "../../../utils/catchErrors";
import * as _ from "lodash";
import {formItemLayout} from "../../Common/UI";
import moment from "moment";
import baseUrl from "../../../utils/baseUrl";
import axios from "axios";

const FormItem = Form.Item;
const {Option} = Select;

function ResetPassword({handleCancel, handleSuccess, id, form}) {
    const [loading, setLoading] = useState(false);
    const [confirmDirty, setConfirmDirty] = useState(false);
    const {getFieldDecorator} = form;

    const handlerSubmit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    setLoading(true);//update_employee_status
                    const url = `${baseUrl}/api/set_employee_password`;
                    const payload = {password: values.password, id};
                    console.log(payload);
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
    const handleConfirmBlur = e => {
        const {value} = e.target;
        setConfirmDirty(confirmDirty || !!value)
    };
    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };
    const validateToNextPassword = (rule, value, callback) => {
        if (value && confirmDirty) {
            form.validateFields(['conform_password'], {force: true});
        }
        callback();
    };
    return (
        <div className='p-5'>
            <Form layout='vertical' onSubmit={handlerSubmit} {...formItemLayout} >

                <FormItem label="New Password" hasFeedback>{
                    getFieldDecorator('password', {
                        rules: [{required: true, message: "Password is required"}, {validator: validateToNextPassword}]
                    })
                    (
                        <Input.Password size='large' className='w-100'/>
                    )}
                </FormItem>
                <FormItem label="Confirm Password" hasFeedback>{
                    getFieldDecorator('conform_password', {
                        rules: [{required: true, message: "type Password again here"}, {validator: compareToFirstPassword}]
                    })
                    (
                        <Input.Password size='large' className='w-100' onBlur={handleConfirmBlur}/>
                    )}
                </FormItem>
                <Divider/>
                <div className='flex-justify-content'>
                    <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                            disabled={loading}
                            style={{backgroundColor: '#0a8080', color: 'white'}}>Submit</Button>
                    <Button onClick={handleCancel} size={"large"}>Cancel</Button>
                </div>
            </Form>
        </div>
    );
}


export default Form.create()(ResetPassword);
