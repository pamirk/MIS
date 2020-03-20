import React, {useState} from 'react';
import axios from "axios";
import {DatePicker, Divider, Form, Icon, message, Select, Upload, Button, Input} from "antd";
import ProgressStepper from "./ProgressStepper";
import baseUrl from "../../utils/baseUrl";
import Router from "next/router";
import catchErrors from "../../utils/catchErrors";
import {formItemLayout, getBase64} from "../Common/UI";

const FormItem = Form.Item;
const {Option} = Select;

function CreateEmployee({form}) {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState();
    const [image, setImage] = useState();

    const handlerSubmit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    setLoading(true);
                    const fd = new FormData();
                    Object.keys(form.getFieldsValue()).forEach((value, key, data) => fd.append(value, form.getFieldValue(value)));
                    fd.append('image', file, file.name);
                    const url = `${baseUrl}/api/employee_create`;
                    const response = await axios.post(url, fd);
                    const {status} = response.data;
                    if (status === 200) {
                        message.success('Successfully Register Employee', 5);
                        Router.push(`/employeeHome/${response.data.employee_id}`)
                    } else if (status === 500) {
                        message.error(response.data.err, 2);
                    }
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    setLoading(false);
                }
            }
        });
    };
    const uploadButton = (
        <div>
            <Icon type={loading ? 'loading' : 'plus'}/>
            <div className="ant-upload-text">Upload</div>
        </div>
    );
    const DraggerProps = {
        showUploadList: false,
        beforeUpload: file => {
            setFile(file);
            return false;
        },
        onChange: file => {
            getBase64(file.fileList[file.fileList.length - 1].originFileObj,
                    imageUrl => {
                    setImage(imageUrl);
                    setLoading(false);
                }
            );
        },
        listType: "picture-card",
        className: "avatar-uploader",
    };
    const {getFieldDecorator} = form;
    return (
        <>
            <ProgressStepper curr={0}/>
            <div className='p-5'>
                <Form layout='vertical' onSubmit={handlerSubmit} {...formItemLayout} >
                    <FormItem label="Employee Form Number">{getFieldDecorator('form_number', {
                        rules: [{required: true, message: "Form Number is required"}]
                    })
                    (<Input size='large' type='number' className='w-100' placeholder="1234"/>)}</FormItem>
                    <FormItem label="CNIC">{getFieldDecorator('cnic', {
                        rules: [{required: true, message: "CNIC is required"}]
                    })
                    (<Input size='large' type='number' className='w-100' placeholder="CNIC"/>)}</FormItem>
                    <FormItem label="Full Name">{getFieldDecorator('full_name', {
                        rules: [{required: true, message: "Full Name is required"}]
                    })
                    (<Input size='large' type='text' className='w-100' placeholder="Full Name"/>)}
                    </FormItem>
                    <FormItem label="Father Name">{
                        getFieldDecorator('father_name', {
                            rules: [{required: true, message: "Father Name is required"}]
                        })
                        (<Input size='large' type='text' className='w-100' placeholder="Father Name"/>)}
                    </FormItem>
                    <FormItem label="Date of Birth">{
                        getFieldDecorator('birth_date', {
                            rules: [{required: true, message: "Date of Birth is required"}]
                        })
                        (<DatePicker size='large' className='w-100' format="YYYY-MM-DD" placeholder="Date of Birth"/>)}
                    </FormItem>
                    <FormItem label="Date of Appointment">{
                        getFieldDecorator('appointment_date', {
                            rules: [{required: true, message: "Date of Appointment is required"}]
                        })
                        (<DatePicker size='large' className='w-100' format="YYYY-MM-DD"
                                     placeholder="Date of Appointment"/>)}
                    </FormItem>
                    <FormItem label="Email">{
                        getFieldDecorator('email', {
                            rules: [{required: true, message: "Email is required"}]
                        })
                        (<Input size='large' type='email' className='w-100' placeholder="Email"/>)}
                    </FormItem>
                    <FormItem label="Local">{
                        getFieldDecorator('local', {
                            rules: [{required: true, message: "Local is required"}]
                        })
                        (<Input size='large' type='text' className='w-100' placeholder="Local"/>)}
                    </FormItem>

                    <FormItem label="gender">{
                        getFieldDecorator('gender', {
                            rules: [{required: true, message: "Gender not selected"}]
                        })
                        (
                            <Select size='large' className='w-50'>
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="Upload Photo">{
                        getFieldDecorator('image', {
                            rules: [{required: true, message: "Provide Photo"}]
                        })
                        (
                            <Upload {...DraggerProps} >
                                {image ? <img src={image} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                            </Upload>
                        )}
                    </FormItem>
                    <Divider/>
                    <div className='flex-justify-content'>
                        <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                                disabled={loading}
                                style={{backgroundColor: '#0a8080', color: 'white'}}>Register</Button>
                    </div>
                </Form>
            </div>
        </>
    );
}
export default Form.create()(CreateEmployee);
