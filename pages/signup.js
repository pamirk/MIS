import React, {Component} from "react";
import {Button, Checkbox, Form, Icon, Input} from "antd";
import Link from "next/link";

const FormItem = Form.Item;

class SignUP extends Component {


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log("values", values)
        });
    };

    render() {

        const {getFieldDecorator} = this.props.form;

        return (
            <div className="gx-login-container">
                <div className="gx-login-content">
                    <div className="gx-login-header gx-text-center">
                        <h1 className="gx-login-title">Sign Up</h1>
                    </div>
                    <Form onSubmit={this.handleSubmit} className="gx-login-form gx-form-row0">
                        <FormItem>
                            {getFieldDecorator('uaername', {
                                rules: [{required: true, message: 'Please input your username!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="Username"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('email', {
                                rules: [{required: true, message: 'Please input your username!'}],
                            })(
                                <Input prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="Email address"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: 'Please input your Password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                       placeholder="Password"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('confirm-password', {
                                rules: [{required: true, message: 'Please input your Password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                       placeholder="Confirm Password"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>Remember me</Checkbox>
                            )}
                            <Link className="gx-login-form-forgot" to="/custom-views/user-auth/forgot-password">Forgot password</Link>
                        </FormItem>
                        <FormItem className="gx-text-center">
                            <Button type="primary" htmlType="submit">
                                Sign Up
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const WrappedNormalSignUpForm = Form.create()(SignUP);

export default WrappedNormalSignUpForm;
