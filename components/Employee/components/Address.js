import * as React from 'react';
import {Component} from "react";
import {Button, Card, Divider, Form, Icon, Modal, Table} from 'antd';
import AddressComponent from "./addressComponent";
import baseUrl from "../../../utils/baseUrl";
import Link from "next/link";
import {useState, useEffect} from "react";
import AddAddressDetails from "./AddAddressDetails";
import EditAddressDetails from "./EditAddressDetails";

export default function Address({handleCancel, id, address_data, type}) {
    const [loading, setLoading] = useState(false);
    const [showEditAddressModal, setShowEditAddressModal] = useState(false);
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [data, setData] = useState(null);
    const [itemkey, setItemkey] = useState(null);

    useEffect(() => {
        setData(getformateData(address_data))
    }, []);


    const getaddressData = () => {
        fetch(baseUrl + `/api/show_one_employee_address/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                setLoading(false)
                setData(getformateData(data))
            })
    };

    const getformateData = (data) => {
        let mydata = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].type !== type) continue
            const address = data[i];
            mydata.push({
                key: address.address_id,
                date: address.last_update_ts.substring(0, 10),
                address: address.current_address + "\n" + address.permanent_address + address.postal_code,
                is_current: address.is_current
            })
        }
        return mydata
    };

    const columns = [
        {
            title: 'Move-in Date',
            dataIndex: 'date',
            render: (text, record) => (
                <span>{(record.is_current) ? record.date + " (Current)" : record.date}</span>
            ),
        },
        {
            title: 'Home Address',
            dataIndex: 'address',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <span>
                        <Link>
                          <a onClick={() => {
                              console.log(record.key);
                              setItemkey(record.key)
                              setShowEditAddressModal(true)
                          }}>Edit</a>
                      </Link>
                    </span>
            ),

        },
    ];
    const showEditAddress = () => setShowEditAddressModal(true)
    const handleOk = () => setShowEditAddressModal(false)
    const handleCancel2 = () => setShowEditAddressModal(false)

    const hideHandler = () => {
        setShowEditAddressModal(false)
        setLoading(true)
        getaddressData();
    };

    const showAddAddress = () => setShowAddAddressModal(true)
    const addAddressHandleOk = () => setShowAddAddressModal(false)
    const addAddressHandleCancel = () => setShowAddAddressModal(false)
    const addAddressHideHandler = () => {
        setShowAddAddressModal(false)
        getaddressData()
    };
    return (
        <>
            <>
                {(!loading) &&
                <>
                    <Table pagination={false} columns={columns} dataSource={data} size="small"/>

                    <div className="text-left mt-3 mr-3 mb-5">
                        <Button onClick={showAddAddress}
                                style={{backgroundColor: '#0a8080', color: 'white'}} size={"large"}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Icon className='mr-1' type='plus-circle'/>
                                <span>add New Address </span>
                            </div>
                        </Button>
                    </div>

                    <Divider/>
                    <div className='flex-justify-content'>
                        <Button onClick={handleCancel} size={"large"}>Looks Good</Button>
                    </div>
                    <Modal
                        visible={showEditAddressModal}
                        destroyOnClose={true}
                        onOk={handleOk}
                        onCancel={handleCancel2}
                        width={780}
                        footer={null}
                        closable={false}>

                        <Card bordered={false}
                              title={<strong className={'text-large font-weight-bold'}>Update Home Address</strong>}>
                            <p>This information is used for all HR related tasks, so please make sure it’s
                                accurate.</p>
                            {(data) &&
                            <EditAddressDetails hideHandler={hideHandler} id={id} handleCancel={handleCancel2}
                                                itemkey={itemkey} data={address_data[0]}/>
                            }
                        </Card>
                    </Modal>

                    <Modal
                        visible={showAddAddressModal}
                        destroyOnClose={true}
                        onOk={addAddressHandleOk}
                        onCancel={addAddressHandleCancel}
                        width={780}
                        footer={null}
                        closable={false}>

                        <Card bordered={false}
                              title={<strong className={'text-large font-weight-bold'}>Add Address</strong>}>
                            <p>This information is used for all HR related tasks, so please make sure it’s
                                accurate.</p>
                            {(data) &&
                            <AddAddressDetails type={type} hideHandler={addAddressHideHandler} id={id} handleCancel={addAddressHandleCancel} />
                            }
                        </Card>
                    </Modal>
                </>
                }
            </>
        </>
    );
}
