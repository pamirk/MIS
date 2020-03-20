import {Button, DatePicker, Form, Input, message, Select} from 'antd';
import * as React from 'react';
import {Component} from "react";
import axios from "axios";
const { TextArea } = Input;
import baseUrl from "../../../utils/baseUrl";

const FormItem = Form.Item;
const {Option} = Select;

type MyProps = { hideHandler: any, id: any, data: any, form: any };
type MyState = { transfer_Date:any,joining_Date:any, divisions: any, loading: Boolean, fimage: string, image: any, departs: any, sub_Div_Items: any, tubwell_Items: any };

class TransferComponent extends Component<MyProps, MyState> {
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
            sub_Div_Items: null,
            tubwell_Items: null,
            departs: null,
            transfer_Date: null,
            joining_Date: null

        };
    }

    componentDidMount() {
        this.setBaseInfo();
        this.getDivisionList();

    }

    getDivisionList = () => {
        let items: any[] = [];
        fetch(baseUrl + '/api/division_list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log("getDepartmentList is here: ", data);

                for (let i = 1; i <= data.length; i++) {
                    const division = data[i - 1];
                    console.log(division.div_id, "department.department_id: ", division.div_title);

                    items.push(
                        <Option value={division.div_id}>{division.div_title}</Option>)
                }


                this.setState({
                    divisions: items
                });
            })


    };
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
    onDivisionValueSelected = (e: any) => {
        //const div = this.props.form.getFieldValue('Division')
        console.log(" Lo G : ", e);
        this.getSubDivisionsList(e);
    };
    onSubDivisionValueSelected = (e: any) => {
        console.log(" onSubDivisionValueSelected  : ", e);
        this.getTubwellsList(e);

    };

    getTubwellsList = (e:any) => {
        let items: any[] = [];
        fetch(baseUrl + `/api/tubwells_list/${e}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data);

                for (let i = 1; i <= data.length; i++) {
                    const sub_div = data[i - 1];
                    items.push(
                        <Option value={sub_div.tubewell_id}>{sub_div.tubewell_name}</Option>)
                }

                this.setState({
                    tubwell_Items: items
                });
            })

    };
    getSubDivisionsList = (e:any) => {
        let items: any[] = [];
        fetch(baseUrl + `/api/sub_division_list/${e}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data);

                for (let i = 1; i <= data.length; i++) {
                    const sub_div = data[i - 1];
                    items.push(
                        <Option value={sub_div.sd_id}>{sub_div.sub_div_name}</Option>)
                }

                this.setState({
                    sub_Div_Items: items
                });
            })

    };
    disabledStartDate = (startValue:any) => {
        const { joining_Date } = this.state;
        if (!startValue || !joining_Date) {
            return false;
        }
        return startValue.valueOf() > joining_Date.valueOf();
    };

    disabledEndDate = (endValue:any) => {
        const { transfer_Date } = this.state;
        if (!endValue || !transfer_Date) {
            return false;
        }
        return endValue.valueOf() <= transfer_Date.valueOf();
    };

    transfer_Date_Change = (value:any) => {
        // const date = this.props.form.getFieldValue('transfer_Date')
        this.onChange('transfer_Date', value);

    };
    joining_Date_Change = (value:any) => {
        // const date = this.props.form.getFieldValue('joining_Date')
        this.onChange('joining_Date', value);

    };
    onChange = (field:any, value:any) => {
        // @ts-ignore
        this.setState({
            [field]: value,
        });
    };


    getDataOutofForm = () => {
        const {form} = this.props;
        console.log(form.getFieldsValue());

        const fd = new FormData();
        fd.append("employee_id", this.props.id);
        fd.append('image', this.state.image, this.state.image.name);

        Object.keys(form.getFieldsValue()).forEach((value, key, data) => {

            console.log(value, form.getFieldValue(value));
            fd.append(value, form.getFieldValue(value));
        });
        axios.post(baseUrl + '/api/transfer_emoployee', fd)
            .then(d => {
                if (d.status == 200) {
                    message.success("Updated Successfully", 5);
                    message.success("Updated Successfully", 5);
                    this.props.hideHandler()
                }
            })

    };

    onImageDataChange = (e:any) => {
        let files = e.target.files;
        this.setState({
            image: files[0],
        });
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


                    <FormItem label="Division">{
                        getFieldDecorator('Division', {
                            rules: [{required: true, message: "Division not selected"}]
                        })(
                            <Select onChange={this.onDivisionValueSelected}>
                                {this.state.divisions}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem label="Sub Division">{
                        getFieldDecorator('Sub_Division', {
                            rules: [{required: true, message: "SubDivision not selected"}]
                        })(
                            <Select onChange={this.onSubDivisionValueSelected}>
                                {this.state.sub_Div_Items}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem label="Tubewell Name">{
                        getFieldDecorator('tubewell_id', {
                            rules: [{required: true, message: "Tubewell not selected"}]
                        })(
                            <Select >
                                {this.state.tubwell_Items}
                            </Select>
                        )}
                    </FormItem>



                    <FormItem label="transfer Date">{
                        getFieldDecorator('transfer_Date', {
                            rules: [{required: true, message: "Please Provide Transfer Date"}]
                        })(<DatePicker format="YYYY-MM-DD"
                                       disabledDate={this.disabledStartDate}
                                       onChange={this.transfer_Date_Change} placeholder="Provide Transfer Date"/>)}
                    </FormItem>
                    <FormItem label="joining Date">{
                        getFieldDecorator('joining_Date', {
                            rules: [{required: true, message: "Please Provide Joining Date"}]
                        })(
                            <DatePicker format="YYYY-MM-DD" disabledDate={this.disabledEndDate}
                                        onChange={this.joining_Date_Change} placeholder="Provide Joining Date"/>
                        )}
                    </FormItem>

                    <FormItem label="Descrition">{
                        getFieldDecorator('description', {
                            rules: [{required: true, min: 10, message: "Descrition not valid (min 10)"}]
                        })(<TextArea rows={4}/>)}
                    </FormItem>
                    <FormItem label="Order Letter">{
                        getFieldDecorator('order_letter_photo', {
                            rules: [{required: true,  message: "please provide order letter photo"}]
                        })(<Input onChange={this.onImageDataChange} type='file' placeholder='order_letter_photo'/>)}
                    </FormItem>

                    <Button type="primary" onClick={this.handlerSubmit}>Submit</Button>
                </Form>
            </div>

        );
    }
}


export default Form.create<any>()(TransferComponent);
