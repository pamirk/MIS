import {Button, Form, Input, message, Select} from 'antd';
import * as React from 'react';
import {Component} from "react";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
const FormItem = Form.Item;
const {Option} = Select;
const { TextArea } = Input;


type MyProps = { hideHandler: any , id: any, data: any, form: any };
type MyState = { divisions: any, loading: Boolean, fimage: string, image: any, departs: any, designationsItems: any, selectedDepartemnt: any };

class TrainingComponent extends Component<MyProps, MyState> {
    view: HTMLDivElement | undefined = undefined;
    private menu: any;

    constructor(props: any) {
        super(props);
        this.menu = null;
        this.state = {
            loading: true,
            fimage: '',
            image: null,
            divisions: null,
            designationsItems: null,
            selectedDepartemnt: null,
            departs: null


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

    handlerSubmit = (event: React.MouseEvent) => {
        event.preventDefault();
        const {form} = this.props;

        form.validateFields((err: any, fieldsValue: any) => {
            if (err) {
                message.error("Invalid inputs");
                return
            } else {

                this.getDataOutofForm()
            }
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
        axios.post(baseUrl + '/api/add_emoployee_training', fd)
            .then(d => {
                if (d.status == 200) {
                    message.success("Updated Successfully", 5);
                    message.success("Updated Successfully", 5);
                    this.props.hideHandler()
                } else if(d.status == 500) {
                    message.error("Error", 5);
                    message.error("Error", 5);

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
                <Form layout={"vertical"} {...this.formItemLayout} >
                    <FormItem label="Name">{
                        getFieldDecorator('train_name', {
                            rules: [{required: true, min: 5 , message: "Name not valid (min 5)"}]
                        })(<Input/>)}
                    </FormItem>
                    <FormItem label="Descrition">{
                        getFieldDecorator('train_description', {
                            rules: [{required: true, min: 10, message: "Descrition not valid (min 10)"}]
                        })(<TextArea rows={4} />)}
                    </FormItem>

                    <FormItem label="Start Date">{
                        getFieldDecorator('train_start_date', {
                            rules: [{required: true, message: "Please Provide Start Date of Training"}]
                        })(<input type="date"  name="train_start_date "
                                  id="train_start_date"
                                  placeholder="Training Start Date"/>)}
                    </FormItem>

                    <FormItem label="End Date">{
                        getFieldDecorator('train_end_date', {
                            rules: [{required: true, message: "Please Provide End Date of Designation"}]
                        })(<input type="date"  name="train_end_date "
                                  id="train_end_date"
                                  placeholder="Training End Date"/>)}
                    </FormItem>

                    <FormItem label="Location Name">{
                        getFieldDecorator('train_location_name', {
                            rules: [{required: true, min: 3, message: "Location Name not valid (min 3)"}]
                        })(<Input/>)}
                    </FormItem>


                    <Button type="primary" onClick={this.handlerSubmit}>Submit</Button>
                </Form>
            </div>

        );
    }
}


export default Form.create<any>()(TrainingComponent);
