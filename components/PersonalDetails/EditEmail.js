import React, {useEffect, useState} from "react";
import * as _ from "lodash";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import {Button, Card, Divider, Form, Input, message} from "antd";
import catchErrors from "../../utils/catchErrors";
import {formItemLayout} from "../Common/UI";

const EditEmail = ({id, form, data, handleCancel, handleSuccess}) => {
    const [loading, setLoading] = useState(false);
    const [fieldsValue, setFieldsValue] = useState(null);

    useEffect(() => setInfo(), []);
    const setInfo = () => {
        if (data) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                obj[key] = data[key] || null;
                form.setFieldsValue(obj);
            });
            setFieldsValue(form.getFieldsValue())
        }
    };

    const emailSubmit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                if (_.isEqual(values, fieldsValue)) {
                    return handleCancel()
                }
                try {
                    setLoading(true);
                    const url = `${baseUrl}/api/emailUpdate`;
                    const payload = {...values, employee_id: id};
                    console.log(payload);
                    const response = await axios.post(url, payload);
                    if (response.data.status === 200) {
                        message.success("Email Updated", 3);
                        handleSuccess(values.email)
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
        <Card bordered={false}
              title={<strong className={'text-large font-weight-bold'}>Edit Email</strong>}>
            <Form layout='vertical' onSubmit={emailSubmit} {...formItemLayout} >
                <Form.Item label="Email">{form.getFieldDecorator('email', {
                    rules: [{required: true, message: "Current Address required"}]
                })
                (<Input size='large' type='email' className='w-100' placeholder="Email Address"/>)}</Form.Item>

                <Divider/>
                <div className='flex-justify-content'>
                    <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                            disabled={loading}
                            style={{backgroundColor: '#0a8080', color: 'white'}}>Submit</Button>
                    <Button onClick={handleCancel} size={"large"}>Cancel</Button>
                </div>
            </Form>
        </Card>
    )
};
export default Form.create()(EditEmail);