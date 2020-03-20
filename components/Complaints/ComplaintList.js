import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import moment from "moment";
import {Button, Descriptions, Divider, Icon, Input, Select, Table, Tag, Tooltip} from "antd";
import Highlighter from "react-highlight-words";
import Router from "next/router";
import {COMPLAINTS_STATUS} from "../../server/utils/status";

const {Item} = Descriptions;
const {TextArea} = Input;
const {Option} = Select;

function ComplaintList({complaints}) {
    const [data, setData] = useState(null);
    const [loading, setloading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const searchInput = useRef(null);
    const [search, setSearch] = useState(COMPLAINTS_STATUS.TOTAL);
    const [filteredComplaints, setfilteredComplaints] = useState([]);

    useEffect(() => {
        let mydata = [];
        for (let i = 0; i < complaints.length; i++) {
            const complain = complaints[i];
            mydata.push({
                key: complain.complain_id,
                Customer: complain.user_name,
                Account_Number: complain.account_number,
                Complaint: complain.complain_body,
                Status: [complain.status],
                Last_Activity: (complain.forwards_date) ? moment(complain.forwards_date).from() : moment(complain.created_us).from(),
            })
        }
        setData(mydata)
    }, []);

    useEffect(() => {
        if (search === COMPLAINTS_STATUS.TOTAL) {
            setfilteredComplaints(data)
        } else if (search === COMPLAINTS_STATUS.INITIATED) {
            setfilteredComplaints(data.filter(c => c.status === COMPLAINTS_STATUS.INITIATED));
        } else if (search === COMPLAINTS_STATUS.REGISTERED) {
            setfilteredComplaints(data.filter(c => c.status === COMPLAINTS_STATUS.REGISTERED));
        } else if (search === COMPLAINTS_STATUS.IN_PROCESS) {
            setfilteredComplaints(data.filter(c => c.status === COMPLAINTS_STATUS.IN_PROCESS));
        } else if (search === COMPLAINTS_STATUS.RESOLVED) {
            setfilteredComplaints(data.filter(c => c.status === COMPLAINTS_STATUS.RESOLVED));
        } else if (search === COMPLAINTS_STATUS.DELAYED) {
            setfilteredComplaints(data.filter(c => c.status === COMPLAINTS_STATUS.DELAYED));
        } else {
            setfilteredComplaints(data)
        }
    }, [search, data]);

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input ref={searchInput}
                       placeholder={`Search ${dataIndex}`}
                       value={selectedKeys[0]}
                       onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                       onPressEnter={() => handleSearch(selectedKeys, confirm)}
                       style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{width: 90, marginRight: 8}}
                >
                    Search
                </Button>
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0])
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('')
    };
    const columns = [
        {
            ellipsis: true,
            title: 'Customer',
            dataIndex: 'Customer',
            key: 'Customer',
            width: '15%',
        },
        {
            title: 'Account Number',
            dataIndex: 'Account_Number',
            ellipsis: true,
            key: 'Account_Number',
            width: '15%',
            ...getColumnSearchProps('Account_Number'),
        },
        {
            ellipsis: true,
            title: 'Complaint body',
            dataIndex: 'Complaint',
            key: 'Complaint',
            width: '25%',
            ...getColumnSearchProps('Complaint'),
        },
        {
            ellipsis: true,
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            width: '10%',
            render: (text, record) => (
                <span>
                      {record.Status.map(tag => (
                          <Tag color={statusColorsMap[tag]} key={tag}>
                              {tag}
                          </Tag>
                      ))}
                     </span>
            ),
        },
        {
            ellipsis: true,
            title: 'Last Activity',
            dataIndex: 'Last_Activity',
            key: 'Last_Activity',
            width: '14%',
            ...getColumnSearchProps('Last_Activity'),
        }

    ];
    return <>

        <div className='row d-print-flex align-items-center mt-2 mb-2'>
            <div className="col-sm-9"><h3 className="text-large p-2 justify-content-center">{search}</h3></div>
            <div className="col-sm-3">
                <Select
                    style={{width: '100%'}}
                    defaultValue={search}
                    onChange={(value => setSearch(value))}>
                    <Option value={COMPLAINTS_STATUS.ALL}>Total</Option>
                    <Option value={COMPLAINTS_STATUS.INITIATED}>Initiated</Option>
                    <Option value={COMPLAINTS_STATUS.REGISTERED}>Registered</Option>
                    <Option value={COMPLAINTS_STATUS.IN_PROCESS}>In Process</Option>
                    <Option value={COMPLAINTS_STATUS.RESOLVED}>Resolved</Option>
                    <Option value={COMPLAINTS_STATUS.DELAYED}>Delayed</Option>
                </Select>
            </div>
        </div>

        <Table style={{backgroundColor: "white"}} loading={loading} columns={columns}
               dataSource={filteredComplaints} scroll={{x: 800}}
               onRow={(record, rowIndex) => ({
                   onClick: event => {
                       Router.push('/complaint/' + record.key)
                   }
               })}/>
    </>;
}

export default ComplaintList;

const statusColorsMap = {
    'REGISTERED': "#425A70",
    'INITIATED': "#108ee9",
    'IN PROCESS': "#084B8A",
    'RESOLVED': "#47B881",
};
