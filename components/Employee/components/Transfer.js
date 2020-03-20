import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Badge, Button, Card, Col, Icon, Input, Modal, Table} from "antd";
import TransfersComponent from "./TransfersComponent";
import baseUrl from "../../../utils/baseUrl";
import Link from "next/link";
import moment from "moment";

export default function Transfer({id, employee}) {
    const [loading, setLoading] = useState(false);
    const [tabledata, setTabledata] = useState(null);
    const [visible_showpromoteModal, setVisible_showpromoteModal] = useState(false);
    const [searchText, setSearchText] = useState(false);
    const searchInput = useRef(null);

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handlePreview = async file => {
        setPreviewImage(file);
        setPreviewVisible(true)
    };

    useEffect(() => {
        getTransferData()
    }, []);
    const getTransferData = () => {
        fetch(baseUrl + `/api/employee_transfer_details/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                setTabledata(getformateData(data));
                setLoading(false);
            })
    };
    const getformateData = (data) => {
        let mydata = [];
        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            mydata.push({
                key: d.transfer_id,
                Transfer_Date: d.transfer_date.substring(0, 10),
                Joining_Date: d.joining_date.substring(0, 10),
                Description: d.description,
                Division: d.Division,
                Sub_Division: d.Sub_Division,
                Tubewell: d.Tubewell,
                status: d.is_active,
                photo: d.order_letter_photo,
            })
        }
        return mydata
    };

    const showpromoteModal = () => setVisible_showpromoteModal(true);
    const handleOk = () => setVisible_showpromoteModal(false);
    const handleCancel = () => setVisible_showpromoteModal(false);
    const hideHandler = () => {
        setVisible_showpromoteModal(false);
        setLoading(true);
        setTabledata(null);
        getTransferData();
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
        }/*,
        render: text => (
            <Highlighter
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),*/
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
            title: 'Transfer Date',
            dataIndex: 'Transfer_Date',
            render: (text, record) => (
                <span>{moment(record.Transfer_Date).format("Do MMM YYYY")}</span>
            ),
            ...getColumnSearchProps('Transfer_Date'),

        },
        {
            ellipsis: true,
            title: 'Joining Date',
            dataIndex: 'Joining_Date',
            render: (text, record) => (
                <span>{moment(record.Joining_Date).format("Do MMM YYYY")}</span>
            ),
            ...getColumnSearchProps('Joining_Date'),

        },
        {
            ellipsis: true,
            title: 'Description ',
            dataIndex: 'Description',
            ...getColumnSearchProps('Description'),

        },
        {
            ellipsis: true,
            title: 'Division',
            dataIndex: 'Division',
            ...getColumnSearchProps('Division'),

        },
        {
            ellipsis: true,
            title: 'Sub Division',
            dataIndex: 'Sub_Division',
            ...getColumnSearchProps('Sub_Division'),

        },
        {
            ellipsis: true,
            title: 'Tubewell',
            dataIndex: 'Tubewell',
            ...getColumnSearchProps('Tubewell'),

        },
        {
            ellipsis: true,
            title: 'Status',
            dataIndex: 'status',
            render: (text, record) => (
                <span>
                   {(record.status === 0) ? <Badge status="default" text="Not Active"/> :
                       <Badge status="processing" text="Active"/>}
                </span>
            ),

        },
        {
            ellipsis: true,
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <span>
                    <Link>
                      <a onClick={() => handlePreview(baseUrl + `/${record.photo}`)}>
                          <Icon type="eye" theme="twoTone" title='View Order Letter photo' /></a>
                    </Link>
                </span>
            ),
        },
    ];
    let placeholderAvatarURL = './../../static/placeholderAvatar.svg';
    return (
        <>
            {(!loading) &&
            <>
                <Col >
                    <Button style={{backgroundColor: '#0a8080', color: 'white'}} size={"large"} onClick={showpromoteModal}>
                        Transfer {employee.full_name}
                    </Button>
                    <div className='pt-3'>
                        <Table columns={columns} dataSource={tabledata} pagination={false} scroll={{x: 1200}}/>
                    </div>

                    <Modal
                        width={780}
                        destroyOnClose={true}
                        visible={visible_showpromoteModal}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                        closable={false}>
                        <Card bordered={false}
                              title={<strong className={'text-large font-weight-bold'}>Transfer Employee</strong>}>
                            <TransfersComponent handleOk={handleOk} hideHandler={hideHandler}
                                                id={id} data={tabledata}/>
                        </Card>
                    </Modal>
                </Col>
                <Modal
                    visible={previewVisible}
                    onCancel={() => setPreviewVisible(false)}
                    footer={null}>
                    <img alt="example" style={{width: '100%'}} src={previewImage} placeholder={placeholderAvatarURL}/>
                </Modal>
            </>
            }
        </>
    );
}
