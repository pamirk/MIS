import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Button, Card, Divider, Icon, Input, message, Modal, Skeleton, Table} from "antd";
import Highlighter from "react-highlight-words";
import baseUrl from "../../../utils/baseUrl";
import moment from "moment";
import Router from "next/router";
import {parseCookies} from "nookies";
import {redirectUser} from "../../../utils/auth";
import axios from "axios";
import List18 from "../../Training/List18";

export default function Training({id, ctx, employee}) {
    const [loading, setLoading] = useState(false);
    const [triggerUseEffect, setTriggerUseEffect] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [allTrainings, setAllTrainings] = useState(null);
    const [selectedTrainingRows, setSelectedTrainingRows] = useState([]);
    const [tabledata, setTabledata] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [modelVisible, setModelVisible] = useState(false);
    const [searchText, setSearchText] = useState(false);
    const searchInput = useRef(null);

    useEffect(() => {
        setLoading(true);
        getEmployeeTrainings()
            .then(r => {
                setTabledata(formatData(r.trainings));
                setCategoryData(r.categories);
                setLoading(false)
            });
    }, [triggerUseEffect]);

    const getEmployeeTrainings = async () => {
        const url = `${baseUrl}/api/employee_trainings/${id}`;
        const response = await axios.get(url);
        return response.data
    };

    const formatData = (data) => {
        let myData = [];
        data.map(t => myData.push({...t, key: t.id}));
        return myData
    };

    const handleAddEmployeeTraining = async () => {
        setLoading2(true);
        setModelVisible(true);
        const {trainings} = await getAllTrainings();
        setAllTrainings(formatData(trainings));
        setLoading2(false);
    };
    const handleOk = () => setModelVisible(false);
    const handleCancel = () => {
        setModelVisible(false);
        setSelectedTrainingRows([])
    };
    const hideHandler = () => {
        setVisible_showpromoteModal(false);
        setLoading(true);
        setTabledata(null);
        getEmployeeTrainings();
    };

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
        setSearchText(selectedKeys[0]);
    };
    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };
    const columns = [
        {
            ellipsis: true,
            title: 'title',
            dataIndex: 'title',
            key: 'title',
            width: '20%'
        },
        {
            ellipsis: true,
            title: 'Description',
            dataIndex: 'description',
            key: 'Description'
        },
        {
            ellipsis: true,
            title: 'Offered By',
            dataIndex: 'offered_by',
            key: 'offered_by'
        },
        {
            ellipsis: true,
            title: 'funded By',
            dataIndex: 'funded_by',
            key: 'funded_by'
        },
        {
            ellipsis: true,
            title: 'Category',
            dataIndex: 'category',
            key: 'category'
        },
        {
            ellipsis: true,
            title: 'Address',
            dataIndex: 'address',
            key: 'address'
        },
        {
            ellipsis: true,
            title: 'Start Date',
            dataIndex: 'Start_date',
            key: 'Start_date',
            render: (text, record) => (
                <span>{moment(record.Start_date).format("Do MMM YYYY")}</span>
            )
        },
        {
            ellipsis: true,
            title: 'End Date',
            dataIndex: 'End_date',
            key: 'End_date',
            render: (text, record) => (
                <span>{moment(record.End_date).format("Do MMM YYYY")}</span>
            )
        }
    ];
    const getAllTrainings = async () => {
        const {token} = parseCookies(ctx);
        if (!token) redirectUser(ctx, "/signin");

        const payload = {headers: {Authorization: token}};
        const url = `${baseUrl}/api/trainings`;

        const response = await axios.get(url, payload);
        return {trainings: response.data.trainings}
    };
    const columns2 = [
        {
            ellipsis: true,
            title: 'title',
            dataIndex: 'title',
            key: 'title',
            width: '20%'
        },
        {
            ellipsis: true,
            title: 'Description',
            dataIndex: 'description',
            key: 'Description'
        },
        {
            ellipsis: true,
            title: 'Offered By',
            dataIndex: 'offered_by',
            key: 'offered_by'
        },
        {
            ellipsis: true,
            title: 'funded By',
            dataIndex: 'funded_by',
            key: 'funded_by'
        },
        {
            ellipsis: true,
            title: 'Category',
            dataIndex: 'category',
            key: 'category'
        },
        {
            ellipsis: true,
            title: 'Address',
            dataIndex: 'address',
            key: 'address'
        },
        {
            ellipsis: true,
            title: 'Start Date',
            dataIndex: 'Start_date',
            key: 'Start_date',
            render: (text, record) => (
                <span>{moment(record.Start_date).format("Do MMM YYYY")}</span>
            )
        },
        {
            ellipsis: true,
            title: 'End Date',
            dataIndex: 'End_date',
            key: 'End_date',
            render: (text, record) => (
                <span>{moment(record.End_date).format("Do MMM YYYY")}</span>
            )
        }
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedTrainingRows(selectedRows)
        },
        getCheckboxProps: record => ({
            disabled: tabledata.filter(id => id.key === record.key).length > 0, // Column configuration not to be checked
            name: "AlL ddlm"
        }),
    };

    const handleConfirm = async () => {
        setModelVisible(false);
        if (selectedTrainingRows.length > 0) {
            const payload = {employee_id: id, t_ids: selectedTrainingRows.flatMap(value => value.id)};
            const url = `${baseUrl}/api/add_employee_trainings`;
            const response = await axios.post(url, payload);
            if (response.status === 200) {
                message.success('Training Added ', 3);
                setTriggerUseEffect(!triggerUseEffect)
            }
        }
    };
    const modelContent = (
        <Card bordered={false}
              title={<strong className={'text-large font-weight-bold'}>Add {employee.full_name}'s Trainings</strong>}>
            <><Table loading={loading2} rowSelection={rowSelection}
                     columns={columns2} dataSource={allTrainings} scroll={{x: 1200}}/>
                <Divider/>
                <div className='flex-justify-content'>
                    {(selectedTrainingRows.length > 0) &&
                    <Button size={"large"} className='mr-2' loading={loading2}
                            disabled={selectedTrainingRows.length === 0 || loading2} onClick={handleConfirm}
                            style={{backgroundColor: '#0a8080', color: 'white'}}>Confirm</Button>}
                    <Button size={"large"} onClick={handleCancel}>Cancel</Button>
                </div>
            </>
        </Card>
    );
    return (
        <>
            <Card className='mb-2'>
                <Skeleton loading={!categoryData} active>
                    {(categoryData && categoryData.length > 0) &&
                        <div className="card-body">
                            <List18 categoryData={categoryData}/>
                        </div>}
                </Skeleton>

            </Card>
            <Button style={{backgroundColor: '#0a8080', color: 'white'}} size={"large"}
                    onClick={handleAddEmployeeTraining}> Add {employee.full_name}'s Trainings </Button>
            <Table className='mt-2' loading={loading} columns={columns} dataSource={tabledata} pagination={false} scroll={{x: 1200}}
                   onRow={(record, rowIndex) => ({onClick: event => Router.push(`/trainings/${record.id}`)})}/>
            <Modal
                destroyOnClose={true} width={'100%'}
                visible={modelVisible} onCancel={handleCancel}
                footer={null} closable={false}>
                {modelContent}
            </Modal>
        </>
    );
}
