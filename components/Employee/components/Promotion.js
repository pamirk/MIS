import * as React from 'react';
import {Badge, Button, Card, Col, Icon, Input, Modal, Table} from "antd";
import PromoteDesignation from "./PromoteDesignation";
import Highlighter from "react-highlight-words";

import {Component} from "react";
import baseUrl, {awsb} from "../../../utils/baseUrl";
import Link from "next/link";
import {useState} from "react";
import {useRef} from "react";
import {useEffect} from "react";
import {LEAVE_STATUS} from "../../../server/utils/status";
import PromotionComponent from "./PromotionComponent";

export default function Promotion({designations, id, employee}) {
    const [loading, setLoading] = useState(false);
    const [visible_showpromoteModal, setVisible_showpromoteModal] = useState(false);
    const [tabledata, setTabledata] = useState(null);
    const [data, setData] = useState(designations);
    const [searchText, setSearchText] = useState(false);
    const [Indexkey, setIndexkey] = useState(0);
    const searchInput = useRef(null);

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handlePreview = async file => {
        setPreviewImage(file);
        setPreviewVisible(true)
    };

    useEffect(() => setTabledata(getformateData(designations)), []);
    const getDesignationData = () => {
        fetch(baseUrl + `/api/employee_designation_details/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                setData(data);
                setTabledata(getformateData(data));
                setLoading(false);
            })
    };

    const getformateData = (data) => {
        let mydata = [];
        for (let i = 0; i < data.length; i++) {
            const des = data[i];
            mydata.push({
                key: des.emp_des_id,
                duration: des.emp_des_appointment_date.substring(0, 10),
                title: des.des_title,
                scale: des.des_scale,
                department_name: des.department_name,
                department_location: des.department_city_name,
                status: des.emp_des_is_active,
                photo: des.emp_des_order_letter_photo,
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
        getDesignationData();
    };
    const handleCancelProp = () => setVisible_showpromoteModal(false);

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
            title: 'Join Date',
            dataIndex: 'duration',
            ...getColumnSearchProps('duration'),

        },
        {
            ellipsis: true,
            title: 'Title',
            dataIndex: 'title',
            ...getColumnSearchProps('title'),

        },
        {
            ellipsis: true,
            title: 'Scale',
            dataIndex: 'scale',
            ...getColumnSearchProps('scale'),

        },
        {
            ellipsis: true,
            title: 'Department Name',
            dataIndex: 'department_name',
            ...getColumnSearchProps('department_name'),

        },
        {
            ellipsis: true,
            title: 'Department Location',
            dataIndex: 'department_location',
            ...getColumnSearchProps('department_location'),

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
                      <a onClick={() => handlePreview(awsb + `/${record.photo}`)}>
                          <Icon type="eye" theme="twoTone" title='View Order Letter photo' /></a>
                    </Link>
                </span>
            ),
        },
    ];

    return (
        <>
            {(!loading) &&
            <>
                <div>
                    <Button className='mt-2' style={{backgroundColor: '#0a8080', color: 'white'}} size={"large"} onClick={showpromoteModal}>
                        Give {employee.full_name} Promotion
                    </Button>
                    <div className='mt-3'>
                        <Table columns={columns} dataSource={tabledata} pagination={false} scroll={{x: 1200}}/>
                    </div>
                    <Modal width={780}
                        visible={visible_showpromoteModal} onOk={handleOk}
                        destroyOnClose={true} onCancel={handleCancel}
                        footer={null} closable={false}>
                        <Card bordered={false}
                              title={<strong className={'text-large font-weight-bold'}>Promote Employee</strong>}>
                            <PromotionComponent Indexkey={Indexkey} hideHandler={hideHandler} id={id} data={data} handleCancelProp={handleCancelProp}/>
                        </Card>

                    </Modal>


                    <Modal visible={previewVisible}
                        onCancel={() => setPreviewVisible(false)} footer={null}>
                        <img alt="example" style={{width: '100%'}} src={previewImage} />
                    </Modal>
                </div>
            </>
            }
        </>
    );
}
