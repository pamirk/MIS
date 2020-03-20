import React, {Component} from "react";
import ProgressStepper from "./ProgressStepper";
import {Button, Col, Container, Form, FormGroup, Input, Label} from "reactstrap";
import {message} from "antd";
import baseUrl from "../../utils/baseUrl";
import Router from "next/router";


function EmployeeAddressForm({form, id}) {


    const handleSubmit = (e) => {
        e.preventDefault();
        this.postData();
    };
    const postData = () => {

        if (!(this.id && this.current_address.value && this.current_address.value && this.postal_code.value && this.phone_number.value
            && this.phone_number2.value && this.city.value && this.country.value)) {
            message.error('Please provide all the Fields', 5);
        } else {
            fetch(baseUrl + '/api/employee_create_address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    employee_id: parseInt(this.id),
                    current_address: this.current_address.value,
                    permanent_address: this.permanent_address.value,
                    postal_code: this.postal_code.value,
                    phone_number: this.phone_number.value,
                    phone_number2: this.phone_number2.value,
                    city: this.city.value,
                    country: this.country.value,

                })
            })
                .then(data => data.json())
                .then(data => {
                    console.log("there pamir khan : \n");
                    console.log(data);
                    if (data.status === 500) {
                        message.error('Server Error ', 5);
                    } else if (data.status === 200) {
                        message.success('Successfully Added', 5);
                        Router.push(`/employeeAddressHome/${this.id}`);

                    }
                })

        }
    };
    const showAddressForm = () => {
        return (
            <>
                <ProgressStepper curr={1}/>
                <Container className='p-5'>
                    <Form>
                        <FormGroup row>
                            <Label for="current_address" sm={2}>Current Address</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.current_address = node}
                                       type="address" name="current_address"
                                       id="current_address"
                                       placeholder="Enter your Current Address here..."/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="permanent_address" sm={2}>Permanent Address</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.permanent_address = node}
                                       type="address" name="permanent_address"
                                       id="permanent_address"
                                       placeholder="Enter your Permanent Address here..."/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="postal_code" sm={2}>Postal Code</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.postal_code = node}
                                       type="number" name="postal_code" id="postal_code"
                                       placeholder="Enter your Postal Code here..."/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="phone_number" sm={2}>Phone Number 1</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.phone_number = node}
                                       type="number" name="phone_number "
                                       id="phone_number"
                                       placeholder="03337906856"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="phone_number2" sm={2}>Phone Number 2</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.phone_number2 = node}
                                       type="number" name="phone_number2 "
                                       id="phone_number2"
                                       placeholder="03337906856"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="city" sm={2}>City</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.city = node}
                                       type="text" name="city" id="city"
                                       placeholder="Enter your City here"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="country" sm={2}>Country</Label>
                            <Col sm={10}>
                                <Input innerRef={node => this.country = node}
                                       type="text" name="country" id="country"
                                       placeholder="Enter your Country here"/>
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
    return (
        <>
            <Container>
                {this.showAddressForm()}
            </Container>
        </>
    );


}
