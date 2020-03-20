import React, {useEffect, useRef, useState} from "react";
import {Button, Col, Row, Table, message, Input, Icon} from "antd";
import Router from "next/router";
import Link from "next/link";
import moment from "moment";
import Highlighter from "react-highlight-words";

export default function Index({trainings}) {
    const [data, setData] = useState(trainings);
    const [loading, setLoading] = useState(false);
    const [modelVisible, setModelVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const searchInput = useRef(null);

    const showModal = () => setModelVisible(true);
    const handleOk = () => setModelVisible(false);
    const handleCancel = () => setModelVisible(false);

    /* useEffect(() => {
         // let myData = [];
         // trainings.map(t => myData.push({...t}));
         setData(trainings)
     }, []);*/


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
            title: 'title',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
            ...getColumnSearchProps('title'),

        },
        {
            ellipsis: true,
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ...getColumnSearchProps('description'),

        },
        {
            ellipsis: true,
            title: 'Offered By',
            dataIndex: 'offered_by',
            key: 'offered_by',
            ...getColumnSearchProps('title'),

        },
        {
            ellipsis: true,
            title: 'funded By',
            dataIndex: 'funded_by',
            key: 'funded_by',
            ...getColumnSearchProps('funded_by'),

        },
        {
            ellipsis: true,
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            ...getColumnSearchProps('category'),

        },
        {
            ellipsis: true,
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ...getColumnSearchProps('address'),

        },
        {
            ellipsis: true,
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => new Date(b.start_date) - new Date(a.start_date),
            sortDirections: ['descend', 'ascend'],
            render: (text, record) => (
                <span>{moment(record.start_date).format("Do MMM YYYY")}</span>
            )
        },
        {
            ellipsis: true,
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => new Date(b.start_date) - new Date(a.start_date),
            sortDirections: ['descend', 'ascend'],

            render: (text, record) => (
                <span>{moment(record.end_date).format("Do MMM YYYY")}</span>
            )
        }
    ];

    return (
        <>
            <h1>Trainings</h1>

            <Button style={{backgroundColor: '#0a8080', color: 'white'}} size={"large"}
                    onClick={() => Router.push("/trainings/create")}>Create a Trainings</Button>

            <Table className='p-2' style={{backgroundColor: "white"}} loading={loading}
                   columns={columns} dataSource={data} scroll={{x: 1200}}
                   onRow={(record, rowIndex) => ({onClick: event => Router.push(`/trainings/${record.id}`)})}/>
        </>
    )
}
