import React, {useEffect, useState} from "react";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import {Button, Divider, Form, Input, message, Select} from "antd";
import catchErrors from "../../utils/catchErrors";
import {formItemLayout} from "../Common/UI";

const CreateDesignation = ({form, handleCancel, handleSuccess}) => {
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState(null);

    useEffect(() => {
        getDepartmentList()
    } , []);
    const onSubmit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    setLoading(true);
                    const url = `${baseUrl}/api/create_designation`;
                    const payload = {...values};
                    const response = await axios.post(url, payload);
                    if (response.data.status === 200) {
                        message.success("Designation Created", 3);
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
    const getDepartmentList = async () => {
        let items = [];
        const url = `${baseUrl}/api/department_list`;
        const {data} = await axios.get(url);
        data.map(d => items.push(<Select.Option key={d.department_id} value={d.department_id}>{d.department_name}</Select.Option>));
        setDepartments(items);
    };
    return (
        <Form layout='vertical' onSubmit={onSubmit} {...formItemLayout} >
            <Form.Item label="Department Name">{form.getFieldDecorator('des_title', {
                rules: [{required: true, message: "Name is required"}]
            })
            (<Input size='large' type='text' className='w-100' />)}</Form.Item>
            <Form.Item label="Department Description">{form.getFieldDecorator('des_scale', {
                rules: [{required: true, message: "Description is required"}]
            })
            (<Input size='large' type='text' className='w-100' />)}</Form.Item>
            <Form.Item label="Department Name">{
                form.getFieldDecorator('department_id', {rules: [{required: true, message: "Select Department Name"}]
                })(<Select placeholder='Select Department'>{departments}</Select>)}</Form.Item>

            <Divider/>
            <div className='flex-justify-content'>
                <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                        disabled={loading}
                        style={{backgroundColor: '#0a8080', color: 'white'}}>Submit</Button>
                <Button onClick={handleCancel} size={"large"}>Cancel</Button>
            </div>
        </Form>
    )
};
export default Form.create()(CreateDesignation);