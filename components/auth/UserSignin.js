import React, {Component} from "react";
import {Button, Checkbox, Divider, Form, Icon, Input, message} from "antd";
import Link from "next/link";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import {handleUserLogin} from "../../utils/auth";
import catchErrors from "../../utils/catchErrors";

const FormItem = Form.Item;

function UserSignin({form: {getFieldDecorator, validateFields}}) {
    const [loading, setLoading] = React.useState(false);

    const handleSubmit =  (e) => {
        e.preventDefault();
        validateFields( async (err, values) => {
            if(!err) {
                try {
                    setLoading(true);
                    const url = `${baseUrl}/api/user_login`;
                    const payload = values;
                    const response = await axios.post(url, payload);
                    handleUserLogin(response.data);
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    setLoading(false);
                }
            }
        });

    };
    return (
        <div >
            <Form onSubmit={handleSubmit} className="gx-login-form gx-form-row0">
                <FormItem>
                    {getFieldDecorator('account_number', {
                        rules: [{required: true, message: 'Account Number is required!'}],
                    })(
                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="Account Number"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: 'Password is required!'}],
                    })(
                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               type="password" placeholder="Password"/>
                    )}
                </FormItem>
                <FormItem className="gx-text-center">
                    <Button loading={loading} disabled={loading} type="primary" htmlType="submit">Log in</Button>
                    <Divider>OR</Divider>
                    <Icon name="help"/>
                    New user?{" "}<Link href="/signup"><a>Sign up here</a></Link>{" "}instead.
                </FormItem>
            </Form>
        </div>
    );
}

const WrappedNormalLoginForm = Form.create()(UserSignin);

export default WrappedNormalLoginForm;

