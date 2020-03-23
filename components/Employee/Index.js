import React, {useEffect, useState} from "react";
import baseUrl from "../../utils/baseUrl";
import {Avatar, Button, Card, Divider, Form, Icon, Layout, Menu, message, Modal} from 'antd';
import Promotion from "./components/Promotion";
import Job from "./components/Job";
import Personal from "./components/Personal.js";
import ETraining from "./components/ETraining.js";
import Transfer from "./components/Transfer.js";
import AccountSettings from "./components/AccountSettings.js";
import axios from "axios";
import {Col, Media, Row} from "reactstrap";
import Head from "next/head";
import Documents from "./components/Documents";
import EmployeeLeaves from "./components/EmployeeLeaves";

const {Content} = Layout;
const {Item} = Menu;

export default function MyMenu({employee, address, designations, ctx, user}) {
    let main = undefined;
    let id = employee.employee_id;

    const menuMap = {
        job: "Job",
        personal: "Personal",
        training: "Trainings",
        leave: "Leaves",
        promotion: "Promotions",
        transfer: "Transfers",
        documents: "Documents",
        accountSettings: "Account Settings",
    };
    const [mode, setMode] = useState('horizontal');
    const [selectKey, setSelectKey] = useState('job');
    const [loading, setLoading] = useState(false);
    const [modelVisible, setModelVisible] = useState(false);
    const [profileImageToBeUpload, setProfileImageToBeUpload] = useState(null);
    const [avatarURL, setAvatarURL] = useState((employee.employee_photo) ? baseUrl + '/' + employee.employee_photo : placeholderAvatarURL);


    employee.appointment_date = employee.appointment_date.toString().substring(0, 10);
    employee.birth_date = employee.birth_date.toString().substring(0, 10);

    useEffect(() => {
        window.addEventListener('resize', resize);
        resize();
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, []);

    const getMenu = () => {
        return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
    };
    const getRightTitle = () => {
        return menuMap[selectKey];
    };
    const resize = () => {
        if (!main) {
            return;
        }
        /*requestAnimationFrame(() => {
            if (!main) {
                return;
            }
            const {offsetWidth} = main;
            if (main.offsetWidth < 641 && offsetWidth > 400) {
                setMode('vertical')
            }
            if (window.innerWidth < 768 && offsetWidth > 400) {
                setMode('vertical')
            }
        });*/
    };
    const renderChildren = () => {
        switch (selectKey) {
            case 'job':
                return <Job id={id} employee={employee} address={address}
                            designations={designations}/>;
            case 'personal':
                return <Personal id={id} p_employee={employee} p_address={address}/>;
            case 'training':
                return <ETraining id={id} ctx={ctx} employee={employee} />;
            case 'promotion':
                return <Promotion selectKey={selectKey} employee={employee} id={id} designations={designations}/>;
            case 'transfer':
                return <Transfer id={id} employee={employee}/>;
            case 'documents':
                return <Documents id={id} employee={employee} user={user}/>;
            case 'leave':
                return <EmployeeLeaves id={id} ctx={ctx} user={user}/>;
            case 'accountSettings':
                return <AccountSettings id={id}/>;
            default:
                break;
        }
        return null;
    };
    let placeholderAvatarURL = './../../static/placeholderAvatar.svg';
    const handleCancel = () => {
        setModelVisible(false);
        setAvatarURL((employee.employee_photo) ? baseUrl + '/' + employee.employee_photo : placeholderAvatarURL)
        setProfileImageToBeUpload(null)
    };
    const onImageDataChange = (e) => {
        let files = e.target.files;
        if (files && files[0]) {
            setProfileImageToBeUpload(files[0])
            setAvatarURL(URL.createObjectURL(files[0]))
        }
    };
    const handleSaveProfileImage = () => {
        const fd = new FormData();
        fd.append('employee_id', id);
        fd.append('image', profileImageToBeUpload, profileImageToBeUpload.name);
        setLoading(true);
        axios.post(baseUrl + '/api/upload_profile_image', fd)
            .then(d => {
                if (d.data.status !== 200) {
                    message.error("Error Uploading image", 3);
                } else {
                    message.success("Image Updated", 5);
                }
                setLoading(false);
                setModelVisible(false)
            })
    };
    const User = ({ name, formNumber, email, designation, status, contact}) => (
        <Row>
            <Col sm="12">
                <Card>
                    <Row className="mx-0" col="12">
                        <Col className="pl-0" sm="12">
                            <Media className="d-sm-flex d-block">
                                <Media className="mt-md-1 mt-0" left>
                                    <div className="gx-profile-banner-avatar">
                                        <div className='profile-pic'>
                                            <span className='profile-photo-img'>
                                                {/*<Media className="gx-size-90 rounded mr-2" object src={avatarURL} alt="image" height="112" width="112"/>*/}
                                                <Avatar  className="gx-size-112 rounded mr-2" src={avatarURL}/>
                                            </span>
                                            <div className="edit">
                                                <a href="#">
                                                    <Icon theme="twoTone" type="edit"
                                                          style={{fontSize: '20px', color: '#111'}}
                                                          onClick={() => setModelVisible(true)}/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </Media>
                                <Media body>
                                    <Row>
                                        <Col sm="9" md="6" lg="5">
                                            <div className="users-page-view-table">
                                                <div className="d-flex user-info">
                                                    <div className="user-info-title font-weight-bold">Name</div>
                                                    <div>{name}</div>
                                                </div>
                                                <div className="d-flex user-info">
                                                    <div className="user-info-title font-weight-bold">Form Number</div>
                                                    <div>{formNumber}</div>
                                                </div>
                                                <div className="d-flex user-info">
                                                    <div className="user-info-title font-weight-bold">
                                                        Email
                                                    </div>
                                                    <div className="text-truncate">
                                                        <span>{email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="12" lg="5">
                                            <div className="users-page-view-table">
                                                <div className="d-flex user-info">
                                                    <div className="user-info-title font-weight-bold">Designation</div>
                                                    <div>{designation}</div>
                                                </div>
                                                <div className="d-flex user-info">
                                                    <div className="user-info-title font-weight-bold">Status</div>
                                                    <div>{status}</div>
                                                </div>
                                                <div className="d-flex user-info">
                                                    <div className="user-info-title font-weight-bold">Contact #</div>
                                                    <div>
                                                        <span>{contact}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Media>
                            </Media>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
    return (
        <>
            <Head><link rel="stylesheet" type="text/css" href="/static/users.css"/></Head>
            <Modal destroyOnClose={true}
                   width={780}
                   visible={modelVisible}
                   onOk={() => setModelVisible(false)}
                   onCancel={handleCancel}
                   footer={null}
                   closable={false}>
                <Card bordered={false}
                      title={<span className='text-large font-weight-bolder'>Add A Profile Photo</span>}>
                    <div className='text-large'>Help your team know what you look like by setting a profile
                        photo.
                    </div>
                    <div className='p-5'>
                        <Form>
                            <div className='flex-justify-content'>
                                <Avatar className="model-profile-photo-img" alt="..."
                                        src={avatarURL}/>
                            </div>
                            <Divider/>
                            <div className='flex-justify-content'>
                                {(profileImageToBeUpload) ?
                                    <Button size={"large"} className='pr-5 pl-5 mr-2' htmlType="submit"
                                            loading={loading}
                                            disabled={loading} onClick={handleSaveProfileImage}
                                            style={{backgroundColor: '#0a8080', color: 'white'}}>Save</Button> :
                                    <span className="btn-pk btn-md btn-primary-green upload-button">
                                            <span className="text">Upload Photo</span>
                                            <input name="upload_button" type="file"
                                                   onChange={onImageDataChange}/>
                                        </span>
                                }
                                <Button size={"large"} disabled={loading} onClick={handleCancel}>Cancel</Button>
                            </div>
                        </Form>
                    </div>
                </Card>
            </Modal>
            {(!loading) &&
            <User name={employee.full_name} email={employee.email} formNumber={1234}
                  designation={designations[0] && designations[0].des_title}
                  status='Active' contact={(address[0]) && address[0].phone_number + " " + address[0].phone_number2}/>
            }
            <div className='main' ref={ref => (ref) && (main = ref)}>
                <div className='leftMenu'>
                    <Menu
                        mode={mode}
                        selectedKeys={[selectKey]}
                        onClick={({key}) => setSelectKey(key)}>
                        {getMenu()}
                    </Menu>
                </div>
                <div className='right'>
                    {(!loading) && renderChildren()}
                </div>
            </div>
        </>
    );

}

/*
*  <div className="gx-profile-banner">
                        <div className="gx-profile-container">
                            <div className="gx-profile-banner-top">
                                <div className="gx-profile-banner-top-left">
                                    <div className="gx-profile-banner-avatar">
                                        <div className='profile-pic'>
                                            <span className='profile-photo-img'>
                                                <Avatar className="gx-size-90" src={avatarURL}/></span>
                                            <div className="edit">
                                                <a href="#">
                                                    <Icon theme="twoTone" type="edit"
                                                          style={{fontSize: '20px', color: '#111'}}
                                                          onClick={() => setModelVisible(true)}/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <h2 className="mb-2 mb-sm-3 gx-fs-xxl font-weight-light">{employee.full_name}</h2>
                                        <p className="mb-0 gx-fs-lg">{designations[0] && designations[0].des_title}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>*/
