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


function AddAddressDetails({itemkey, handleCancel, hideHandler, id, data, type, form}) {
    const [loading, setLoading] = useState(false);
    /*
        const [fieldsValue, setFieldsValue] = useState(null);
        useEffect(() => {
            setBaseInfo();
        }, []);

        const setBaseInfo = () => {
            if (data) {
                Object.keys(form.getFieldsValue()).forEach(key => {
                    const obj = {};
                    obj[key] = data[key] || null;
                    if (key === 'last_update_ts') {
                        obj[key] = moment(data[key]);
                    }
                    form.setFieldsValue(obj);
                });
                setFieldsValue(form.getFieldsValue())
            }
        };*/
    const handlerSubmit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    setLoading(true);
                    const url = `${baseUrl}/api/add_employee_address`;
                    const payload = {...values, employee_id: id, type: type};
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
                <FormItem label="Current Address">{getFieldDecorator('current_address', {
                    rules: [{required: true, message: "Current Address required"}]
                })
                (<Input size='large' type='text' className='w-100' placeholder="Current Address"/>)}</FormItem>
                <FormItem label="Permanent Address">{getFieldDecorator('permanent_address', {
                    rules: [{required: true, message: "Permanent Address is required, "}]
                })
                (<Input size='large' type='text' className='w-100' placeholder="Permanent Address"/>)}
                </FormItem>
                <FormItem label="Postal Code">{
                    getFieldDecorator('postal_code', {
                        rules: [{required: true, message: "Postal Code is required"}]
                    })(<Input size='large' type='number' className='w-100' placeholder="Postal Code"/>)}
                </FormItem>
                <FormItem label="Phone Number">{
                    getFieldDecorator('phone_number', {
                        rules: [{required: true, message: "Phone Number is required"}]
                    })(<Input type='number' size='large' className='w-100' placeholder="Phone Number"/>)}
                </FormItem>
                <FormItem label="Phone Number 2">{
                    getFieldDecorator('phone_number2')
                    (<Input type='number' size='large' className='w-100' placeholder="Phone Number"/>)}
                </FormItem>
                <FormItem label="Employee move-in date">{
                    getFieldDecorator('last_update_ts', {
                        rules: [{required: true, message: "move-in date is required"}]
                    })(<DatePicker size='large' className='w-100' format="YYYY-MM-DD" placeholder="move-in date"/>)}
                </FormItem>

                <Divider/>
                <div className='flex-justify-content'>
                    <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                            disabled={loading}
                            style={{backgroundColor: '#0a8080', color: 'white'}}>Submit</Button>
                    {handleCancel && <Button onClick={handleCancel} size={"large"}>Cancel</Button>}
                </div>
            </Form>
        </div>
    );
}


export default Form.create()(AddAddressDetails);
