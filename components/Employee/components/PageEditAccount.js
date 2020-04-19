import React, { useEffect, useRef, useState } from 'react';

import { Avatar, Button, Card, Form, Icon, Input, Select } from 'antd';

const { Option } = Select;

function PasswordForm(props) {
    const { getFieldDecorator } = props.form;

    const compareToFirstPassword = (rule, value, callback) => {
        const { form } = props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Passwords not matching');
        } else {
            callback();
        }
    };

    return (
        <Form>
            <Form.Item label='Current password'>
                {getFieldDecorator('password', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your password!'
                        }
                    ]
                })(<Input.Password />)}
            </Form.Item>

            <Form.Item className='mb-0'>
                <Form.Item
                    label='New password'
                    style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                    {getFieldDecorator('new', {
                        rules: [
                            {
                                required: true,
                                message: 'Enter new password'
                            }
                        ]
                    })(<Input placeholder='New password' />)}
                </Form.Item>

                <Form.Item
                    label='Confirm Password'
                    style={{ display: 'inline-block', width: 'calc(50% - 12px)', marginLeft: 24 }}>
                    {getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: 'Please confirm your password!'
                            },
                            {
                                validator: compareToFirstPassword
                            }
                        ]
                    })(<Input.Password />)}
                </Form.Item>
            </Form.Item>
            <Form.Item>
                <Button>Change password</Button>
            </Form.Item>
        </Form>
    );
};

const WrappedPasswordForm = Form.create({ name: 'password' })(PasswordForm);

function UserForm(props) {
    const { getFieldDecorator } = props.form;

    return (
        <Form layout='vertical'>
            <Form.Item label='First name'>
                {getFieldDecorator('firstName', { initialValue: 'Liam' })(<Input />)}
            </Form.Item>

            <Form.Item label='Last name'>
                {getFieldDecorator('lastName', { initialValue: 'Jonus' })(<Input />)}
            </Form.Item>

            <Form.Item className='mb-0'>
                <Form.Item label='Age' style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                    {getFieldDecorator('age', { initialValue: '26' })(<Input />)}
                </Form.Item>

                <Form.Item
                    label='Gender'
                    style={{
                        display: 'inline-block',
                        width: 'calc(50% - 12px)',
                        marginLeft: 24
                    }}>
                    {getFieldDecorator('gender', { initialValue: 'male' })(
                        <Select>
                            <Option value='male'>Male</Option>
                            <Option value='female'>Female</Option>
                        </Select>
                    )}
                </Form.Item>
            </Form.Item>

            <Form.Item label='Phone number'>
                {getFieldDecorator('phone', { initaValue: '0126596578' })(<Input />)}
            </Form.Item>

            <Form.Item label='Address'>
                {getFieldDecorator('address', { initialValue: '71 Pilgrim Avenue Chevy Chase, MD 20815' })(
                    <Input.TextArea />
                )}
            </Form.Item>

            <Form.Item label='Last visit'>
                {getFieldDecorator('visit', { initialValue: '18 Aug 2019' })(<Input disabled />)}
            </Form.Item>

            <Form.Item label='Status'>
                {getFieldDecorator('status', { initialValue: 'approved' })(
                    <Select>
                        <Option value='approved'>Approved</Option>
                        <Option value='pending'>Pending</Option>
                    </Select>
                )}
            </Form.Item>
        </Form>
    );
};

function PageEditAccount(props) {
    const { onSetPage } = props;

    const [changes, setChanges] = useState(false);
    const [avatar, setAvatar] = useState();
    const fileInput = useRef(null);

    const pageData = {
        title: 'Edit account',
        loaded: true,
        breadcrumbs: [
            {
                title: 'Home',
                route: 'dashboard'
            },
            {
                title: 'User Pages ',
                route: 'dashboard'
            },
            {
                title: 'Edit Account'
            }
        ]
    };

    const onFileChanged = (inputValue) => {
        const file = inputValue.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setAvatar(reader.result);
            setChanges(true);
        };

        reader.readAsDataURL(file);
    };

    //useEffect(() => onSetPage(pageData), []);

    const handleFormChange = () => {
        setChanges(true);
    };

    const WrappedUserForm = Form.create({ name: 'user', onValuesChange: handleFormChange })(UserForm);

    return (
        <div className='row justify-content-center'>
            <div className='col col-12 col-xl-8'>
                <Card bordered={false} title='User photo'>
                    <div className='d-sm-flex align-items-center w-100 elem-list'>
                        <Avatar src={avatar} size={100} className='mb-4' />
                        <span>Pamir khan</span>
                        <Button
                            type='primary'
                            htmlType='button'
                            ghost
                            onClick={() => fileInput.current.click()}>
                            Change photo
                            <Icon type='user' />
                        </Button>
                        <input ref={fileInput} type='file' accept='image/*' onChange={onFileChanged} hidden />
                    </div>
                </Card>

                <Card bordered={false} title='Main user information' className='mt-2'>
                    {<WrappedUserForm />}
                    <div className='d-flex justify-content-between'>
                        <Button type='primary' disabled={!changes} onClick={() => setChanges(false)}>
                            Save changes
                        </Button>

                        <Button type='danger' ghost>
                            Delete
                        </Button>
                    </div>
                </Card>

                <Card bordered={false} title='Change password' className='mb-0 mt-2'>
                    <WrappedPasswordForm />
                </Card>
            </div>
        </div>
    );
};

export default PageEditAccount;
