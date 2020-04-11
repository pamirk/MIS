import React, {useEffect, useState} from 'react'
import {Tabs, Menu, Dropdown, Icon, Button, Layout, message, Divider, Modal, Upload, Switch, Select, Input} from 'antd'
import Avatar from './Avatar'
import Head from "next/head";
import {useRouter} from "next/router";
import baseUrl, {awsb} from "../../utils/baseUrl";
import axios from "axios";
import moment from "moment";
import ChatCard from "./ChatCard";
import UserRemoteSelect from "./UserRemoteSelect";

const uuidv4 = require('uuid/v4');
const discuss = {
    title: "Something happened with my browser",
    status: "open",
    authorName: "Mark Freemanopened",
    date: "5 Apr 2017",
    commentsCount: 8,
    authorImg: 'https://cleanuitemplate.com/admin/react/preview/resources/images/avatars/1.jpg',
}
const {TabPane} = Tabs;
const {TextArea} = Input;
const {Option} = Select;

function ComplaintDetails({p_complain_data, p_data, p_complainDetails, user}) {
    const router = useRouter();
    const id = router.query.complaint_id;
    const [loading, setLoading] = useState(false);
    const [complain_data, setComplain_data] = useState(p_complain_data);
    const [data, setData] = useState(p_data);
    const [complainDetails, setComplainDetails] = useState(p_complainDetails);
    const [privateSwitchValue, setPrivateSwitchValue] = useState(true);
    const [forwards_message, setForwards_message] = useState('');
    const [status, setStatus] = useState('');
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [employeeAgent, setEmployeeAgent] = useState(null);
    const [visible_showpromoteModal, setVisible_showpromoteModal] = useState(false);
    const onStatusChange = (value) => setStatus(value);
    const onsubmit = () => {
        const {employee_id, full_name} = user.employee;

        const is_public = (privateSwitchValue) ? 1 : 0;
        const forwards_to = (employeeAgent && employeeAgent.employee_id)
            ? employeeAgent.employee_id
            : (complainDetails) && complainDetails.forwards_to;
        const reporting_id = uuidv4();
        const fd = new FormData();
        fd.append('complains_reporting_id', reporting_id);
        fd.append('reporting_id', reporting_id);
        fd.append('complain_id', id);
        fd.append('forwards_to', forwards_to);
        fd.append('forwards_by', employee_id);
        fd.append('forwards_date', moment().format('YYYY-MM-DD HH:mm:ss'));
        fd.append('suggested_date_reply', moment().format('YYYY-MM-DD HH:mm:ss'));
        fd.append('forwards_message', forwards_message);
        fd.append('emp_name', full_name);
        fd.append('is_reply', 1);
        fd.append('status', status);
        fd.append('is_public', is_public);


        axios.post(baseUrl + '/api/reporting_complains', fd)
            .then(response => {
                console.log("hi htere", response.data.status);
                if (response.data.status === 201) {
                    //message.success("Register Successfully");
                    handleUpload(reporting_id);
                    getConsumer_complain_list()
                } else if (response.data.status === 400) {
                    message.error("error");
                }
            });
    };
    const onPrivateSwitchChange = (checked) => setPrivateSwitchValue(checked);
    const getEmployee = (id) => {
        fetch(baseUrl + `/api/show_one_employee/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => setEmployeeAgent(data[0]))
    };
    const getConsumer_complain_list = () => {
        fetch(baseUrl + `/api/sc/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                setData(data.rows);
                setComplainDetails(data.rows[data.rows.length - 1]);
                setLoading(false);
            })
    };
    const showpromoteModal = () => setVisible_showpromoteModal(true);
    const handleOk = () => setVisible_showpromoteModal(false);
    const handleCancel = () => setVisible_showpromoteModal(false);
    const confirmBtnClicked = (value) => {
        if (value[0]) {
            getEmployee(value[0].key)
        }
    };
    const handleConfirm = () => {
        if (employeeAgent) {
            setVisible_showpromoteModal(false)
        } else {
            message.warning('Please select an employee to reply report')
        }
    };
    const handleUpload = (id) => {
        if (fileList.length === 0) {
            return
        }
        setUploading(true);

        fileList.forEach(file => {
            const formData = new FormData();
            formData.append('attachment_id', uuidv4());
            formData.append('reporting_id', id);
            formData.append('image', file);
            formData.append('attachment_file_type', file.type);


            axios.post(baseUrl + '/api/reporting_attachment', formData)
                .then(d => {
                    const data = d.data;
                    if (data.err) {
                        message.error(data.err, 5);
                    } else if (data.status === 200) {
                        //message.success('Successfully sent a file!', 1);
                        getConsumer_complain_list()
                    }
                })
                .catch(reason => {
                    setUploading(false);
                    message.error('upload failed.' + reason.toString());
                })
                .finally(() => {
                    setUploading(true);
                    setFileList([]);
                    //message.success('upload successfully.');
                });
        });
    };
    const props = {
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: file => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };
    let createdDate = (complain_data && complain_data.created_us) ? moment(complain_data.created_us).fromNow() : "-";
    let lastMessageDate = (complainDetails && complainDetails.forwards_date) ? moment(complainDetails.forwards_date).fromNow() : "-";
    let complainStatus = (complainDetails && complainDetails.status) ? complainDetails.status : "-";
    let isAssigned = complainDetails && complainDetails.employee_id;
    let cards = (!loading) && (data[0]) && (data[0].forwards_date) && data.map(v => {
        return ((user && user.user_cnic) && v.is_public === 0)
            ? ""
            : <ChatCard
                isUser={(user && !user.user_cnic)}
                forwards_to_name={v.full_name}
                forwards_by_name={v.employee_name}
                suggested_date_reply={v.suggested_date_reply}
                status={v.status}
                is_public={v.is_public}
                user_name={v.employee_name}
                created_at={v.forwards_date}
                complain_body={v.forwards_message}
                attachments={v.attachments}/>;
    });
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handlePreview = async file => {
        setPreviewImage(file);
        setPreviewVisible(true)
    };

    return (<>
        <Head>
            <link rel="stylesheet" type="text/css" href="/static/github.css"/>
        </Head>
        <section className="card">
            <div className="card-header">
                <div className="utils__title">
                    <strong>{complain_data.user_name}</strong>
                </div>
            </div>
            <div className="card-body p-5">
                <div className={discuss}>
                    <div className="mb-3">
                    </div>
                    <div className={`header clearfix`}>
                        <div className='title'>
                            <h1 className='titleText'>{complain_data.complain_body}</h1>
                            <div className='open'>
                                <Button type="primary" size="small">
                                    New Complaint
                                </Button>
                            </div>
                        </div>
                        <div>
                            {discuss.status === 'open' && (
                                <span className={`status btn btn-success btn-sm`}><i
                                    className="fa fa-check-circle-o mr-2"/>Open</span>
                            )}
                            {discuss.status === 'closed' && (
                                <span className={`status btn btn-success btn-sm`}><i
                                    className="fa fa-times-circle mr-2"/>Closed</span>
                            )}
                            <div className='metaText'>
                                Complaint opened on
                                <span className="ml-1">{moment(complain_data.created_us).fromNow()}</span> ·
                                <span className="ml-1">{`${data.length} comments`}</span>
                            </div>
                        </div>
                    </div>
                    {<div className="row">
                        <div className="col-lg-10">
                            <div>
                                {(!loading) && (data[0]) && (data[0].forwards_date) && data.map(i => (
                                    <div className={"commentItem"} key={i.complains_reporting_id}>
                                        <div className="mb-0 pb-0 clearfix">
                                            {/* <div className={"commentAvatar"}>
                                                    <Avatar src={(i.employee_photo) ? i.employee_photo : ''} size="50"/>
                                                </div>*/}
                                            <div className={"contentWrapper"}>
                                                <div className={"commentHead"}>
                                                    <strong>{i.full_name}</strong> posted:
                                                    <small
                                                        className="text-muted ml-2">{moment(i.forwards_date).format('Do MMMM YYYY')}</small>
                                                </div>
                                                <div className={"commentContent"}
                                                     dangerouslySetInnerHTML={{__html: i.forwards_message}}/>
                                                <span style={{background: '#f2f4f8',}} className="css-1trnuga">
                                                        {(i.employee_name && i.full_name)
                                                            ? <>{i.employee_name} assigned Complaint
                                                                to <strong>{i.full_name}</strong></>
                                                            : ''} </span>
                                                <br/>
                                                <span style={{background: '#f2f4f8',}} className="css-1trnuga">
                                                        {(i.status)
                                                            ? <>{i.employee_name} changed complaint status
                                                                to <strong> {i.status} </strong></>
                                                            : ""}
                                                    </span>
                                                {(i.attachments && i.attachments.split(',').length > 0) &&
                                                <>
                                                    <Divider/>
                                                    {i.attachments.split(',').map(v => (
                                                        <span onClick={() => handlePreview(awsb + `/${v}`)}>
                                                                 <Avatar src={awsb + `/${v}`}
                                                                         className='ml-2' shape="square"
                                                                         size={140} icon="user"/>
                                                             </span>))}
                                                </>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </div>
                            {discuss.status === 'open' && (
                                <div className={`addComment clearfix`}>
                                    <div className={'commentAvatar'}>
                                        <Avatar size="50" src={awsb + `/${user.employee.employee_photo}`}/>
                                    </div>
                                    <div className={'contentWrapper'}>
                                        {(!user.user_cnic) &&
                                        <div>
                                            <div className='css-8l8s0b'>
                                                <TextArea
                                                    id="forwards_message"
                                                    name="forwards_message"
                                                    onChange={(e) => setForwards_message(e.target.value)}
                                                    allowClear={true}
                                                    autoSize={{minRows: 3, maxRows: 5}}
                                                    className='textAreaStyle'
                                                    placeholder="Type a message…"/>

                                                <div style={{paddingTop: 10}}>
                                                    <Upload {...props}>
                                                        <Button><Icon type="upload"/> Select File</Button>
                                                    </Upload>
                                                    {/* <Button
                                                    type="primary"
                                                    onClick={this.handleUpload}
                                                    disabled={fileList.length === 0}
                                                    loading={uploading}
                                                    style={{marginTop: 16}}>
                                                    {uploading ? 'Uploading' : 'Start Upload'}
                                                     </Button>*/}
                                                </div>

                                                <Divider/>

                                            </div>
                                            <div className='complaint_comment'>
                                                <Switch className='ml-2 mr-auto' defaultChecked
                                                        unCheckedChildren='Private' checkedChildren='Public'
                                                        onChange={onPrivateSwitchChange}/>
                                                <span className='mr-2'>Complaint status</span>
                                                <Select className='mr-2' defaultValue="Open" style={{width: 120}}
                                                        onChange={onStatusChange}>
                                                    <Option value="open">Open</Option>
                                                    <Option value="pending">Pending</Option>
                                                    <Option value="solved">Solved</Option>
                                                    <Option value="closed">Closed</Option>
                                                    <Option value="spam">Spam</Option>
                                                </Select>
                                                <Button className='mr-2' onClick={showpromoteModal}>
                                                    {(employeeAgent) ? employeeAgent.full_name : "Forward To"}
                                                </Button>
                                                <Button className='mr-2' type="primary"
                                                        onClick={onsubmit}>submit</Button></div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="col-lg-2">
                            <div>
                                <div className={'pksidebarItem'}>
                                    <div className={'pksidebarHead'}>Created:</div>
                                    <div>{createdDate}</div>
                                </div>
                                <div className={'pksidebarItem'}>
                                    <div className={'pksidebarHead'}>Last message:</div>
                                    <div>{lastMessageDate}</div>
                                </div>
                                <div className={'pksidebarItem'}>
                                    <div className={'pksidebarHead'}>Status:</div>
                                    <div>{complainStatus}</div>
                                </div>
                                <div className={'pksidebarItem'}>
                                    <div className={'pksidebarHead'}>Agents</div>
                                    <div>
                                        <ul className={'participantsList'}>
                                            {[...new Set(data.map(item => item.employee_photo))].map(participant => (
                                                <li className={'participantsItem'} key={participant}>
                                                    <Avatar size="25" src={awsb + '/' + participant}/>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </section>
        <Modal
            style={{width: "100%", height: "100%"}}
            destroyOnClose={true}
            title="Assign to"
            visible={visible_showpromoteModal}
            onOk={handleOk}
            onCancel={handleCancel}

            footer={[
                <Button key="back" type="danger" onClick={handleOk}>
                    close
                </Button>,
                <Button key="back" type="primary" onClick={handleConfirm}>
                    Confirm
                </Button>
            ]}>

            <UserRemoteSelect confirmBtnClicked={confirmBtnClicked}/>

        </Modal>

        <Modal
            visible={previewVisible}
            onCancel={() => setPreviewVisible(false)}
            footer={null}>
            <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>

    </>)
}

export default ComplaintDetails
