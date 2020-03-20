import React, {Component} from "react";
import {Button, Checkbox, Divider, Form, Icon, Input, message} from "antd";
import Link from "next/link";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import {handleLogin} from "../../utils/auth";
import catchErrors from "../../utils/catchErrors";

const FormItem = Form.Item;

function SignIn({form: {getFieldDecorator, validateFields}}) {
    const [loading, setLoading] = React.useState(false);

    const handleSubmit =  (e) => {
        e.preventDefault();
        validateFields( async (err, values) => {
            if(!err) {
                try {
                    setLoading(true);
                    const url = `${baseUrl}/api/login`;
                    const payload = values;
                    const response = await axios.post(url, payload);
                    handleLogin(response.data);
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    setLoading(false);
                }
            }
        });

    };
    return (
        <div className="gx-login-container">
            <div className="gx-login-content">
                <div className="gx-login-header gx-text-center">
                    <h1 className="gx-login-title">Sign In</h1>
                </div>
                <Form onSubmit={handleSubmit} className="gx-login-form gx-form-row0">
                    <FormItem>
                        {getFieldDecorator('email', {
                            rules: [{required: true, message: 'Please input your email!'}],
                        })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   placeholder="Email"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: 'Please input your Password!'}],
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
        </div>
    );
}

const WrappedNormalLoginForm = Form.create()(SignIn);

export default WrappedNormalLoginForm;

