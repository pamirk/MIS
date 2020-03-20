import * as React from 'react';
import {Component} from 'react';
import baseUrl from "../../../utils/baseUrl";

import {Button, Form, Input, message, Select} from 'antd';
import axios from "axios";

const FormItem = Form.Item;

type MyProps = { Indexkey: any, hideHandler: any, id: any, data: any, form: any };
type MyState = { divisions: any, loading: Boolean, fimage: string, image: any, departs: any, designationsItems: any, selectedDepartemnt: any };

class PromoteDesignation extends Component<MyProps, MyState> {
    view: HTMLDivElement | undefined = undefined;
    private menu: any;
    private Des_menu: any;

    constructor(props: any) {
        super(props);
        this.menu = null;
        this.Des_menu = null;
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
        if (this.props.Indexkey) {
            // Object.keys(this.props.Indexkey);
            console.log("keys    ", this.props.Indexkey);

            this.setBaseInfo();

        } else {
            console.log("Nothing :(")
        }
        this.getDepartmentList();

    }

    setBaseInfo = () => {
        const {form} = this.props;
        const row = this.props.data.filter((item: any) => item.emp_des_id === this.props.Indexkey)

        const data = row[0];
        console.log("data: -> ", data);

        /*department_city_name: "Quetta"
        department_description: "Budgeting, recording of all expenses. Payroll & pensions."
        department_name: "Accounts"
        des_scale: "BPS_17"
        des_id: 44
        des_title: "Computer Programmer"
        emp_des_appointment_date: "2020-12-25T19:00:00.000Z"
        emp_des_id: 42
        emp_des_is_active: 1
        emp_des_order_date: "2020-12-31T19:00:00.000Z"
        emp_des_order_letter_photo: null

        department_name: "Accounts"
        des_photo: null
        des_title: "Computer Programmer"
        emp_des_appointment_date: "2020-12-25T19:00:00.000Z"
        emp_des_order_date: "2020-12-31T19:00:00.000Z"

    */
        const mydata = {
            emp_des_order_date: data.emp_des_order_date.substring(0,10),
            emp_des_appointment_date: data.emp_des_appointment_date.substring(0,10),
            department_name: data.department_name,
            des_title: data.des_title,
            des_photo: data.emp_des_order_letter_photo,
        };
        console.log("mydata ", mydata);

        if (mydata) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                // @ts-ignore
                obj[key] = mydata[key] || null;
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
        fd.append('des_id', this.Des_menu.value);

        Object.keys(form.getFieldsValue()).forEach((value, key, data) => {

            console.log(value, form.getFieldValue(value));
            fd.append(value, form.getFieldValue(value));
        });
        axios.post(baseUrl + '/api/promote_emoployee', fd)
            .then(d => {
                if (d.status == 200) {
                    message.success("Updated Successfully", 5);
                    this.props.hideHandler()
                }
            })

    };

    getDepartmentList = () => {
        let items: any[] = [];
        fetch(baseUrl + '/api/department_list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log("getDepartmentList is here: ", data);

                for (let i = 1; i <= data.length; i++) {
                    const department = data[i - 1];
                    console.log(department.department_name, "department.department_id: ", department.department_name);

                    items.push(
                        <option value={department.department_id}>{department.department_name}</option>)
                }


                this.setState({
                    divisions: items
                });
            })


    };
    getDesignationsList = (id: any) => {
        let items: any[] = [];
        fetch(baseUrl + `/api/designation_list/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data);

                for (let i = 1; i <= data.length; i++) {
                    const designation = data[i - 1];
                    items.push(
                        <option value={designation.des_id}>{designation.des_title}</option>)
                }

                this.setState({
                    designationsItems: items
                });
            })


    };


    onDepartmentMenuChange = (e: any) => {
        this.setState({
            selectedDepartemnt: e.target.value,
        });

        this.getDesignationsList(e.target.value);
        console.log(" Lo G : " + e.target.value);

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
                    <FormItem label="Promotion Order Date">{
                        getFieldDecorator('emp_des_order_date', {
                            rules: [{required: true, message: "Please Provide Your Date of Designation"}]
                        })(<Input type="date" name="designation_date "
                                  id="designation_date"
                                  placeholder="Date of Designation"/>)}
                    </FormItem>

                    <FormItem label="Appointment Date">{
                        getFieldDecorator('emp_des_appointment_date', {
                            rules: [{required: true, message: "Please Provide Designation date"}]
                        })(<Input type="date" name="appointment_date "
                                  id="appointment_date"
                                  placeholder="Date of Appointment"/>)}
                    </FormItem>

                    <FormItem label="Department Name">{
                        getFieldDecorator('department_name', {
                            rules: [{required: true, message: "Please Provide Department Name"}]
                        })(
                            <select id="department_name"
                                    onChange={this.onDepartmentMenuChange}
                                    ref={(input) => this.menu = input}>
                                <option value="N/A">Select Department</option>
                                {this.state.divisions}
                            </select>
                        )}
                    </FormItem>

                    <FormItem label="Designation Title">{
                        getFieldDecorator('des_title', {
                            rules: [{required: true, message: "Please Provide Designation Title"}]
                        })(
                            <select id="designation_scale"
                                    ref={(input) => this.Des_menu = input}>
                                <option value="N/A">Select Department</option>
                                {this.state.designationsItems}
                            </select>
                        )}
                    </FormItem>

                    <FormItem label="Please Provide Designation Image">{
                        getFieldDecorator('des_photo', {
                            rules: [{required: true, message: "Please Provide Designation Image"}]
                        })(
                            <input type="file" name="des_photo" id="des_photo"/>
                        )}
                    </FormItem>
                    <Button type="primary" onClick={this.handlerSubmit}>Submit</Button>
                </Form>
            </div>

        );
    }
}


export default Form.create<any>()(PromoteDesignation);
