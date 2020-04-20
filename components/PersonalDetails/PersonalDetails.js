import React, {useEffect, useState} from "react";
import baseUrl, {awsb} from "./../../utils/baseUrl";
import axios from "axios";
import {AppStateProvider} from "./../useAppState";
import {Card, Icon, Menu, message, Upload} from "antd";
import {getBase64} from "./../Common/UI";
import Head from "next/head";
import ChangePassword from "./ChangePassword";
import General from "./General";
import Job from "../Employee/components/Job";
import Personal from "../Employee/components/Personal";
import ETraining from "../Employee/components/ETraining";
import Promotion from "../Employee/components/Promotion";
import Transfer from "../Employee/components/Transfer";
import Documents from "../Employee/components/Documents";
import EmployeeLeaves from "../Employee/components/EmployeeLeaves";
import AccountSettings from "../Employee/components/AccountSettings";
import EmployeeLogs from "../Employee/components/EmployeeLogs";

const {Item} = Menu;

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
const menuMap = {
    general: "General",
    password: "Password",
    documents: "Documents"
};

function PersonalDetails({user}) {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(awsb + '/' + user.employee.employee_photo);
    const [employee, setEmployee] = useState(user.employee);
    const [address, setAddress] = useState(null);
    const [designations, setDesignations] = useState(null);
    const [selectKey, setSelectKey] = useState('general');

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
    const getMenu = () => {
        return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
    };
    const renderChildren = () => {
        switch (selectKey) {
            case 'general':
                return address && <General p_employee={employee} p_address={address}/>;
            case 'password':
                return <ChangePassword id={employee.employee_id}/>;
            case 'documents':
                return <Documents id={employee.employee_id} employee={employee} user={user}/>;
            default:
                break;
        }
    };
    return (
        <div className='min-vh-100 bg-light'>
            <Head>
                <link rel="stylesheet" type="text/css" href="/static/users.css"/>
                <title>{employee.full_name}</title>
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
                    <div>
                        <Menu
                            mode='horizontal'
                            selectedKeys={[selectKey]}
                            onClick={({key}) => setSelectKey(key)}>
                            {getMenu()}
                        </Menu>
                        <div className='mt-2'>
                            {renderChildren()}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default (props) => (<AppStateProvider reducer={reducer} initialState={{...initialState, ...props}}>
    <PersonalDetails {...props} />
</AppStateProvider>)