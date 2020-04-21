import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import baseUrl from "../../../utils/baseUrl";
import {Button, DatePicker, Divider, Form, Input, message, Select} from 'antd';
import axios from "axios";
import catchErrors from "../../../utils/catchErrors";
import {LEAVE_STATUS} from "../../../server/utils/status";
import {formItemLayout} from "../../Common/UI";

const {Option} = Select;
const FormItem = Form.Item;

function PromoteDesignation({Indexkey, hideHandler, id, data, form, handleCancelProp}) {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [departments, setDepartments] = useState(null);
    const [designationsItems, setDesignationsItems] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(data[0]["department_name"] || null);

    useEffect(() => {
        if (Indexkey) {
            setBaseInfo();
        }
        form.setFieldsValue({department_name: selectedDepartment});
        getDepartmentList();
        console.log('selectedDepartment', selectedDepartment);
        if (data[0]["department_id"]){
            getDesignationsList(data[0]["department_id"]);
        }
    }, []);

    const setBaseInfo = () => {
        const row = data.filter(item => item.emp_des_id === Indexkey);
        const d = row[0];
        const mydata = {
            emp_des_order_date: d.emp_des_order_date.substring(0, 10),
            emp_des_appointment_date: d.emp_des_appointment_date.substring(0, 10),
            department_name: d.department_name,
            des_title: d.des_title,
            des_photo: d.emp_des_order_letter_photo,
        };
        if (mydata) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                obj[key] = mydata[key] || null;
                form.setFieldsValue(obj);
            });
        }

    };
    const handlerSubmit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    setLoading(true);
                    const url = `${baseUrl}/api/promote_emoployee`;
                    const fd = new FormData();
                    Object.keys(form.getFieldsValue()).forEach((value, key, data) => fd.append(value, form.getFieldValue(value)));
                    fd.append("employee_id", id);
                    fd.append('image', image, image.name);
                    const response = await axios.post(url, fd);
                    const {status} = response.data;
                    if (status === 200) {
                        message.success("Operation Successfully Performed ", 2);
                        hideHandler()
                    } else if (status === 500) {
                        message.error("Error while performing Action ", 2);
                    }
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const getDepartmentList = async () => {
        let items = [];
        const url = `${baseUrl}/api/department_list`;
        const {data} = await axios.get(url);
        data.map(d => items.push(<Select.Option key={d.department_id}
                                                value={d.department_id}>{d.department_name}</Select.Option>));
        setDepartments(items);
    };
    const getDesignationsList = async (id) => {
        let items = [];
        const url = `${baseUrl}/api/designation_list/${id}`;
        const {data} = await axios.get(url);
        data.map(d => items.push(<Select.Option key={d.des_id}
                                                value={d.des_id}>{d.des_title}</Select.Option>));
        setDesignationsItems(items);
    };

    const onDepartmentMenuChange = (id) => {
        setSelectedDepartment(id);
        getDesignationsList(id);
    };

    const onImageDataChange = (e) => {
        let files = e.target.files;
        if (files && files[0]) {
            setImage(files[0]);
        }
    };
    const {getFieldDecorator} = form;
    return (
        <div className='p-5'>
            <Form onSubmit={handlerSubmit}  {...formItemLayout} >
                <FormItem label="Promotion Order Date">{
                    getFieldDecorator('emp_des_order_date', {
                        rules: [{required: true, message: "Provide Date of Designation"}]
                    })(<DatePicker className='w-100' size='large' placeholder="Date of Designation"/>)}
                </FormItem>
                <FormItem label="Appointment Date">{
                    getFieldDecorator('emp_des_appointment_date', {
                        rules: [{required: true, message: "Please Provide Appointment date"}]
                    })(<DatePicker className='w-100' size='large' placeholder="Date of Appointment"/>)}
                </FormItem>
                <FormItem label="Department Name">{
                    getFieldDecorator('department_name', {
                        rules: [{required: true, message: "Select Department Name"}]
                    })(
                        <Select onChange={onDepartmentMenuChange} placeholder='Select Department'>
                            {departments}
                        </Select>
                    )}
                </FormItem>
                <FormItem label="Designation Title">{
                    getFieldDecorator('des_id', {
                        rules: [{required: true, message: "Select Designation Title"}]
                    })(<Select placeholder='Select Designation'>
                        {designationsItems}
                    </Select>)}
                </FormItem>
                <FormItem label="Designation Image">{
                    getFieldDecorator('des_photo', {
                        rules: [{required: true, message: "Please Provide Designation Image"}]
                    })(
                        <Input onChange={onImageDataChange} type='file' size='large' title='Designation Letter Photo'/>
                    )}
                </FormItem>
                <Divider/>
                <div className='flex-justify-content'>
                    <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                            disabled={loading}
                            style={{backgroundColor: '#0a8080', color: 'white'}}>Submit</Button>
                    <Button onClick={handleCancelProp} size={"large"}>Cancel</Button>
                </div>
            </Form>
        </div>
    );
}


export default Form.create()(PromoteDesignation);
