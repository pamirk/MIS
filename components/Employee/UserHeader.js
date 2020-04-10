import React, {useEffect, useState} from "react"
import {Button, Col, Media, Row} from "reactstrap"
import Head from "next/head";
import {Avatar, Card, Divider, Form, Icon, message, Modal} from "antd";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import {UserHeaderStateProvider, useUserHeaderState} from "./useUserHeaderState";
import {useEmployeeState} from "./useEmployeeState";
import {EDIT_PROFILE_IMAGE, VIEW_PROFILE_IMAGE} from "../../utils/role_constants";

const UserHeaderStateReducer = (state, action) => {
    switch (action.type) {
        case "POST_UPLOAD_PROFILE_IMAGE": {
            return {...state, loading: true}
        }
        case "SET_AVATAR_URL": {
            return {...state, avatarURL: action.avatarURL,}
        }
        case "ADD_PHOTO_MODAL_CANCEL": {
            return {
                ...state,
                addPhotoModelVisible: false,
                profileImageToBeUpload: null,
                modalImg: null
            }
        }
        case "ADD_PHOTO_MODAL_OK": {
            return {...state, addPhotoModelVisible: false}
        }
        case "IMAGE_DATA_CHANGE": {
            return {
                ...state,
                profileImageToBeUpload: action.profileImageToBeUpload,
                modalImg: action.modalImg
            }
        }
        case "UPLOAD_PROFILE_IMAGE_RESPONSE_COMPLETE": {
            return {
                ...state,
                loading: false,
                avatarURL: state.modalImg,
                addPhotoModelVisible: false
            }
        }
        case "ADD_PHOTO_MODAL_CLICKED": {
            return {...state, addPhotoModelVisible: true}
        }
        default:
            return state
    }
};
const UserHeaderInitialState = {
    addPhotoModelVisible: false,
    avatarURL: null,
    profileImageToBeUpload: null,
    loading: false,
    modalImg: null
};

function UserHeader({url, id, name, formNumber, email, designation, status, contact}) {
    const [{modalImg, loading, avatarURL, profileImageToBeUpload, addPhotoModelVisible}, dispatch] = useUserHeaderState();
    const [rolesInts, setRolesInts] = useState([]);
    const [{roles}, dispatchEmployee] = useEmployeeState();
    useEffect(() => {
        dispatch({type: "SET_AVATAR_URL", avatarURL: url});
        let arr = []
        roles.map(i => arr.push(i.p_id));
        setRolesInts(arr)
        //console.log("rolesInts", rolesInts)
    }, []);


    const onOk = () => {
        dispatch({type: "ADD_PHOTO_MODAL_OK"});
    };
    const handleCancel = () => {
        dispatch({type: "ADD_PHOTO_MODAL_CANCEL",});
    };
    const handleSaveProfileImage = () => {
        const fd = new FormData();
        fd.append('employee_id', id);
        fd.append('image', profileImageToBeUpload, profileImageToBeUpload.name);
        dispatch({type: "POST_UPLOAD_PROFILE_IMAGE"});
        axios.post(baseUrl + '/api/upload_profile_image', fd)
            .then(d => {
                dispatch({type: "UPLOAD_PROFILE_IMAGE_RESPONSE_COMPLETE"});
                if (d.data.status !== 200) {
                    message.error("Error Uploading image", 3);
                } else {
                    message.success("Image Updated", 5);
                }
            })
    };
    const onImageDataChange = (e) => {
        let files = e.target.files;
        if (files && files[0]) {
            dispatch({
                type: "IMAGE_DATA_CHANGE",
                profileImageToBeUpload: files[0],
                modalImg: URL.createObjectURL(files[0])
            });
        }
    };

    return (
        <>
            <Head>
                <link rel="stylesheet" type="text/css" href="/static/users.css"/>
                <title>{name}</title>
            </Head>
            <Card>
                <Row className="mx-0" col="12">
                    <Col className="pl-0" sm="12">
                        <Media className="d-sm-flex d-block">
                            <Media className="mt-md-1 mt-0" left>
                                <div className="gx-profile-banner-avatar">
                                    <div className='profile-pic'>
                                            <span className='profile-photo-img'>
                                               {rolesInts.includes(VIEW_PROFILE_IMAGE) && <Avatar className="gx-size-112 rounded mr-2" src={avatarURL}/>}
                                            </span>
                                        <div className="edit">
                                            <a href="#">
                                                {rolesInts.includes(EDIT_PROFILE_IMAGE) &&
                                                <Icon theme="twoTone" type="edit"
                                                      style={{fontSize: '20px', color: '#111'}}
                                                      onClick={() => dispatch({type: "ADD_PHOTO_MODAL_CLICKED"})}/>}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </Media>
                            <Media body>
                                <Row>
                                    <Col sm="12" md="12" lg="6">
                                        <div className="users-page-view-table">
                                            <div className="d-flex user-info">
                                                <div className="user-info-title font-weight-bold">Name</div>
                                                <div>{name}</div>
                                            </div>
                                            <div className="d-flex user-info">
                                                <div className="user-info-title font-weight-bold">Form #
                                                </div>
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
                                                <div className="user-info-title font-weight-bold">Designation
                                                </div>
                                                <div>{designation}</div>
                                            </div>
                                            <div className="d-flex user-info">
                                                <div className="user-info-title font-weight-bold">Status</div>
                                                <div>{status}</div>
                                            </div>
                                            <div className="d-flex user-info">
                                                <div className="user-info-title font-weight-bold">Contact #
                                                </div>
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
            <Modal destroyOnClose={true} width={780}
                   visible={addPhotoModelVisible} footer={null}
                   onOk={onOk} onCancel={handleCancel} closable={false}>
                <Card bordered={false}
                      title={<span className='text-large font-weight-bolder'>Add A Profile Photo</span>}>
                    <div className='text-large'>Help your team know what you look like by setting a profile photo.</div>
                    <div className='p-5'>
                        <Form>
                            <div className='flex-justify-content'>
                                <Avatar className="model-profile-photo-img" alt="..."
                                        src={modalImg ? modalImg : avatarURL}/>
                            </div>
                            <Divider/>
                            <div className='flex-justify-content'>
                                {(profileImageToBeUpload) ?
                                    <Button size={"large"} className='pr-5 pl-5 mr-2' htmlType="submit"
                                            loading={loading}
                                            disabled={loading} onClick={handleSaveProfileImage}
                                            style={{backgroundColor: '#0a8080', color: 'white'}}>Save</Button> :
                                    <span className="pr-5 pl-5 mr-2 btn-md btn-primary-green upload-button">
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
        </>
    )
}

export default (props) => (
    <UserHeaderStateProvider reducer={UserHeaderStateReducer} initialState={UserHeaderInitialState}>
        <UserHeader {...props} />
    </UserHeaderStateProvider>
)

