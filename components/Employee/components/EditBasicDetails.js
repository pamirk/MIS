import {Button, DatePicker, Divider, Form, Input, message, Select} from 'antd';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import catchErrors from "../../../utils/catchErrors";
import moment from "moment";
import * as _ from "lodash";
import baseUrl from "../../../utils/baseUrl";
import axios from "axios";
import {formItemLayout} from "../../Common/UI";

const {TextArea} = Input;

const FormItem = Form.Item;
const {Option} = Select;


function EditBasicDetails({handleCancel, hideHandler, id, data, form}) {
    const [loading, setLoading] = useState(false);
    const [fieldsValue, setFieldsValue] = useState(null);
    const designation = useRef(null);

    useEffect(() => {
        setBaseInfo();
    }, []);

    const setBaseInfo = () => {
        if (data) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                obj[key] = data[key] || null;
                if (key === 'appointment_date' || key === 'birth_date') {
                    obj[key] = moment(data[key]);
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
                    setLoading(true);
                    const url = `${baseUrl}/api/one_employee_update`;
                    const payload = {...values, employee_id: id};
                    console.log(payload)

                    const response = await axios.post(url, payload);

                    if (response.data.status === 200) {
                        console.log(response.data.row)
                        hideHandler()
                    }
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const {getFieldDecorator} = form;
    return (
        <div className='p-5'>
            <Form layout='vertical' onSubmit={handlerSubmit} {...formItemLayout} >
                <FormItem label="CNIC">{getFieldDecorator('cnic', {rules: [{required: true, message: "CNIC is required"}]})
                (<Input size='large' type='text' className='w-100' placeholder="CNIC"/>)}</FormItem>
                <FormItem label="Full Name">{getFieldDecorator('full_name', {
                    rules: [{
                        required: true,
                        message: "Full Name is required"
                    }]
                })
                (<Input size='large' type='text' className='w-100' placeholder="Full Name"/>)}
                </FormItem>
                <FormItem label="Father Name">{
                    getFieldDecorator('father_name', {
                        rules: [{required: true, message: "Father Name is required"}]
                    })(<Input size='large' type='text' className='w-100' placeholder="Father Name"/>)}
                </FormItem>
                <FormItem label="Date of Appointment">{
                    getFieldDecorator('appointment_date', {
                        rules: [{required: true, message: "Date of Appointment is required"}]
                    })(<DatePicker size='large' className='w-100' format="YYYY-MM-DD"
                                   placeholder="Date of Appointment"/>)}
                </FormItem>
                <FormItem label="Date of Birth">{
                    getFieldDecorator('birth_date', {
                        rules: [{required: true, message: "Date of Birth is required"}]
                    })(<DatePicker size='large' className='w-100' format="YYYY-MM-DD" placeholder="Date of Birth"/>)}
                </FormItem>
                <FormItem label="Email">{
                    getFieldDecorator('email', {
                        rules: [{required: true, message: "Email is required"}]
                    })(<Input size='large' type='email' className='w-100' placeholder="Email"/>)}
                </FormItem>
                <FormItem label="Local">{
                    getFieldDecorator('local', {
                        rules: [{required: true, message: "Local is required"}]
                    })(<Input size='large' type='text' className='w-100' placeholder="Local"/>)}
                </FormItem>

                <FormItem label="gender">{
                    getFieldDecorator('gender', {
                        rules: [{required: true, message: "Gender not selected"}]
                    })(
                        <Select>
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
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


export default Form.create()(EditBasicDetails);
