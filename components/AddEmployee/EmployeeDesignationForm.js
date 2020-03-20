import React, {Component} from "react";
import ProgressStepper from "./ProgressStepper";
import {Button, Col, Container, Form, FormGroup, FormText, Input, Label} from "reactstrap";
import {Avatar, message} from "antd";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import Router from "next/router";

//TODO: not used
export default class EmployeeDesignationForm extends Component {
    id = this.props.employee_id;

    constructor(props) {
        super(props);
        this.state = {
            certFile: null,
            departs: [],
            designationsItems: [],
            selectedDepartemnt: null,
            image: null
        };

    }
    componentDidMount() {
        this.getDepartmentList();
    }
    getDepartmentList = () => {
        let items = [];
        fetch(baseUrl + '/api/department_list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data);

                for (let i = 1; i <= data.length; i++) {
                    const department = data[i - 1];
                    items.push(
                        <option value={department.department_id}>{department.department_name}</option>)
                }

                this.setState({
                    departs: items
                });
            })


    };
    getDesignationsList = (id) => {
        let items = [];
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

    onDepartmentMenuChange = (e) => {
        this.setState({
            selectedDepartemnt: e.target.value,
        });

        this.getDesignationsList(e.target.value);
        console.log(" Lo G : " + e.target.value);

    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.postData();
    };
    postData = () => {

        if (!(this.id && this.menu.value && this.Des_menu.value && this.des_order_date.value
            && this.des_appointment_date.value
            && this.state.image)) {
            message.error('Please provide all the Fields', 5);
        } else {
            const fd = new FormData();
            fd.append('employee_id', this.id);
            fd.append('des_id', this.Des_menu.value);
            fd.append('designation_order_date', this.des_order_date.value);
            fd.append('des_appointment_date', this.des_appointment_date.value);
            fd.append('image', this.state.image, this.state.image.name);


            axios.post(baseUrl + '/api/create_employee_designation', fd)
                .then(d => {
                    const data = d.data;
                    console.log(data);
                    this.setState({
                        loading: false,
                    });
                    if (data.err) {
                        message.error(data.err, 5);
                    } else if (data.status === 200) {
                        message.success('Successfully Added Employee Designation', 5);
                        Router.push(`/employee_designationHome/${this.id}`);
                    }

                })
        }
    };
    onImageDataChange = (e) => {
        let files = e.target.files;
        this.setState({
            image: files[0],
        });

        if (e.target.files && e.target.files[0]) {
            this.setState({
                fimage: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    render() {
        return (
            <>
                <Container>
                    {this.showDesignationForm()}
                </Container>
            </>
        );
    }

    showDesignationForm = () => {
        return (
            <>
                <ProgressStepper curr={2}/>
                <Container className='p-5'>
                    <Form>
                        <FormGroup row>
                            <Label for="designation_scale" sm={2}>Select Department</Label>
                            <Col sm={10}>
                                <select id="designation_scale"
                                        onChange={this.onDepartmentMenuChange}
                                        ref={(input) => this.menu = input}>
                                    <option value="N/A">Select Department</option>
                                    {this.state.departs}
                                </select>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="designation_scale" sm={2}>Select Designation</Label>
                            <Col sm={10}>
                                <select id="designation_scale"
                                        ref={(input) => this.Des_menu = input}>
                                    <option value="N/A">Select Department</option>
                                    {this.state.designationsItems}
                                </select>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="des_order_date" sm={2}>Designation Order Date</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.des_order_date = node}
                                       type="date" name="des_order_date" id="des_order_date"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="des_appointment_date" sm={2}>Designation Appointment Date</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.des_appointment_date = node}
                                       type="date" name="des_appointment_date"
                                       id="des_appointment_date"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="des_copy" sm={2}>Upload Order Copy Image</Label>
                            <Col sm={8}>


                                <Input type="file" name="des_copy" id="des_copy"
                                       innerRef={node => this.des_copy = node}
                                       onChange={this.onImageDataChange}/>
                                <FormText color="muted">Please Provide Designation Image</FormText>
                            </Col>
                            <Col sm={2}>
                                <Avatar shape="square" size={124} icon="user" src={this.state.fimage}/>
                            </Col>
                        </FormGroup>

                        <FormGroup check row>
                            <Col sm={{size: 18, offset: 2}}>
                                <Button onClick={this.handleSubmit}>Submit</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Container>
            </>
        )
    };

}
