import React, {useEffect, useState} from "react";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import {Button, Divider, Form, Input, message, Select} from "antd";
import catchErrors from "../../utils/catchErrors";
import {formItemLayout} from "../Common/UI";

const CreateSubDivision = ({form, handleCancel, handleSuccess}) => {
    const [loading, setLoading] = useState(false);
    const [divisions, setDivisions] = useState(null);

    useEffect(() => {
        getDivisions()
    } , []);
    const onSubmit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    setLoading(true);
                    const url = `${baseUrl}/api/create_sub_division`;
                    const payload = {...values};
                    const response = await axios.post(url, payload);
                    if (response.data.status === 200) {
                        message.success("Sub Division Created", 3);
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
    const getDivisions = async () => {
        let items = [];
        const url = `${baseUrl}/api/division_list`;
        const {data} = await axios.get(url);
        data.map(d => items.push(<Select.Option key={d.div_id} value={d.div_id}>{d.div_title}</Select.Option>));
        setDivisions(items);
    };
    return (
        <Form layout='vertical' onSubmit={onSubmit} {...formItemLayout} >
            <Form.Item label="Sub Division Name">{form.getFieldDecorator('sub_div_name', {
                rules: [{required: true, message: "Name is required"}]
            })
            (<Input size='large' type='text' className='w-100' />)}</Form.Item>
            <Form.Item label="Sub Division Description">{form.getFieldDecorator('description', {
                rules: [{required: true, message: "Description is required"}]
            })
            (<Input size='large' type='text' className='w-100' />)}</Form.Item>
            <Form.Item label="Select Division">{
                form.getFieldDecorator('div_id', {rules: [{required: true, message: "Division Name is required"}]
                })(<Select placeholder='Select Department'>{divisions}</Select>)}</Form.Item>
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
export default Form.create()(CreateSubDivision);