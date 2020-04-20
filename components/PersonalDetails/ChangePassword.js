import React, {useState} from "react";
import baseUrl from "../../utils/baseUrl";
import {Button, Card, Divider, Form, Input, message} from "antd";
import axios from "axios";
import catchErrors from "../../utils/catchErrors";
import {formItemLayout} from "../Common/UI";

const ChangePassword = ({id, form}) => {
    const [loading, setLoading] = useState(false);
    const [confirmDirty, setConfirmDirty] = useState(false);
    const {getFieldDecorator} = form;

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

    const submit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    setLoading(true);//update_employee_status
                    const url = `${baseUrl}/api/set_employee_password_by_employee`;
                    if (values.old_password === values.password) {
                        return message.error("You are providing same values for old and new passwords")
                    }
                    const payload = {old_password: values.old_password, new_password: values.password, id};
                    console.log(payload);
                    const {data} = await axios.post(url, payload);
                    if (data.status === 200) {
                        message.success(data.message)
                    } else {
                        message.error(data.message)
                    }
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    form.resetFields();
                    setLoading(false);
                }
            }
        });
    };
    return (
        <Card bordered={false} title='Change Password'>
            <Form layout='vertical' onSubmit={submit} {...formItemLayout} >
                <Form.Item label="Old Password" hasFeedback>{
                    getFieldDecorator('old_password', {
                        rules: [{required: true, message: "Old Password is required"}]
                    })(<Input.Password size='large' className='w-100'/>)}
                </Form.Item>
                <Form.Item label="New Password" hasFeedback>{
                    getFieldDecorator('password', {
                        rules: [{required: true, message: "Password is required"}, {validator: validateToNextPassword}]
                    })
                    (
                        <Input.Password size='large' className='w-100'/>
                    )}
                </Form.Item>
                <Form.Item label="Confirm Password" hasFeedback>{
                    getFieldDecorator('conform_password', {
                        rules: [{
                            required: true,
                            message: "type Password again here"
                        }, {validator: compareToFirstPassword}]
                    })
                    (
                        <Input.Password size='large' className='w-100' onBlur={handleConfirmBlur}/>
                    )}
                </Form.Item>
                <Divider/>
                <div className='flex-justify-content'>
                    <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                            disabled={loading}
                            style={{backgroundColor: '#0a8080', color: 'white'}}>Change</Button>
                </div>
            </Form>
        </Card>
    )
};
export default Form.create()(ChangePassword);

