import {Button, Form, Input, Select} from 'antd';
import * as React from 'react';
import axios from "axios";
import {message} from "antd";
import {Component} from "react";
import baseUrl from "../../../utils/baseUrl";


const FormItem = Form.Item;

type MyProps = { itemkey:any,hideHandler: any, id: any, data: any, form: any };
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
        fd.append("address_id", this.props.itemkey);
        fd.append("employee_id", this.props.id);
        message.success("Updated Successfully", 5);

        Object.keys(form.getFieldsValue()).forEach((value, key, data) => {

            console.log(value, form.getFieldValue(value));
            fd.append(value, form.getFieldValue(value));
        });
        axios.post(baseUrl + '/api/employee_address_update', fd)
            .then(d => {
                if (d.status === 200) {
                    this.props.hideHandler()
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
                    <FormItem label="current_address">
                        {getFieldDecorator('current_address', {
                            rules: [
                                {
                                    required: true,
                                    message: "Please Provide Your CNIC",
                                }
                            ],
                        })(<Input/>)}

                    </FormItem>

                    <FormItem label="MESSAGEpermanent_address">{
                        getFieldDecorator('permanent_address', {
                            rules: [{required: true, message: "Please Provide Your Name"}]
                        })(<Input/>)}
                    </FormItem>
                    <FormItem label="postal_code">{
                        getFieldDecorator('postal_code', {
                            rules: [{required: true, message: "Please Provide Your Father Name"}]
                        })(<Input/>)}
                    </FormItem>
                    <FormItem label="phone_number">{
                        getFieldDecorator('phone_number', {
                            rules: [{required: true, message: "Please Provide Your Date of Appointment"}]
                        })(<Input type="date" name="appointment_date "
                                  id="appointment_date"
                                  placeholder="Provide your Date of Appointment"/>)}
                    </FormItem>
                    <FormItem label="phone_number2">{
                        getFieldDecorator('phone_number2', {
                            rules: [{required: true, message: "Please Provide Your Date of Birth"}]
                        })(<Input type="date" name="phone_number2 " id="phone_number2"
                                  placeholder="Provide your Date of Birth"/>)}
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
