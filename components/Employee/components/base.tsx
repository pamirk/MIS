import {Button, Form, Input, message, Select} from 'antd';
import * as React from 'react';
import {Component} from "react";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";

const FormItem = Form.Item;
const {Option} = Select;

type MyProps = { id: any, data: any, form: any };
type MyState = { loading: boolean };

class zxzBaseView extends Component<MyProps, MyState> {
    view: HTMLDivElement | undefined = undefined;

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.setBaseInfo();
    }


    setBaseInfo = () => {
        const {data, form} = this.props;
        if (data) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                // @ts-ignore
                obj[key] = data[key] || null;
                form.setFieldsValue(obj);
            });
        }
    };

    getViewDom = (ref: HTMLDivElement) => {
        this.view = ref;
    };

    handleSubmit = (event: React.MouseEvent) => {
        event.preventDefault();
        const {form} = this.props;
        form.validateFields((err: any) => {
            if (err) {
                message.error("Error", 5);
                return
            }
            this.getDataOutofForm()
        });


    };

    getDataOutofForm = () => {
        const {form} = this.props;
        console.log(form.getFieldsValue());

        const fd = new FormData();
        fd.append("employee_id", this.props.id);

        Object.keys(form.getFieldsValue()).forEach((value, key, data) => {

            console.log(value, form.getFieldValue(value));
            fd.append(value, form.getFieldValue(value));
        });
        axios.post(baseUrl + '/api/one_employee_update', fd)
            .then(d => {
                if (d.status === 200) {
                    message.success("Updated Successfully", 5);
                }
            })

    };
    formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 16},
        },
    };

    tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };

    render() {
        const {form: {getFieldDecorator},} = this.props;
        return (
            <div className='baseView' ref={this.getViewDom}>
                <Form {...this.formItemLayout} >
                    <FormItem label="CNIC">
                        {getFieldDecorator('cnic', {
                            rules: [
                                {
                                    required: true,
                                    message: "Please Provide Your CNIC",
                                }
                            ],
                        })(<Input size='large' type='number' />)}

                    </FormItem>

                    <FormItem label="Full Name">{
                        getFieldDecorator('full_name', {
                            rules: [{required: true, message: "Please Provide Your Name"}]
                        })(<Input/>)}
                    </FormItem>
                    <FormItem label="Father Name">{
                        getFieldDecorator('father_name', {
                            rules: [{required: true, message: "Please Provide Your Father Name"}]
                        })(<Input/>)}
                    </FormItem>
                    <FormItem label="Date of Appointment">{
                        getFieldDecorator('appointment_date', {
                            rules: [{required: true, message: "Please Provide Your Date of Appointment"}]
                        })(<Input type="date" name="appointment_date "
                                  id="appointment_date"
                                  placeholder="Provide your Date of Appointment"/>)}
                    </FormItem>
                    <FormItem label="Date of Birth">{
                        getFieldDecorator('birth_date', {
                            rules: [{required: true, message: "Please Provide Your Date of Birth"}]
                        })(<Input type="date" name="birth_date " id="birth_date"
                                  placeholder="Provide your Date of Birth"/>)}
                    </FormItem>
                    <FormItem label="Email">{
                        getFieldDecorator('email', {
                            rules: [{required: true, message: "Please Provide Your email"}]
                        })(<Input/>)}
                    </FormItem>
                    {/*<FormItem label="Local">{
                        getFieldDecorator('local', {
                            rules: [{required: true, message: "Please Provide Your Father Name"}]
                        })(<Input/>)}

                    </FormItem>*/}
                    <FormItem label="gender">{
                        getFieldDecorator('gender', {
                            rules: [{required: true, message: "Gender not selected"}]
                        })(
                            <Select defaultValue="male">
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                            </Select>
                        )}

                    </FormItem>
                    <Form.Item {...this.tailFormItemLayout}>
                        <Button type="primary" onClick={this.handleSubmit}>Update Information</Button>

                    </Form.Item>

                </Form>
            </div>
        );
    }
}


export default Form.create<any>()(zxzBaseView);
