import React, {Component} from 'react';
import axios from "axios";
import {Button, Col, Container, Form, FormGroup, FormText, Input, Label, Spinner} from 'reactstrap';
import {Avatar, message} from "antd";
import ProgressStepper from "./ProgressStepper";
import baseUrl from "../../utils/baseUrl";
import Router from "next/router";

class CreateEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: null,
            loading: false,
            activeTab: "1",
            gender: "male",
            certFile: null,
            departs: [],
            designationsItems: [],
            selectedDepartemnt: null,
            image: null
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        //this.postData();
        this.postFormData();
    };

    showErrorMessage = (mess, duration) => {
        message.error(mess, duration);
        message.error(mess, duration);
    };
    postFormData = () => {
        if (!(this.cnic.value && this.cnic.value && this.fullname.value && this.fathername.value &&
            this.appointment_date.value && this.birth_date.value && this.state.gender && this.email.value && this.local.value && this.state.image)) {
            this.showErrorMessage('Please provide all the Fields', 5);
        } else {
            const fd = new FormData();
            fd.append('cnic', this.cnic.value);
            fd.append('fullname', this.fullname.value);
            fd.append('fathername', this.fathername.value);
            fd.append('appointment_date', this.appointment_date.value);
            fd.append('birth_date', this.birth_date.value);
            fd.append('gender', this.state.gender);
            fd.append('email', this.email.value);
            fd.append('local', this.local.value);
            fd.append('image', this.state.image, this.state.image.name);


            axios.post(baseUrl + '/api/employee_create', fd)
                .then(d => {
                    const data = d.data;
                    console.log(data);
                    this.setState({
                        loading: false,
                    });
                    if (data.err) {
                        message.error(data.err, 5);
                    } else if (data.status === 200) {
                        message.success('Successfully Register Employee', 5);
                        //this.props.history.push(`/employeeHome/${data.employee_id}`);
                        Router.push(`/employeeHome/${data.employee_id}`)
                    }

                })
        }
    };

    onGenderDataChange = (e) => {
        this.setState({
            gender: e.target.value,
        });
        console.log(this.state.gender);

    };
    certFileSelected = (e) => {
        this.setState({
            certFile: e.target.files[0],
        });
        console.log(this.state.certFile);
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
                    {(this.state.loading)
                        ? <Spinner style={{width: '6rem', height: '6rem'}}/>
                        : this.showRegistrationForm()}
                </Container>
            </>
        );
    }

    showRegistrationForm = () => {
        return (
            <>
                <ProgressStepper curr={0}/>
                <Container className='p-5'>
                    <Form>
                        <FormGroup row>
                            <Label for="cnic" sm={2}>CNIC</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.cnic = node}
                                       type="number" name="cnic"
                                       id="cnic" placeholder="54400-0987789-1"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="cnic" sm={2}>Form Number</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.cnic = node}
                                       type="number" name="cnic"
                                       id="cnic" placeholder="Enter Employee Form number here"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="fullname" sm={2}>Full Name</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.fullname = node}
                                       type="text" name="fullname" id="fullname"
                                       placeholder="Enter your Name here..."/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="fathername" sm={2}>Father Name</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.fathername = node}
                                       type="text" name="fathername" id="fathername"
                                       placeholder="Enter your Father Name here..."/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="appointment_date" sm={2}>Date of Appointment</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.appointment_date = node}
                                       type="date" name="appointment_date "
                                       id="appointment_date"
                                       placeholder="Provide your Date of Appointment"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="birth_date" sm={2}>Date of Birth</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.birth_date = node}
                                       type="date" name="birth_date " id="birth_date"
                                       placeholder="Provide your Date of Birth"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="email" sm={2}>Email</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.email = node}
                                       type="email" name="email" id="email"
                                       placeholder="Enter your Email here"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="local" sm={2}>Local</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.local = node}
                                       type="text" name="local" id="local"
                                       placeholder="Enter your Local here"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="gender" sm={2}>Select Gender</Label>
                            <Col sm={10}>
                                <div onChange={this.onGenderDataChange}>
                                    <input type="radio" value="male"
                                           name="gender"/> Male &nbsp; &nbsp;
                                    <input type="radio" value="female" name="gender"/> Female
                                </div>
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label for="employee_photo" sm={2}>Upload Photo</Label>
                            <Col sm={8}>
                                <Input type="file" name="employee_photo" id="employee_photo"
                                       innerRef={node => this.employee_photo = node}
                                       onChange={this.onImageDataChange}/>
                                <FormText color="muted">Please Provide Employee Resent Passport size Photo</FormText>
                            </Col>
                            <Col sm={2}>
                                <Avatar shape="square" size={124} icon="user" src={this.state.fimage}/>
                            </Col>
                        </FormGroup>

                        <FormGroup check row>
                            <Col sm={{size: 18, offset: 2}}>
                                <Button onClick={this.handleSubmit}>Register</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Container>
            </>
        )
    };
}

export default CreateEmployee;
