import React, {useState} from "react";
import {Col, Media, Row} from "reactstrap";
import {Avatar, Button, Card, Divider, Form, Icon, Modal} from "antd";
import baseUrl from "../../../utils/baseUrl";

function UserHeader({name, formNumber, email, designation, status, contact}) {
    const [modelVisible, setModelVisible] = useState(false);
    const handleCancel = () => {
        setModelVisible(false);
        setAvatarURL((employee.employee_photo) ? baseUrl + '/' + employee.employee_photo : placeholderAvatarURL)
        setProfileImageToBeUpload(null)
    };
    return (
        <>
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
                                                <Avatar className="gx-size-112 rounded mr-2" src={avatarURL}/>
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
                                                        <div className="user-info-title font-weight-bold">Form Number
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
                </Col>
            </Row>
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
        </>
    );
}

export default UserHeader;
/*
* create table leaves
(
    lv_id          bigint auto_increment
        primary key,
    employee_id    bigint                              not null,
    start_date     datetime                            not null,
    end_date       datetime                            not null,
    status         varchar(255)                        not null,
    description    text                                null,
    reply_note     text                                null,
    entertain_by   bigint                              null,
    entertain_on   datetime                            null,
    last_update_ts timestamp default CURRENT_TIMESTAMP not null,
    lt_id          bigint    default 1                 not null,
    constraint leaves___fk3
        foreign key (lt_id) references leave_types (lt_id)
            on update cascade on delete cascade,
    constraint leaves_ibfk_1
        foreign key (employee_id) references employees (employee_id)
            on delete cascade,
    constraint leaves_ibfk_2
        foreign key (entertain_by) references employees (employee_id)
            on delete cascade
);

create index employee_id
    on leaves (employee_id);

create index entertain_by
    on leaves (entertain_by);

*/