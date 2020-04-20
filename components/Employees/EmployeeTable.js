import React, {useEffect, useRef, useState} from "react";
import {Avatar, Button, Divider, Icon, Input, Table, List} from 'antd';
import Highlighter from 'react-highlight-words';
import Link from "next/link";
import { useRouter } from 'next/router'
import {awsb} from "../../utils/baseUrl";

let placeholderAvatarURL = './../../static/placeholderAvatar.svg';

export default function EmployeeTable({data}) {
    const [tableData, setTableData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const searchInput = useRef(null);
    const router = useRouter()
    useEffect(() => {
        let myData = [];
        for (let i = 0; i < data.length; i++) {
            const e = data[i];
            myData.push({
                key: e.employee_id,
                form_number: e.form_number,
                full_name: e.full_name,
                father_name: e.father_name,
                employee_photo: e.employee_photo || "",
                des_title: e.des_title || "",
            })
        }
        setTableData(myData)
    }, []);


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
            title: 'Name',
            dataIndex: 'full_name',
            key: 'full_name',
            ...getColumnSearchProps('full_name'),
            render: (text, record) => (
                <List.Item className='p-0'>
                    <List.Item.Meta avatar={<Avatar size='default' src={record.employee_photo ? awsb + '/' + record.employee_photo : placeholderAvatarURL}/>}
                        title={<Link href={`employee/${record.key}`} ><a>{record.full_name}</a></Link>}/>
                </List.Item>
            ),
        },
        {
            title: 'Father Name',
            dataIndex: 'father_name',
            key: 'father_name',
            ...getColumnSearchProps('father_name'),
        },
        {
            title: 'Form #',
            dataIndex: 'form_number',
            key: 'form_number',
            width: '12%',
            ...getColumnSearchProps('form_number'),
        },
        {
            title: 'Job title',
            dataIndex: 'des_title',
            key: 'des_title',
            ...getColumnSearchProps('des_title'),
        },
        {
            title: '',
            dataIndex: 'action',
            width: '15%',
            key: 'action',
            render: (text, record) => (
                <span>
                       <Link href={`employee/${record.key}`}>
                          <a>View</a>
                      </Link>

                      <Divider type="vertical"/>
                      <Link href={`employee_report/${record.key}`}>
                          <a>Report</a>
                      </Link>

                </span>
            )
        }

    ];

    return (
        <>
            <Table size={"default"} columns={columns} dataSource={tableData} scroll={{x: 1000}} onRowClick={record => null /*router.push(`/employee/${record.key}`)*/}/>
        </>
    );
}
