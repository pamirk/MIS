import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import Error from "next/error";
import {
    Badge,
    Button,
    Card,
    Checkbox,
    DatePicker,
    Descriptions,
    Divider,
    Form,
    Input,
    List,
    message,
    Modal
} from "antd";
import moment from "moment";
import {cardTitleButton, formItemLayout} from "../../components/Common/UI";
import catchErrors from "../../utils/catchErrors";
import Head from "next/head";
import {Col, Row} from "reactstrap";

const FI = Form.Item;
const D = Descriptions;
const DI = Descriptions.Item;
const {TextArea} = Input;

function tubewell({p_tubewell, tubewell_status, ctx, user, form, form: {getFieldDecorator, validateFields}}) {
    const [tubewell, setTubewell] = useState(p_tubewell);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [changeStatusModalVisible, setChangeStatusModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const {id} = useRouter().query;
    if (!tubewell) {
        return <Error statusCode={404} title={`tubewell with ${id} id does't exists`}/>
    }

    function updateModalCancel() {
        setUpdateModalVisible(false)
    }

    useEffect(() => {
        if (updateModalVisible) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                obj[key] = tubewell[key] || null;
                if (key === 'install_date' || key === 'last_update_ts') {
                    obj[key] = moment(tubewell[key]);
                }
                if (key === 'is_office') {
                    obj[key] = tubewell[key] === 1;
                }
                form.setFieldsValue(obj);
            });
        }
    }, [updateModalVisible]);

    function handleSubmit(e) {
        e.preventDefault();
        validateFields(async (err, values) => {
            if (!err) {
                try {
                    setLoading(true)
                    const payload = {...values, sub_div_id: tubewell.sub_div_id, tubewell_id: tubewell.tubewell_id};


                    const url = `${baseUrl}/api/update_tubewell`;
                    const response = await axios.post(url, payload);
                    if (response.status === 200) {
                        message.success('tubewell Added ', 3);
                        console.log("tubewell1", tubewell);
                        const newTubV = {...tubewell, ...values,install_date: values.install_date._i, is_office: values.is_office ? 1 : 0};
                        console.log("tubewell2",newTubV);
                        console.log("tubewell2",newTubV.install_date);
                        setTubewell(newTubV);

                        setUpdateModalVisible(false)
                    }
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    setLoading(false);
                }
            }
        });
    }

    const handleCancel = () => {
        setChangeStatusModalVisible(false)
    };
    const changeStatusHandleSuccess = () => {
        setChangeStatusModalVisible(false)

    };
    return (
        <Card style={{minHeight: '100vh'}}>
            <Head>
                <link rel="stylesheet" type="text/css" href="/static/users.css"/>
            </Head>
            <Row>
                <Col sm="12" md="6">
                    <Card bordered={false}
                          title={cardTitleButton('Tubewell Details', "Edit", () => setUpdateModalVisible(true))}>
                        <D column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}} bordered size='small'>
                            <DI label="Tubewell Name" span={3}>{tubewell.tubewell_name}</DI>
                            <DI label="Rock Type" span={3}>{tubewell.rock_type}</DI>
                            <DI label="Install Date" span={3}>{tubewell.install_date.substring(0,10)}</DI>
                            <DI label="Elevation" span={3}>{tubewell.elevation}</DI>
                            <DI label="Phone Number" span={3}>{tubewell.phone1}</DI>
                            <DI label="Address" span={3}>{tubewell.address}</DI>
                            <DI label="Lat and Lng" span={3}>{tubewell.lat} {tubewell.lng}</DI>
                            <DI label="Is Office" span={3}>{(tubewell.is_office) ? "YES" : "NO"}</DI>
                        </D>
                    </Card>
                </Col>
                <Col sm="12" md="6">
                    <Card bordered={false}
                          title={cardTitleButton('Status History', "Change Status", () => setChangeStatusModalVisible(true))}>
                        <List  className='demo-infinite-container' itemLayout="horizontal" dataSource={tubewell_status}
                              renderItem={item => (
                                  <List.Item  title='latest'>
                                      <D title={item.is_active ? <Badge status="success" text="latest status"/> : ""}>
                                          <DI label="Status" span={3}>{item.status_title}</DI>
                                          <DI label="Description" span={3}>{item.status_description}</DI>
                                          <DI label="Updated By" span={3}>{item.change_by}</DI>
                                          <DI label="Updated at"
                                              span={3}>{moment(item.status_date_change).format('MMMM Do YYYY, h:mm:ss a')}</DI>
                                      </D>
                                  </List.Item>
                              )}
                        />
                    </Card>
                </Col>
            </Row>

            <Modal destroyOnClose={true} width={780}
                   visible={changeStatusModalVisible}
                   onOk={() => setChangeStatusModalVisible(false)}
                   onCancel={() => setChangeStatusModalVisible(false)}
                   footer={null} closable={false}>
                <ChangeStatus handleSuccess={changeStatusHandleSuccess} tubewell_id={tubewell.tubewell_id}
                              handleCancel={handleCancel}
                              change_by={user.employee.employee_id}/>
            </Modal>

            <Modal destroyOnClose={true} width={780}
                   visible={updateModalVisible}
                   onOk={() => setUpdateModalVisible(false)}
                   onCancel={() => setUpdateModalVisible(false)}
                   footer={null} closable={false}>
                <Card bordered={false}
                      title={<span className='text-large font-weight-bolder'>Update Tubewell Details</span>}>
                    <div className='text-large'>Fill out the form below to Update Tubewell Details</div>
                    <div className='p-5'>
                        <Form onSubmit={handleSubmit}>
                            <div className="row">
                                <dt className="col-xl-3 p-4  font-weight-bold">Tubewell Name:</dt>
                                <dd className="col-xl-9 p-4">
                                    <FI>
                                        {getFieldDecorator('tubewell_name', {
                                            rules: [{required: true, message: 'Name is required'}],
                                        })(<Input size='large' className='w-100' placeholder='Name'/>)}
                                    </FI>
                                </dd>

                                <dt className="col-xl-3 p-4  font-weight-bold">Rock Type:</dt>
                                <dd className="col-xl-9 p-4">
                                    <FI>
                                        {getFieldDecorator('rock_type', {
                                            rules: [{required: true, message: 'Rock Type is required'}],
                                        })(<Input size='large' className='w-100' placeholder='Alluvial'/>)}
                                    </FI>
                                </dd>
                                <dt className="col-xl-3 p-4 font-weight-bold">Install Date</dt>
                                <dd className="col-xl-9 p-4 ">
                                    <FI>
                                        {getFieldDecorator('install_date', {
                                            rules: [{
                                                required: true,
                                                message: 'Please provide Install Date!'
                                            }]
                                        })(
                                            <DatePicker size='large' format='YYYY-MM-DD' className='w-100'
                                                        placeholder='11/02/2019'/>
                                        )}
                                    </FI>
                                </dd>
                                <dt className="col-xl-3 p-4 font-weight-bold">Elevation</dt>
                                <dd className="col-xl-9 p-4 ">
                                    <FI>
                                        {getFieldDecorator('elevation', {
                                            rules: [{
                                                required: true,
                                                message: 'Please provide Install Date!'
                                            }]
                                        })(
                                            <Input size='large' className='w-100' placeholder='5453 ± 3m'/>
                                        )}
                                    </FI>
                                </dd>
                                <dt className="col-xl-3 p-4 font-weight-bold">Phone</dt>
                                <dd className="col-xl-9 p-4 ">
                                    <FI>
                                        {getFieldDecorator('phone1', {
                                            rules: [{
                                                required: true,
                                                message: 'Please provide Install Date!'
                                            }]
                                        })(
                                            <Input size='large' type='number' className='w-100'
                                                   placeholder='0333333333'/>
                                        )}
                                    </FI>
                                </dd>
                                <dt className="col-xl-3 p-4 font-weight-bold">Lat</dt>
                                <dd className="col-xl-9 p-4 ">
                                    <FI>
                                        {getFieldDecorator('lat', {
                                            rules: [{
                                                required: true,
                                                message: 'Please provide lat!'
                                            }]
                                        })(
                                            <Input size='large' type='number' className='w-100' placeholder='lat'/>
                                        )}
                                    </FI>
                                </dd>
                                <dt className="col-xl-3 p-4 font-weight-bold">Lng</dt>
                                <dd className="col-xl-9 p-4 ">
                                    <FI>
                                        {getFieldDecorator('lng', {
                                            rules: [{
                                                required: true,
                                                message: 'Please provide Lng'
                                            }]
                                        })(
                                            <Input size='large' type='number' className='w-100' placeholder='lng'/>
                                        )}
                                    </FI>
                                </dd>
                                <dt className="col-xl-3 p-4 font-weight-bold">Address</dt>
                                <dd className="col-xl-9 p-4 ">
                                    <FI>
                                        {getFieldDecorator('address', {
                                            rules: [{
                                                required: true,
                                                message: 'Please provide Install Date!'
                                            }]
                                        })(
                                            <TextArea rows={8} size='large' type='number' className='w-100'/>
                                        )}
                                    </FI>
                                </dd>
                                <dt className="col-xl-3 p-4 font-weight-bold"/>
                                <dd className="col-xl-9 p-4 ">
                                    <FI>
                                        {getFieldDecorator('is_office', {valuePropName: 'checked'})(
                                            <Checkbox>is Office</Checkbox>
                                        )}
                                    </FI>
                                </dd>
                            </div>
                            <Divider/>
                            <div className='flex-justify-content'>
                                <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                                        disabled={loading}
                                        style={{backgroundColor: '#0a8080', color: 'white'}}>Update</Button>
                                <Button size={"large"} disabled={loading} onClick={updateModalCancel}>Cancel</Button>
                            </div>
                        </Form>
                    </div>
                </Card>
            </Modal>
        </Card>
    );
}

tubewell.getInitialProps = async ({query: {id}, ctx}) => {
    const url = `${baseUrl}/api/tubewell/${id}`;
    const {data: {tubewell, tubewell_status, status}} = await axios.get(url);
    return {status, p_tubewell: tubewell, tubewell_status, ctx};
};
export default Form.create()(tubewell);


function ChangeStatus_({form, handleCancel, handleSuccess, change_by, tubewell_id}) {
    const [changeStatusLoading, setChangeStatusLoading] = useState(false);

    function handleStatusChangeSubmit(e) {
        e.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    setChangeStatusLoading(true);
                    const payload = {...values, tubewell_id, change_by};
                    console.log(payload);
                    const url = `${baseUrl}/api/change_tubewell_status`;
                    const response = await axios.post(url, payload);
                    if (response.status === 200) {
                        message.success('tubewell status Changed ', 3);
                        handleSuccess()
                    } else {
                        message.error('Unknown Error Occurred ', 3);
                    }
                } catch (error) {
                    message.error(catchErrors(error));
                }
            }
        });
    }

    return <>
        <Card bordered={false}
              title={<span className='text-large font-weight-bolder'>Change Tubewell Status</span>}>
            <div className='text-large'>Fill out the form below to Change Tubewell Status</div>
            <div className='p-5'>
                <Form layout='vertical' onSubmit={handleStatusChangeSubmit} {...formItemLayout} >
                    <FI label='Status'>
                        {form.getFieldDecorator('status_title', {
                            rules: [{required: true, message: 'Status is required'}],
                        })(<Input size='large' className='w-100' placeholder='Status Title here...'/>)}
                    </FI>
                    <FI label='Description'>
                        {form.getFieldDecorator('status_description', {
                            rules: [{required: true, message: 'Description is required'}],
                        })(<TextArea rows={8} size='large' type='number' className='w-100'
                                     placeholder='Details about status changing...'/>)}
                    </FI>

                    <Divider/>
                    <div className='flex-justify-content'>
                        <Button size={"large"} className='mr-2' htmlType="submit" loading={changeStatusLoading}
                                disabled={changeStatusLoading}
                                style={{backgroundColor: '#0a8080', color: 'white'}}>Submit</Button>
                        <Button size={"large"}
                                onClick={handleCancel}>Cancel</Button>
                    </div>
                </Form>
            </div>
        </Card>
    </>
}

export const ChangeStatus = Form.create()(ChangeStatus_);
