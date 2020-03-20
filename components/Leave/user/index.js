import {Button,Col, Row, Card, DatePicker, Divider, Form, Icon, Input, message, Modal, Select, Table, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import baseUrl from "../../../utils/baseUrl";
import axios from "axios";
import catchErrors from "../../../utils/catchErrors";
import {LEAVE_STATUS} from "../../../server/utils/status";
import moment from "moment";
import {period} from "../../../utils/common";

const {Option} = Select;
const {TextArea} = Input;
const FormItem = Form.Item;

function Index({form: {getFieldDecorator, validateFields}, leaves, user, lt}) {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState(LEAVE_STATUS.ALL);
    const [filteredleaves, setFilteredleaves] = useState([]);

    const [modelVisible, setModelVisible] = useState(false);
    const [model2Visible, setModel2Visible] = useState(false);
    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(false);

    const showModal = () => setModelVisible(true);
    const handleOk = () => setModelVisible(false);
    const handleCancel = () => setModelVisible(false);

    const handleOk2 = () => setModel2Visible(false);
    const handleCancel2 = () => setModel2Visible(false);

    useEffect(() => {
        let mydata = [];
        for (let i = 0; i < leaves.length; i++) {
            const leave = leaves[i];
            mydata.push({
                key: leave.lv_id,
                status: leave.status,
                employee_id: leave.employee_id,
                Start_date: leave.start_date,
                End_date: leave.end_date,
                Description: leave.description,
                reply_note: leave.reply_note,
                entertain_by: leave.entertain_by,
                entertain_on: leave.entertain_on,
            })
        }
        setData(mydata)
    }, []);
    useEffect(() => {
        if (search === LEAVE_STATUS.ALL) {
            setFilteredleaves(data)
        } else if (search === LEAVE_STATUS.To_Review) {
            setFilteredleaves(data.filter(lv => lv.status === LEAVE_STATUS.To_Review));
        } else if (search === LEAVE_STATUS.Approved) {
            setFilteredleaves(data.filter(lv => lv.status === LEAVE_STATUS.Approved));
        } else if (search === LEAVE_STATUS.Declined) {
            setFilteredleaves(data.filter(lv => lv.status === LEAVE_STATUS.Declined));
        } else {
            setFilteredleaves(data)
        }

    }, [search, data]);

    const columns = [
        {
            ellipsis: true,
            title: 'Start Date',
            dataIndex: 'Start_date',
            key: 'Start_date',
            width: '20%',
            render: (text, record) => (
                <span>{moment(record.Start_date).format("Do MMM YYYY")}</span>
            )
        },
        {
            ellipsis: true,
            title: 'End Date',
            dataIndex: 'End_date',
            key: 'End_date',
            width: '20%',
            render: (text, record) => (
                <span>{moment(record.End_date).format("Do MMM YYYY")}</span>
            )
        },
        {
            ellipsis: true,
            title: 'Requested Period',
            dataIndex: 'Requested_Period',
            key: 'Requested_Period',
            width: '20%',
            render: (text, record) => (
                <span>{period(record.Start_date, record.End_date)}</span>
            )
        },
        {
            ellipsis: true,
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
            render: (text, record) => (
                <small>{record.Description}</small>
            )
        },
        {
            ellipsis: true,
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: '10%',

            render: (text, record) => (
                'view'
            ),
        }
    ];


    const handleSubmit = (e) => {
        e.preventDefault();
        validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                try {
                    setLoading(true);
                    const url = `${baseUrl}/api/leave`;
                    const payload = {
                        ...values,
                        lt_id: lt,
                        employee_id: user.employee.employee_id,
                        status: LEAVE_STATUS.To_Review,
                        reply_note: null,
                        entertain_by: null,
                        entertain_on: null,
                    };
                    console.log(payload);
                    const response = await axios.post(url, payload);
                    const {status, rows} = response.data
                    console.log(response.data);
                    if (status === 200) {
                        message.success('Your leave has been forward to concern person,');
                        console.log("rows: ", rows);
                        let leave = rows[0];
                        let newLeave = {
                            key: leave.lv_id,
                            status: leave.status,
                            employee_id: leave.employee_id,
                            Start_date: leave.start_date,
                            End_date: leave.end_date,
                            Description: leave.description,
                            reply_note: leave.reply_note,
                            entertain_by: leave.entertain_by,
                            entertain_on: leave.entertain_on,
                        };
                        setData(ps => [newLeave, ...ps]);
                        handleCancel()
                    }

                } catch (error) {
                    message.error(catchErrors(error));

                } finally {
                    setLoading(false);
                }

            }
        });

    };
    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const url = `${baseUrl}/api/leave_delete`;
            const payload = {
                lv_id: leave.key
            };
            console.log(payload);
            const response = await axios.post(url, payload);

            console.log(response.data);
            if (response.data.status === 200) {
                message.success(response.data.messaga, 5);
                const updateLeavesList = data.filter(lv => lv.key !== payload.lv_id);
                setData(updateLeavesList);
                handleCancel2()
            }
        } catch (error) {
            message.error(catchErrors(error));

        } finally {
            setLoading(false);
        }
    };

    function onChange(value) {
        setSearch(value);
    }

    return <div>
        <Row className='mb-3'>
            <Col xl={6} lg={6} md={12} sm={24} xs={24} className="mb-3">
                <div>
                    <dt style={{fontSize: '14px', lineHeight: '20px', color: '#6c6c72'}}>
                    <span className='mr-2'>Available Days </span>
                        <Tooltip title="Your Current Balance minus any requested leave ">
                            <span><Icon  type="info-circle" theme="twoTone"/></span>
                        </Tooltip>

                    </dt>
                    <dd style={{fontSize: '18px', lineHeight: '27px', color: '#1c1c1c', fontWeight: 600}}>
                        <span className="">19</span> days
                    </dd>
                </div>
            </Col>
            <Col xl={6} lg={6} md={12} sm={24} xs={24} className="mb-3">
                <div>
                    <dt style={{fontSize: '14px', lineHeight: '20px', color: '#6c6c72'}}>
                    <span>Current balance</span>
                    </dt>
                    <dd style={{fontSize: '18px', lineHeight: '27px', color: '#1c1c1c', fontWeight: 600}}>
                        <span className="">19</span> days
                    </dd>
                </div>
            </Col>
        </Row>
        <Button style={{backgroundColor: '#0a8080', color: 'white'}} size={"large"} onClick={() => showModal(true)}>
            Request Time Off
        </Button>
        <Divider />
        <Modal destroyOnClose={true}
               width={780}
               visible={modelVisible}
               onOk={handleOk}
               onCancel={handleCancel}
               footer={null}
               closable={false}>
            <Card bordered={false}
                  title={<span className='text-large font-weight-bolder'>Request Time Off</span>}>
                <div className=''>
                    <span className='text-large'>Fill out the form below. You’ll get an email after your employer has reviewed the request.</span>
                </div>


                <div className='p-5'>
                    <strong className="text-large font-weight-bold flex-justify-content mb-3">When will you be
                        away?</strong>
                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            <dt className="col-xl-3 p-4  font-weight-bold">First day:</dt>
                            <dd className="col-xl-9 p-4">
                                <FormItem>
                                    {getFieldDecorator('start_day', {
                                        rules: [{required: true, message: 'First day is required'}],
                                    })(<DatePicker size='large' className='w-100' placeholder='Start day'/>)}
                                </FormItem>
                            </dd>

                            <dt className="col-xl-3 p-4  font-weight-bold">End day:</dt>
                            <dd className="col-xl-9 p-4">
                                <FormItem>
                                    {getFieldDecorator('end_day', {
                                        rules: [{required: true, message: 'End day is required'}],
                                    })(<DatePicker size='large' className='w-100' placeholder='End day'/>)}
                                </FormItem>
                            </dd>
                            <dt className="col-xl-3 p-4 font-weight-bold">What will you be up to? Let your manager
                                know:
                            </dt>
                            <dd className="col-xl-9 p-4 ">
                                <FormItem>
                                    {getFieldDecorator('description', {
                                        rules: [{
                                            required: true,
                                            message: 'Please provide description!'
                                        }]
                                    })(
                                        <TextArea rows={8} placeholder={`Need a day off`}/>
                                    )}
                                </FormItem>
                            </dd>
                        </div>
                        <Divider/>
                        <div className='flex-justify-content'>
                            <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                                    disabled={loading}
                                    style={{backgroundColor: '#0a8080', color: 'white'}}>Send Request</Button>
                            <Button size={"large"} disabled={loading} onClick={handleCancel}>Cancel</Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </Modal>

        <div className='row d-print-flex align-items-center mt-2 mb-2'>
            <div className="col-sm-9"><h3 className="text-large p-2 justify-content-center">{search}</h3></div>
            <div className="col-sm-3">
                <Select
                    style={{width: '100%'}}
                    defaultValue={search}
                    onChange={onChange}>
                    <Option value={LEAVE_STATUS.ALL}>All</Option>
                    <Option value={LEAVE_STATUS.To_Review}>To Review</Option>
                    <Option value={LEAVE_STATUS.Approved}>Approved</Option>
                    <Option value={LEAVE_STATUS.Declined}>Declined</Option>
                </Select>
            </div>
        </div>

        <Table className='p-2' style={{backgroundColor: "white"}} loading={loading}
               columns={columns} dataSource={filteredleaves} scroll={{x: 800}}
               onRow={(record, rowIndex) => ({
                       onClick: event => {
                           setLeave(record);
                           setModel2Visible(true)
                       }
                   }
               )}
        />
        {(leave) && <Modal
            width={780}
            visible={model2Visible}
            onOk={handleOk2}
            onCancel={handleCancel2}
            footer={null}
            closable={false}>
            <Card bordered={false}
                  title={<strong className={'text-large font-weight-bold'}>Time Off</strong>}>
                <div className={'flex-justify-content'}>On {moment(leave.Start_date).format("MMM Do YY")}, you requested
                    some time off.
                </div>
                <div>
                    <dl className="row centered p-5">
                        <dt className="col-xl-3 p-3  font-weight-bold">Status:</dt>
                        <dd className="col-xl-9 p-3">{leave.status}</dd>
                        <dt className="col-xl-3 p-3 font-weight-bold">Start Date:</dt>
                        <dd className="col-xl-9 p-3 ">{(leave.Start_date) && moment(leave.Start_date).format("MMM Do YY")}</dd>
                        <dt className="col-xl-3 p-3 font-weight-bold">End Date:</dt>
                        <dd className="col-xl-9 p-3 ">{(leave.End_date) && moment(leave.End_date).format("MMM Do YY")}</dd>
                        <dt className="col-xl-3 p-3 font-weight-bold">Requested Period:</dt>
                        <dd className="col-xl-9 p-3 ">{(leave.Start_date && leave.End_date) && period(leave.Start_date, leave.End_date)}</dd>
                        <dt className="col-xl-3 p-3 font-weight-bold">Description:</dt>
                        <dd className="col-xl-9 p-3 ">{leave.Description}</dd>

                        {(leave.entertain_by) &&
                        <>
                            <dt className="col-xl-3 p-2 font-weight-bold">Entertained By:</dt>
                            <dd className="col-xl-9 p-2 ">{leave.entertain_by}</dd>
                        </>}

                        {(leave.entertain_on) &&
                        <>
                            <dt className="col-xl-3 p-3 font-weight-bold">Declined on:</dt>
                            <dd className="col-xl-9 p-3 ">{(leave.entertain_on) ? moment(leave.entertain_on).format("MMM Do YY") : "-"}</dd>
                        </>}

                        {(leave.reply_note) &&
                        <>
                            <dt className="col-xl-3 p-3 font-weight-bold">Note by Leilani:</dt>
                            <dd className="col-xl-8 p-3 ">{(leave.reply_note) ? leave.reply_note : "-"}</dd>
                            <dd className="col-xl-1"/>
                        </>}
                    </dl>
                    <Divider/>
                    <div className={'flex-justify-content'}>
                        <Button size={"large"} className='mr-2'
                                style={{backgroundColor: '#0a8080', color: 'white'}}
                                onClick={handleCancel2}

                        >Looks Good</Button>
                    </div>

                    {(leave.status === LEAVE_STATUS.To_Review) && <div className={'flex-justify-content'}>
                        <Button onClick={handleDelete} type="link" size={"large"} style={{color: 'red'}}>Delete
                            Request</Button>
                    </div>}
                </div>
            </Card>
        </Modal>}
    </div>;
}

export default Form.create()(Index);


