import React, {useEffect, useState} from 'react';
import Router from 'next/router';
import {Button, Card, Descriptions, Divider, Form, Input, message, Modal, Select, Table, Tooltip} from "antd";
import {period} from "../../utils/common";
import moment from "moment";
import baseUrl from "../../utils/baseUrl";
import {LEAVE_STATUS} from "../../server/utils/status";
import axios from "axios";
import catchErrors from "../../utils/catchErrors";

const {Item} = Descriptions
const {TextArea} = Input;
const {Option} = Select;

function LeavesList({user, leaves, form: {getFieldDecorator, validateFields}}) {
    const [data, setData] = useState([]);
    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modelVisible, setModelVisible] = useState(false);
    const [search, setSearch] = useState(LEAVE_STATUS.To_Review);
    const [filteredleaves, setFilteredleaves] = useState([]);

    useEffect(() => {
        let mydata = [];
        for (let i = 0; i < leaves.length; i++) {
            const leave = leaves[i];
            mydata.push({
                key: leave.lv_id,
                status: leave.status,
                employee_id: leave.employee_id,
                Employee: leave.full_name,
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

    const showModal = () => setModelVisible(true);
    const handleOk = () => setModelVisible(false);
    const handleCancel = () => setModelVisible(false);

    const columns = [
        {
            ellipsis: true,
            title: 'Employee',
            dataIndex: 'Employee',
            key: 'Employee',
            width: '20%',
            render: (text, record) => record.Employee,
        },
        {
            ellipsis: true,
            title: 'Start date',
            dataIndex: 'Start_date',
            key: 'Start_date',
            width: '20%',
            render: (text, record) => moment(record.Start_date).format("Do MMM YYYY")
        },
        {
            ellipsis: true,
            title: 'End date',
            dataIndex: 'End_date',
            key: 'End_date',
            width: '20%',
            render: (text, record) => moment(record.End_date).format("Do MMM YYYY")
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
        }
    ];
    const handleSubmit = (e, btnStatus) => {
        e.preventDefault();
        validateFields(async (err, values) => {

            if (!err) {
                try {
                    setLoading(true);
                    const url = `${baseUrl}/api/leave_update`;
                    const payload = {
                        ...leave,
                        ...values,
                        lv_id: leave.key,
                        status: btnStatus,
                        entertain_by: user.employee.employee_id,
                        entertain_on: moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                    };
                    console.log(payload);

                    const response = await axios.post(url, payload);
                    const {status, rows} = response.data
                    console.log("response", response.data);
                    if (status === 200) {
                        message.success('leave Updated,');
                        const updateLeavesList = data.map((leave) => {
                            if (leave.key === payload.key) {
                                return payload
                            }
                            return leave;
                        });
                        setData(updateLeavesList);
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
    const handleDecline = (e) => {
        e.preventDefault();
        validateFields(async (err, values) => {
            console.log(values);
        });
    };
    return (
        <>
            <div className='row d-print-flex align-items-center mt-2 mb-2'>
                <div className="col-sm-9"><h3 className="text-large p-2 justify-content-center">{search}</h3></div>
                <div className="col-sm-3">
                    <Select
                        style={{width: '100%'}}
                        defaultValue={search}
                        onChange={(value => setSearch(value))}>
                        <Option value={LEAVE_STATUS.ALL}>All</Option>
                        <Option value={LEAVE_STATUS.To_Review}>To Review</Option>
                        <Option value={LEAVE_STATUS.Approved}>Approved</Option>
                        <Option value={LEAVE_STATUS.Declined}>Declined</Option>
                    </Select>
                </div>
            </div>

            <Table style={{backgroundColor: "white"}} loading={loading}
                   columns={columns} dataSource={filteredleaves} scroll={{x: 800}}
                   onRow={(record, rowIndex) => ({
                       onClick: event => {
                           setLeave(record);
                           setModelVisible(true)
                       }, // click row
                   })}/>

            {(leave) && <Modal
                destroyOnClose={true}
                width={780}
                visible={modelVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                closable={false}>
                <Card bordered={false}
                      title={<strong className={'text-large font-weight-bold'}>
                          {(leave.status === LEAVE_STATUS.To_Review) ? 'Pending' : leave.status} {leave.Request_type} Request
                          for {leave.Employee}</strong>}>
                    <div
                        className={'flex-justify-content'}>On {moment(leave.Start_date).format("ddd, DDD MMM, YYYY")}, {leave.Employee} requested
                        some time off.
                    </div>

                    <div>
                        <Form>
                            <dl className="row centered p-5">
                                <dt className="col-xl-3 p-3  font-weight-bold">Start Date:</dt>
                                <dd className="col-xl-9 p-3 ">{(leave.Start_date) && moment(leave.Start_date).format("MMM Do YY")}</dd>
                                <dt className="col-xl-3 p-3 font-weight-bold">End Date:</dt>
                                <dd className="col-xl-9 p-3 ">{(leave.End_date) && moment(leave.End_date).format("MMM Do YY")}</dd>
                                <dt className="col-xl-3 p-3 font-weight-bold">Requested Period:</dt>
                                <dd className="col-xl-9 p-3 ">{(leave.Start_date && leave.End_date) && period(leave.Start_date, leave.End_date)}</dd>
                                <dt className="col-xl-3 p-3 font-weight-bold">Description:</dt>
                                <dd className="col-xl-9 p-3 ">{leave.Description}</dd>
                                <dt className="col-xl-3 p-3 font-weight-bold">Note to {leave.Employee}:</dt>
                                {(leave.status === LEAVE_STATUS.To_Review)
                                    ? <dd className="col-xl-8 p-3 ">
                                        <Tooltip placement="rightBottom"
                                                 title={'Communication brings us closer. Leave a note, for example: ' +
                                                 '“Have a great time. Can’t wait to have you back.” If declining, please provide a reason.'}>
                                            <Form.Item>
                                                {getFieldDecorator('reply_note', {
                                                    rules: [{required: true, message: 'Reply Note is required'}],
                                                })(<TextArea rows={8}
                                                             placeholder={`Hey ${leave.Employee}, \nHope you have a great trip!`}/>)}
                                            </Form.Item>

                                        </Tooltip>

                                    </dd>
                                    : <dd className="col-xl-8 p-3 ">{(leave.reply_note) ? leave.reply_note : "-"}</dd>
                                }
                                <dd className="col-xl-1"/>
                            </dl>
                            <Divider/>
                            {(leave.status === LEAVE_STATUS.To_Review)
                                ? <>
                                    <div className={'flex-justify-content'}>
                                        <Button size={"large"} className='mr-2'
                                                style={{backgroundColor: '#0a8080', color: 'white'}}
                                                onClick={(e) => handleSubmit(e, LEAVE_STATUS.Approved)}>Approve</Button>

                                        <Button onClick={(e) => handleSubmit(e, LEAVE_STATUS.Declined)}
                                                size={"large"} type={"danger"}>Decline</Button>
                                    </div>
                                    <div className={'flex-justify-content'}>
                                        <Button type="link" size={"large"} style={{color: '#0a8080'}}
                                                onClick={handleCancel}>Cancel and review
                                            later</Button>
                                    </div>
                                </>
                                : <div className={'flex-justify-content'}>
                                    <Button size={"large"} className='mr-2'
                                            style={{backgroundColor: '#0a8080', color: 'white'}}
                                            onClick={handleCancel}>Looks Good</Button>
                                </div>

                            }
                        </Form>
                    </div>
                </Card>
            </Modal>}

        </>
    );
}

export default Form.create()(LeavesList);
