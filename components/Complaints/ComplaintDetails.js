import {useRouter} from 'next/router'
import React, {useState} from "react";
import moment from "moment";
import {Avatar, Button, Card, Divider, Icon, Input, Layout, message, Modal, Select, Switch, Upload} from "antd";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import ChatCard from "./ChatCard";
import UserRemoteSelect from "./UserRemoteSelect";
import Head from "next/head";

const uuidv4 = require('uuid/v4');

const {Header, Footer, Sider, Content} = Layout;
const {Option} = Select;
const {TextArea} = Input;



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
        getEmployee(value[0].key)
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

    const isConsumerStyle = "p-5 " + ((user && user.user_cnic) ? " " : " demo-infinite-container");

    return (
        <>
            <Head>
                <link rel="stylesheet" type="text/css" href="/static/github.css"/>
            </Head>
            {(!loading) &&
            <>
                <Layout >
                    <Content>
                        {/*<div className={`p-5 header clearfix`}>
                            <div className='title'>
                                <h1 className='titleText'>discuss.title</h1>
                            </div>
                            <div>
                                <span className={`status btn btn-success btn-sm`}><i className="fa fa-check-circle-o mr-2"/>Open</span>


                                <div className='metaText'>
                                    <a href="javascript: void(0);" className="mr-1">discuss.authorName</a>
                                    opened this discussion on
                                    <span className="ml-1">discuss.date</span> ·
                                    <span className="ml-1">{`${12} comments`}</span>
                                </div>
                            </div>
                        </div>*/}
                        <div className={ isConsumerStyle}>

                            <ChatCard
                                complaincard={true}
                                isUser={(user && !user.user_cnic)}
                                user_name={complain_data.user_name}
                                created_at={complain_data.created_us}
                                complain_body={complain_data.complain_body}
                                attachments={complain_data.attachments}

                            />
                            {cards}
                        </div>
                        {(!user.user_cnic) &&
                        <div className='css-1panmox'>
                            <div className='css-fqbvdm'>
                                <div className='css-1zftos'>
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

                                    <div className='css-o6jqtj'>
                                        <div className='css-gg4vpm'>
                                            <div className='css-1utwezw'>
                                                Private
                                                <Divider type='vertical'/>
                                                <Switch defaultChecked title='Private'
                                                        onChange={onPrivateSwitchChange}/>
                                            </div>
                                            <div className='css-u4p24i'>
                                                <div className='css-11lt5zu'>
                                                    <span className='css-7ngqza'>Complaint status</span>
                                                    <Select defaultValue="Open" style={{width: 120}}
                                                            onChange={onStatusChange}>
                                                        <Option value="open">Open</Option>
                                                        <Option value="pending">Pending</Option>
                                                        <Option value="solved">Solved</Option>
                                                        <Option value="closed">Closed</Option>
                                                        <Option value="spam">Spam</Option>
                                                    </Select>

                                                    <Button className='ml-2'
                                                            onClick={showpromoteModal}>
                                                        {(employeeAgent) ? employeeAgent.full_name : "Forward To"}
                                                    </Button>

                                                    <Button className='ml-2' type="primary"
                                                            onClick={onsubmit}>submit</Button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </Content>
                    <Sider width={320} style={{height: '100hv', backgroundColor: "#f3f7f9", color: 'white'}}>
                        <Card title='Complaint Info' bordered={false} style={{borderRadius: 8, marginTop: 16}}>
                            <span>Created: </span> <strong>{createdDate}</strong><Divider/>
                            <span>Last message: </span> <strong>{lastMessageDate}</strong><Divider/>
                            <span>Status: </span> <strong>{complainStatus}</strong>

                        </Card>
                        <Divider/>
                        <Card title='Responsibility' bordered={false} style={{borderRadius: 8, marginTop: 16}}>
                            <Card bordered={false} title='Agent'>
                                {(isAssigned)
                                    ? <Card.Meta
                                        avatar={<Avatar
                                            src={baseUrl + "/" + complainDetails.employee_photo}/>}
                                        title={complainDetails.full_name}
                                        description={complainDetails.email}/>
                                    : <Card.Meta description="No agent assigned to this ticket."/>
                                }
                            </Card>

                        </Card>
                    </Sider>
                </Layout>

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
            </>


            }
        </>
    );
}

export default ComplaintDetails;

{/*<PageHeaderWrapper style={{fontSize: "small"}}>
                        <Card bordered={false} style={{backgroundColor: "#F9F9FB", fontSize: 5, fontWeight: 750}}>
                            <Row gutter={[48, 8]}>
                                <Col span={12}>
                                    <Descriptions title="" style={{marginBottom: 32}}>
                                        <Descriptions.Item
                                            label="Status">{complainDetails.complain_status}</Descriptions.Item><br/><br/>
                                        <Descriptions.Item
                                            label="Complain body">{complainDetails.complain_body}</Descriptions.Item>
                                        <br/><br/>
                                        <Descriptions.Item
                                            label="Last updated">{complainDetails.created_us.substring(0, 10)}</Descriptions.Item><br/><br/>
                                        <Descriptions.Item
                                            label="Created at">{complainDetails.created_us.substring(0, 10)}</Descriptions.Item><br/>
                                    </Descriptions>
                                    <h4 style={{fontSize: '1rem'}}>Complaint Attachments</h4>
                                    <Avatar shape="square" size={200}
                                            src={config.hostUrl + `/${complainDetails.attachment_name}`}/>
                                </Col>
                                <Col span={6} style={{marginLeft: 100}}>
                                    <div>
                                        <h6 style={{fontSize: '1rem'}}>Type</h6>
                                        <Select defaultValue="Problem" style={{width: '100%'}}>
                                            <Option value="question">Question</Option>
                                            <Option value="incident">Incident</Option>
                                            <Option value="problem">Problem</Option>
                                            <Option value="request">Feature Request</Option>
                                            <Option value="refund">Refund</Option>
                                        </Select>
                                        <Divider/>
                                        <h6 style={{fontSize: '1rem'}}>Status</h6>
                                        <Select defaultValue="Pending" style={{width: '100%'}}>
                                            <Option value="pending">Pending</Option>
                                            <Option value="resolved">Resolved</Option>
                                            <Option value="closed">Closed</Option>
                                            <Option value="waiting_consumer">Waiting on Consumer</Option>
                                            <Option value="waiting_third_party">Waiting on Third Party</Option>
                                        </Select>
                                        <Divider/>
                                        <h6 style={{fontSize: '1rem'}}>Priority</h6>
                                        <Select defaultValue="low" style={{width: '100%'}}>
                                            <Option value="low">Low</Option>
                                            <Option value="medium">Medium</Option>
                                            <Option value="high">High</Option>
                                            <Option value="urgent">Urgent</Option>
                                        </Select>
                                        <Divider/>
                                        <h6 onClick={this.showpromoteModal} style={{width: '100%'}}>Assign to</h6>
                                        <Select onDropdownVisibleChange={this.showpromoteModal} defaultValue='ds' style={{width: '100%'}}>
                                            <Option value='ds'>
                                                    <span onClick={this.showpromoteModal}>{assignValue}</span>
                                            </Option>
                                        </Select>
                                        <Divider/>
                                        <Button style={{width: '100%'}}>Update</Button>
                                    </div>
                                    <Button type={"primary"} onClick={this.showpromoteModal}>Reply
                                        Report</Button><br/><br/>
                                    <Button type={"primary"}>Forword Report</Button>
                                    <h3 style={{fontSize: '1rem'}}>Complaint Timeline history</h3>
                                    <Timeline mode="alternate">
                                        <Timeline.Item>
                                            <p>Complaint sumbited on</p>
                                            {complainDetails.created_us.substring(0, 10)}
                                        </Timeline.Item>
                                        <Timeline.Item>
                                            <p>Current Status:</p>
                                            {complainDetails.complain_status}
                                        </Timeline.Item>
                                        <Timeline.Item color="green">
                                            <Row>
                                                <Col sm={20}>
                                                    <p> Remarks:</p>
                                                    <h6>New Complain</h6>
                                                </Col>
                                                <Col sm={4}>
                                                    <Icon type="check-circle" theme="twoTone"/>
                                                </Col>
                                            </Row>
                                            <Tag color="green">Forworded to: admin</Tag><br/>
                                            <Tag color="blue">Forworded from: admin</Tag><br/><br/><br/>
                                            <Tag>Suggested Date: NotDECIDED</Tag>
                                        </Timeline.Item>
                                    </Timeline>
                                </Col>
                            </Row>
                        </Card>
                    </PageHeaderWrapper>*/}
