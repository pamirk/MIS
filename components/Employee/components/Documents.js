import React, {useEffect, useState} from "react";
import {Button, Card, Divider, Form, Icon, Input, message, Modal, Table, Upload} from "antd";
import {Col, Row} from "reactstrap";
import axios from "axios";
import baseUrl, {awsb} from "../../../utils/baseUrl";
import moment from "moment";
import Link from "next/link";
import {formItemLayout} from "../../Common/UI";

const {Dragger} = Upload;
const FormItem = Form.Item;

function Documents({id, employee, user, form}) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [modelVisible, setModelVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [docs, setDocs] = useState(null);
    const [triggerUseEffect, setTriggerUseEffect] = useState(false);

    const handleOk = () => setModelVisible(false);
    const handleCancel = () => setModelVisible(false);

    const DraggerProps = {
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const {documents} = await getDocuments();
            setDocs(formatData(documents));
            setLoading(false)
        }
        fetchData();
    }, [triggerUseEffect]);
    const formatData = (data) => {
        let myData = [];
        data && data.map(t => myData.push({...t, key: t.doc_id}));
        return myData
    };
    const getDocuments = async () => {
        const url = `${baseUrl}/api/documents/${id}`;
        const response = await axios.get(url);
        return {documents: response.data.rows}
    };
    const columns = [
        {
            ellipsis: true,
            title: 'Document',
            dataIndex: 'document_name',
            key: 'document_name',
            render: (text, record) => (
                <span><a style={{
                    color: ' #0a8080',
                    transition: 'color 125ms ease-in-out'
                }} target='_blank' href={awsb + '/' + record.document_link}>{record.document_name}</a></span>
            )
        },
        {
            ellipsis: true,
            title: 'Uploaded on',
            dataIndex: 'last_update_ts',
            key: 'last_update_ts',
            width: '15%',
            render: (text, record) => (
                <span>{moment(record.last_update_ts).format("MMM Do YYYY")}</span>
            )
        },
        {
            ellipsis: true,
            title: 'Uploaded By',
            dataIndex: 'enterby_name',
            key: 'enterby_name',
            width: '15%',
            render: (text, record) => (
                <Link href={`/employee/${record.enterby_id}`} ><a target='_blank'>{record.enterby_name}</a></Link>
            )
        },
        {
            ellipsis: true,
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: '10%',
            render: (text, record) => (
                <span><a style={{color: ' #0a8080', transition: 'color 125ms ease-in-out'}}
                         target='_blank' href={awsb + '/' + record.document_link}>
                    <Icon type="eye" theme="twoTone" title='View Document'/></a></span>
            ),
        }
    ];
    const handlerSubmit = (event) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                const fd = new FormData();
                fd.append('image', fileList[0], fileList[0].name);
                fd.append('document_name', values.Document_Name);
                fd.append('employee_id', id);
                fd.append('enterby_id', user.employee.employee_id);

                setUploading(true)
                axios.post(baseUrl + '/api/document_file', fd)
                    .then(d => {
                        if (d.data.status !== 200) {
                            message.error("Error Uploading image", 3);
                        } else {
                            message.success("Image Updated", 5);
                            setTriggerUseEffect(!triggerUseEffect)
                        }
                        setLoading(false);
                        setUploading(false);
                        setModelVisible(false)
                    })
            }
        });
    };
    const {getFieldDecorator} = form;
    return (
        <Card>
            <Row>
                <Col>
                    <h1 className='mt-2'>Employment Documents</h1>
                    <p style={{fontSize: '18px'}}>These documents are <strong>shared</strong> between {employee.full_name} and admins.
                    </p>
                    <div className="text-right mr-3 mb-5">
                        <Button onClick={() => setModelVisible(true)}
                                style={{backgroundColor: '#0a8080', color: 'white'}} size={"large"}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Icon className='mr-1' type='plus-circle'/>
                                <span>Upload New Document </span>
                            </div>
                        </Button>
                    </div>
                </Col>
            </Row>
            <Divider/>
            <Row>
                <Col>
                    <Table style={{backgroundColor: "white"}} loading={loading}
                           columns={columns} dataSource={docs} scroll={{x: 1000}}/>
                </Col>
            </Row>
            <Modal
                destroyOnClose={true} width={780} visible={modelVisible}
                onOk={handleOk} onCancel={handleCancel}
                footer={null} closable={false}>
                <Card bordered={false}
                      title={<strong className={'text-large font-weight-bold'}>Upload Document</strong>}>
                    <div>Access to this file will be limited to admins, and Employee.</div>

                    <div className='p-5'>
                        <Form layout='vertical' onSubmit={handlerSubmit} {...formItemLayout} >
                            <FormItem label="Source">{getFieldDecorator('Source', {
                                rules: [{required: true, message: "Source is required"}]
                            })
                            (
                                <Dragger {...DraggerProps}>
                                    <p className="ant-upload-drag-icon">
                                        <Icon type="inbox"/>
                                    </p>
                                    <p className="ant-upload-text">Select file</p>
                                    <p className="ant-upload-hint">or drop your file here</p>
                                </Dragger>
                            )}</FormItem>
                            <FormItem label="Document Name">{getFieldDecorator('Document_Name', {
                                rules: [{required: true, message: "Document Name is required"}]
                            })
                            (<Input size='large' type='text' className='w-100'
                                    placeholder="Document Name"/>)}</FormItem>
                            <Divider/>
                            <div className={'flex-justify-content'}>
                                <Button htmlType="submit" size={"large"} className='mr-2'
                                        disabled={fileList.length !== 1} loading={uploading}
                                        style={{
                                            backgroundColor: '#0a8080',
                                            color: 'white',
                                            width: "auto"
                                        }}>{uploading ? 'Uploading' : 'Start Upload'}</Button>
                                <Button size={"large"} onClick={() => handleCancel()}>Cancel</Button>
                            </div>
                        </Form>
                    </div>
                </Card>
            </Modal>
        </Card>
    )
}

export default Form.create()(Documents);
