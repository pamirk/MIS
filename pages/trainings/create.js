import React, {useState} from 'react';
import {Button, Card, Col, DatePicker, Divider, Form, Input, message, Modal, Row, Select} from "antd";
import LeavesList from "../../components/Leave/LeavesList";
import {parseCookies} from "nookies";
import {redirectUser} from "../../utils/auth";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import Index from "../../components/Training";
import {LEAVE_STATUS} from "../../server/utils/status";
import catchErrors from "../../utils/catchErrors";
import Router from "next/router";

const {Option} = Select;
const {TextArea} = Input;
const FormItem = Form.Item

function index({form: {getFieldDecorator, validateFields}}) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                try {
                    setLoading(true);
                    const url = `${baseUrl}/api/create_training`;
                    const payload = {...values};
                    const response = await axios.post(url, payload);
                    const {status, rows} = response.data;
                    if (status === 200) {
                        message.success('Training Created Successfully');
                        await Router.push("/trainings")
                    }
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    setLoading(false);
                }

            }
        });
    };

    return (
        <Card bordered={false} style={{minHeight: '100vh'}}
              title={<span className='text-large font-weight-bolder'>Schedule a Training</span>}>
            <div className=''>
                <span className='text-large'>Fill out the form below carefully.</span>
            </div>


            <div className='p-5 justify-content-center w-75'>
                <strong className="text-large font-weight-bold flex-justify-content mb-3">Training Details</strong>
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <dt className="col-xl-3 p-4  font-weight-bold">Title:</dt>
                        <dd className="col-xl-9 p-4">
                            <FormItem>
                                {getFieldDecorator('title', {
                                    rules: [{required: true, message: 'Title is required'}],
                                })(<Input size='large' className='w-100' placeholder='Training Title'/>)}
                            </FormItem>
                        </dd>

                        <dt className="col-xl-3 p-4 font-weight-bold">Description:</dt>
                        <dd className="col-xl-9 p-4 ">
                            <FormItem>{getFieldDecorator('description', {
                                rules: [{required: true, message: 'Description is required!'}]
                            })(<TextArea rows={8} placeholder='Description here'/>)}
                            </FormItem>
                        </dd>

                        <dt className="col-xl-3 p-4  font-weight-bold">Offered By:</dt>
                        <dd className="col-xl-9 p-4">
                            <FormItem>{getFieldDecorator('offered_by', {
                                rules: [{
                                    required: true,
                                    message: 'This is required'
                                }],
                            })
                            (<Input size='large' className='w-100' placeholder='Training Offered By'/>)}
                            </FormItem>
                        </dd>

                        <dt className="col-xl-3 p-4  font-weight-bold">Funded By:</dt>
                        <dd className="col-xl-9 p-4">
                            <FormItem>
                                {getFieldDecorator('funded_by', {
                                    rules: [{required: true, message: 'This is required'}],
                                })(<Input size='large' className='w-100' placeholder='Training Funded By'/>)}
                            </FormItem>
                        </dd>

                        <dt className="col-xl-3 p-4  font-weight-bold">Category:</dt>
                        <dd className="col-xl-9 p-4">
                            <FormItem>
                                {getFieldDecorator('category', {
                                    rules: [{required: true, message: 'This is required'}],
                                })(<Input size='large' className='w-100' placeholder='Training Category'/>)}
                            </FormItem>
                        </dd>

                        <dt className="col-xl-3 p-4  font-weight-bold">Start Date :</dt>
                        <dd className="col-xl-9 p-4">
                            <FormItem>
                                {getFieldDecorator('start_day', {
                                    rules: [{required: true, message: 'Start Date is required'}],
                                })(<DatePicker size='large' className='w-50' placeholder=''/>)}
                            </FormItem>
                        </dd>
                        <dt className="col-xl-3 p-4  font-weight-bold">Start Date :</dt>
                        <dd className="col-xl-9 p-4">
                            <FormItem>
                                {getFieldDecorator('end_day', {
                                    rules: [{required: true, message: 'Start Date is required'}],
                                })(<DatePicker size='large' className='w-50' placeholder=''/>)}
                            </FormItem>
                        </dd>

                        <dt className="col-xl-3 p-4 font-weight-bold">Address:</dt>
                        <dd className="col-xl-9 p-4 ">
                            <FormItem>{getFieldDecorator('address', {
                                rules: [{required: true, message: 'Address is required!'}]
                            })(<TextArea rows={8} placeholder='Address here'/>)}
                            </FormItem>
                        </dd>

                    </div>
                    <Divider/>
                    <div className='flex-justify-content'>
                        <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                                disabled={loading}
                                style={{backgroundColor: '#0a8080', color: 'white'}}>Schedule</Button>
                        <Button size={"large"} onClick={()=> Router.push("/trainings")} disabled={loading}>Cancel and Go Back to Main Training Page</Button>
                    </div>
                </Form>
            </div>
        </Card>
    );
}

export default Form.create()(index);

