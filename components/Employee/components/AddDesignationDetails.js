import {Upload, Button, DatePicker, Divider, Form, Input, message, Select, Icon} from 'antd';
import * as React from 'react';
import {useEffect, useState} from 'react';
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import catchErrors from "../../../utils/catchErrors";
import moment from "moment";
import {useRef} from "react";
import * as _ from "lodash";
import {formItemLayout} from "../../Common/UI";

const {TextArea} = Input;

const FormItem = Form.Item;
const {Option} = Select;


function AddDesignationDetails({handleOk, hideHandler, id, form}) {
    const [order_Date, setOrder_Date] = useState(false);
    const [appointment_Date, setAppointment_Date] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState();
    const [departs, setDeparts] = useState(null);
    const [designationsItems, setDesignationsItems] = useState(null);
    const [file, setFile] = useState(null);

    const designation = useRef(null);

    useEffect(() => {
        getDepartsList();
    }, []);

    const getDepartsList = () => {
        let items = [];
        fetch(baseUrl + '/api/department_list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                for (let i = 1; i <= data.length; i++) {
                    const d = data[i - 1];
                    items.push(<Option value={d.department_id}>{d.department_name}</Option>)
                }
                setDeparts(items);
            })
    };
    const handlerSubmit = (event) => {
        event.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                try {
                    console.log("file[0].name file[file.length -1].name", file.name);
                    console.log("values", values);
                    setLoading(true);
                    getDataOutofForm();
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    setLoading(false);
                }
            }
        });
    };
    const getDataOutofForm = async () => {
        const fd = new FormData();
        Object.keys(form.getFieldsValue()).forEach((value, key, data) => fd.append(value, form.getFieldValue(value)));
        fd.append("employee_id", id);
        fd.append('des_id', designation.current.props.value);
        fd.append('image', file, file.name);

        const url = `${baseUrl}/api/create_employee_designation`;
        const response = await axios.post(url, fd);
        const {status} = response.data;
        if (status === 200) {
            message.success("Added Successfully", 5);
            hideHandler()
        } else if (status === 500) {
            message.error("Error while performing Action ", 2);
        }

    };
    const onDepartValueSelected = (e) => getDesignationsList(e);
    const getDesignationsList = (e) => {
        let items = [];
        fetch(baseUrl + `/api/designation_list/${e}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                for (let i = 1; i <= data.length; i++) {
                    const d = data[i - 1];
                    items.push(<Option value={d.des_id}>{d.des_title}</Option>)
                }
                setDesignationsItems(items);
            })

    };
    const disabledStartDate = (startValue) => {
        if (!startValue || !appointment_Date) {
            return false;
        }
        return startValue.valueOf() > appointment_Date.valueOf();
    };
    const disabledEndDate = (endValue) => {
        if (!endValue || !order_Date) {
            return false;
        }
        return endValue.valueOf() <= order_Date.valueOf();
    };
    const uploadButton = (
        <div>
            <Icon type={loading ? 'loading' : 'plus'}/>
            <div className="ant-upload-text">Upload</div>
        </div>
    );
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const handleChange = file => {
        console.log(file)
        getBase64(file.fileList[file.fileList.length - 1].originFileObj, imageUrl => {
                setImage(imageUrl);
                setLoading(false);
            }
        );
    };
    const DraggerProps = {
        showUploadList: false,
        beforeUpload: file => {
            setFile(file);
            return false;
        },
    };

    const {getFieldDecorator} = form;
    return (
        <div className='p-5'>
            <Form layout='vertical' onSubmit={handlerSubmit} {...formItemLayout} >
                <FormItem label="Designation Order Date">{
                    getFieldDecorator('emp_des_order_date', {
                        rules: [{required: true, message: "Please Provide Transfer Date"}]
                    })(<DatePicker size='large' className='w-100' format="YYYY-MM-DD" disabledDate={disabledStartDate}
                                   onChange={v => setOrder_Date(v)} placeholder="Provide Order Date"/>)}
                </FormItem>
                <FormItem label="Designation Appointment Date">{
                    getFieldDecorator('emp_des_appointment_date', {
                        rules: [{required: true, message: "Please Provide Designation date"}]
                    })(
                        <DatePicker size='large' className='w-100' format="YYYY-MM-DD" disabledDate={disabledEndDate}
                                    onChange={v => setAppointment_Date(v)} placeholder="Provide Joining Date"/>
                    )}
                </FormItem>
                <FormItem label="Department Name">{
                    getFieldDecorator('department_name', {
                        rules: [{required: true, message: "Provide `Department Name"}]
                    })(
                        <Select size='large' onChange={onDepartValueSelected}>
                            {departs}
                        </Select>
                    )}
                </FormItem>
                <FormItem label="Designation Title">{
                    getFieldDecorator('des_title', {
                        rules: [{required: true, message: "Provide Designation Title"}]
                    })(
                        <Select size='large' ref={designation}>
                            {designationsItems}
                        </Select>
                    )}
                </FormItem>
                <FormItem label="Order Copy">{
                    getFieldDecorator('emp_des_order_letter_photo', {
                        rules: [{required: true, message: "Provide Order Copy"}]
                    })(
                        <Upload listType="picture-card"
                                className="avatar-uploader"  {...DraggerProps} onChange={handleChange}>
                            {image ?
                                <img src={image} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                        </Upload>
                    )}
                </FormItem>
                <Divider/>
                <div className='flex-justify-content'>
                    <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                            disabled={loading}
                            style={{backgroundColor: '#0a8080', color: 'white'}}>Submit</Button>
                    {handleOk && <Button onClick={handleOk} size={"large"}>Cancel</Button>}
                </div>
            </Form>
        </div>
    );
}


export default Form.create()(AddDesignationDetails);
