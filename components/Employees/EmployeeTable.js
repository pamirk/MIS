import React, {Component, useEffect, useState, useRef} from "react";
import {Button, Divider, Icon, Input, Table} from 'antd';
import Highlighter from 'react-highlight-words';
import Link from "next/link";


export default function EmployeeTable({data}) {
    const [tableData, setTableData] = useState(null);
    const [searchText, setSearchText] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        let mydata = [];
        for (let i = 0; i < data.length; i++) {
            const employee = data[i];
            mydata.push({
                key: employee.employee_id,
                name: employee.full_name,
                fathername: employee.father_name,
                email: employee.email,
                cnic: employee.cnic,
                local: employee.local,
                birth_date: employee.birth_date.substring(0, 10),
            })
        }
        setTableData(mydata)
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
            dataIndex: 'name',
            key: 'name',
            width: '15%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Father Name',
            dataIndex: 'fathername',
            key: 'fathername',
            width: '15%',
            ...getColumnSearchProps('fathername'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'CNIC',
            dataIndex: 'cnic',
            key: 'cnic',
            width: '13%',
            ...getColumnSearchProps('cnic'),
        },
        {
            title: 'Local',
            dataIndex: 'local',
            key: 'local',
            width: '10%',
            ...getColumnSearchProps('local'),
        },
        {
            title: 'Birth Date',
            dataIndex: 'birth_date',
            key: 'birth_date',
            width: '10%',
            ...getColumnSearchProps('birth_date'),
        },
        {
            title: 'Action',
            dataIndex: 'action',
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
            <Table  columns={columns} dataSource={tableData} scroll={{ x: 1200 }}/>
        </>
    );
}
