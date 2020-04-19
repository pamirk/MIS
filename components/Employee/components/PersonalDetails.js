import React, {useEffect, useState} from "react";
import baseUrl, {awsb} from "../../../utils/baseUrl";
import axios from "axios";
import {AppStateProvider} from "../../useAppState";
import {Avatar, Button, Card, Icon, Skeleton, Upload, message, Divider, Modal, Form, Input, DatePicker} from "antd";
import PageEditAccount from "./PageEditAccount";
import {cardTitleIcon, formItemLayout, getBase64} from "../../Common/UI";
import {Col, Row} from "reactstrap";
import Head from "next/head";
import Address from "./Address";
import moment from "moment";
import * as _ from "lodash";
import catchErrors from "../../../utils/catchErrors";

const {Meta} = Card;


const initialState = {
    roles: null,
};
const reducer = (state, action) => {
    switch (action.type) {
        case "add": {
            return {...state, count: state.count + 1}
        }
        default:
            return state
    }
};

function PersonalDetails({user}) {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(awsb + '/' + user.employee.employee_photo);
    const [employee, setEmployee] = useState(user.employee);
    const [address, setAddress] = useState(null);
    const [designations, setDesignations] = useState(null);
    const [editAddressModal, setEditAddressModal] = useState(false);
    const [editEmailModal, setEditEmailModal] = useState(false);

    useEffect(() => {
        getDetails();
    }, []);
    const getDetails = async () => {
        const resArray = await axios.all([
            axios.get(`${baseUrl}/api/show_one_employee_address/${employee.employee_id}`),
            axios.get(`${baseUrl}/api/employee_designation_details/${employee.employee_id}`)]);
        setAddress(resArray[0].data.filter(i => i.type === 1));
        setDesignations(resArray[1].data)
    };

    const handleEditEmailSuccuss = (email) => {
        setEmployee({...employee, email});
        setEditEmailModal(false)
    };
    const DraggerProps = {
        data: {'employee_id': user.employee.employee_id},
        name: 'image',
        showUploadList: false,
        beforeUpload: file => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('You can only upload JPG/PNG file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
            }
            return isJpgOrPng && isLt2M;
        },
        action: baseUrl + '/api/upload_profile_image',
        onChange: info => {
            if (info.file.status === 'uploading') {
                setLoading(true);
                return;
            }
            if (info.file.status === 'done') {
                message.success("Image Updated", 5);
                getBase64(info.fileList[info.fileList.length - 1].originFileObj,
                    imageUrl => {
                        setImage(imageUrl);
                        setLoading(false);
                    }
                );
            }
            if (info.file.status === 'error') {
                message.success("Error Occurred while Updating Image", 3);
            }
        },
        listType: "picture-card",
        className: "avatar-uploader",
    };
    const uploadButton = (
        <div>
            <Icon type={loading ? 'loading' : 'plus'}/>
            <div className="ant-upload-text">Upload</div>
        </div>
    );
    return (
        <div className='min-vh-100 bg-light'>
            <Head>
                <link rel="stylesheet" type="text/css" href="/static/users.css"/>
            </Head>

            <div className='row justify-content-center'>
                <div className='col col-12 col-xl-8'>
                    <Card bordered={false} title={!image ? <span>Please Upload your Profile Image</span> : ""}>
                        <div className='d-flex align-items-center  w-100'>
                            <span><Upload {...DraggerProps} >
                                {image ? <img src={image} alt="avatar" style={{width: '100%'}}
                                              title='Click on Image to Change Profile Image'/> : uploadButton}
                            </Upload></span>
                            <span className='text-large font-weight-bolder'>{employee.full_name}</span>
                        </div>
                    </Card>

                    {(employee) &&
                    <Card className='mt-2' bordered={false}
                          title={cardTitleIcon('Basic Details', "edit", () => setEditEmailModal(true))}>
                        <div className="users-page-view-table">
                            <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">Full Name</div>
                                <div>{employee.full_name}</div>
                            </div>
                            <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">Father Name</div>
                                <div>{employee.father_name}</div>
                            </div>
                            <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">Form #</div>
                                <div className="text-truncate">{employee.form_number}</div>
                            </div>
                            <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">CNIC Number</div>
                                <div className="text-truncate">{employee.cnic}</div>
                            </div>
                            <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">Email</div>
                                <div className="text-truncate">{employee.email}</div>
                            </div>
                            <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">Birthday</div>
                                <div className="text-truncate">{moment(employee.birth_date).format('DD/MM/YYYY')}</div>
                            </div>
                            <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">Service Join Date
                                </div>
                                <div
                                    className="text-truncate">{moment(employee.appointment_date).format('DD/MM/YYYY')}</div>
                            </div>
                            <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">Gender</div>
                                <div className="text-truncate">{employee.gender}</div>
                            </div>
                        </div>
                    </Card>
                    }
                    {(address && address[0]) ?
                        <Card bordered={false} className='mt-2'
                              title={cardTitleIcon('Home Address', "menu", () => setEditAddressModal(true))}>
                            <div className="users-page-view-table">
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Current Address</div>
                                    <div>{address[0].current_address}</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Permanent Address
                                    </div>
                                    <div>{address[0].permanent_address}</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Postal Code</div>
                                    <div className="text-truncate">{address[0].postal_code}</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">City</div>
                                    <div className="text-truncate">Quetta</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Phone 1</div>
                                    <div className="text-truncate">{address[0].phone_number}</div>
                                </div>
                                <div className="d-flex user-info">
                                    <div className="user-info-title font-weight-bold">Phone 2</div>
                                    <div
                                        className="text-truncate">{(address[0].phone_number2 !== "") ? address[0].phone_number2 : "None"}</div>
                                </div>
                            </div>
                        </Card>
                        : <Card bordered={false} className='mt-2'
                                title={cardTitleIcon('Add Home Address', "plus", () => setEditAddressModal(true))}>
                        </Card>
                    }

                    <Card bordered={false} className='mt-2' title='Change Password'>
                        <ChangePassword id={employee.employee_id}/>
                    </Card>
                </div>
            </div>

            <Modal
                width={780} destroyOnClose={true}
                visible={editAddressModal}
                onOk={() => setEditAddressModal(false)}
                onCancel={() => setEditAddressModal(false)}
                footer={null} closable={false}>
                <Card bordered={false}
                      title={<strong className={'text-large font-weight-bold'}>Home Address History</strong>}>
                    <p>{`This is a list of all of ${employee.full_name}’s, current and previous addresses..`}</p>
                    <Address id={employee.employee_id} address_data={address}
                             handleCancel={() => setEditAddressModal(false)} type={1}/>
                </Card>

            </Modal>
            <Modal
                width={780}
                destroyOnClose={true}
                visible={editEmailModal}
                onOk={() => setEditEmailModal(false)}
                onCancel={() => setEditEmailModal(false)}
                footer={null}
                closable={false}>
                <EditEmail id={employee.employee_id} data={{email: employee.email}}
                           handleSuccess={handleEditEmailSuccuss} handleCancel={() => setEditEmailModal(false)}/>
            </Modal>
        </div>
    );
}

export default (props) => (<AppStateProvider reducer={reducer} initialState={{...initialState, ...props}}>
    <PersonalDetails {...props} />
</AppStateProvider>)


const changePassword = ({id, form}) => {
    const [loading, setLoading] = useState(false);
    const [fieldsValue, setFieldsValue] = useState(null);
    const [confirmDirty, setConfirmDirty] = useState(false);
    const {getFieldDecorator} = form;

    const handleConfirmBlur = e => {
        const {value} = e.target;
        setConfirmDirty(confirmDirty || !!value)
    };
    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };
    const validateToNextPassword = (rule, value, callback) => {
        if (value && confirmDirty) {
            form.validateFields(['conform_password'], {force: true});
        }
        callback();
    };

    const submit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    setLoading(true);//update_employee_status
                    const url = `${baseUrl}/api/set_employee_password_by_employee`;
                    if (values.old_password === values.password) {
                        return message.error("You are providing same values for old and new passwords")
                    }
                    const payload = {old_password: values.old_password, new_password: values.password, id};
                    console.log(payload);
                    const {data} = await axios.post(url, payload);
                    if (data.status === 200) {
                        message.success(data.message)
                    } else {
                        message.error(data.message)
                    }
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    form.resetFields()
                    setLoading(false);
                }
            }
        });
    };
    return (
        <Form layout='vertical' onSubmit={submit} {...formItemLayout} >
            <Form.Item label="Old Password" hasFeedback>{
                getFieldDecorator('old_password', {
                    rules: [{required: true, message: "Old Password is required"}]
                })(<Input.Password size='large' className='w-100'/>)}
            </Form.Item>
            <Form.Item label="New Password" hasFeedback>{
                getFieldDecorator('password', {
                    rules: [{required: true, message: "Password is required"}, {validator: validateToNextPassword}]
                })
                (
                    <Input.Password size='large' className='w-100'/>
                )}
            </Form.Item>
            <Form.Item label="Confirm Password" hasFeedback>{
                getFieldDecorator('conform_password', {
                    rules: [{
                        required: true,
                        message: "type Password again here"
                    }, {validator: compareToFirstPassword}]
                })
                (
                    <Input.Password size='large' className='w-100' onBlur={handleConfirmBlur}/>
                )}
            </Form.Item>
            <Divider/>
            <div className='flex-justify-content'>
                <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                        disabled={loading}
                        style={{backgroundColor: '#0a8080', color: 'white'}}>Change</Button>
            </div>
        </Form>
    )
}
const ChangePassword = Form.create()(changePassword);

const editEmail = ({id, form, data, handleCancel, handleSuccess}) => {
    const [loading, setLoading] = useState(false);
    const [fieldsValue, setFieldsValue] = useState(null);

    useEffect(() => setInfo(), []);
    const setInfo = () => {
        if (data) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                obj[key] = data[key] || null;
                form.setFieldsValue(obj);
            });
            setFieldsValue(form.getFieldsValue())
        }
    };

    const emailSubmit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                if (_.isEqual(values, fieldsValue)) {
                    return handleCancel()
                }
                try {
                    setLoading(true);
                    const url = `${baseUrl}/api/emailUpdate`;
                    const payload = {...values, employee_id: id};
                    console.log(payload);
                    const response = await axios.post(url, payload);
                    if (response.data.status === 200) {
                        message.success("Email Updated", 3);
                        handleSuccess(values.email)
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
        <Card bordered={false}
              title={<strong className={'text-large font-weight-bold'}>Edit Email History</strong>}>
            <Form layout='vertical' onSubmit={emailSubmit} {...formItemLayout} >
                <Form.Item label="Email">{form.getFieldDecorator('email', {
                    rules: [{required: true, message: "Current Address required"}]
                })
                (<Input size='large' type='email' className='w-100' placeholder="Email Address"/>)}</Form.Item>

                <Divider/>
                <div className='flex-justify-content'>
                    <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                            disabled={loading}
                            style={{backgroundColor: '#0a8080', color: 'white'}}>Submit</Button>
                    <Button onClick={handleCancel} size={"large"}>Cancel</Button>
                </div>
            </Form>
        </Card>
    )
}
const EditEmail = Form.create()(editEmail);