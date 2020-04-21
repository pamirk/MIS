import React, {useState} from "react";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import {Button, Divider, Form, Input, message} from "antd";
import catchErrors from "../../utils/catchErrors";
import {formItemLayout} from "../Common/UI";

const CreateDivision = ({form, handleCancel, handleSuccess}) => {
    const [loading, setLoading] = useState(false);

    const onSubmit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    setLoading(true);
                    const url = `${baseUrl}/api/create_division`;
                    const payload = {...values};
                    const response = await axios.post(url, payload);
                    if (response.data.status === 200) {
                        message.success("Division Created", 3);
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
    return (
        <Form layout='vertical' onSubmit={onSubmit} {...formItemLayout} >
            <Form.Item label="Division Name">{form.getFieldDecorator('div_title', {
                rules: [{required: true, message: "Title is required"}]
            })
            (<Input size='large' type='text' className='w-100' />)}</Form.Item>
            <Form.Item label="Division Description">{form.getFieldDecorator('div_description', {
                rules: [{required: true, message: "Description is required"}]
            })
            (<Input size='large' type='text' className='w-100' />)}</Form.Item>

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
export default Form.create()(CreateDivision);