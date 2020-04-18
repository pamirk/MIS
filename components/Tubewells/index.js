import React, {useEffect, useRef, useState} from "react";
import moment from "moment";
import {
    Button,
    Card,
    Checkbox,
    DatePicker,
    Divider,
    Form,
    Icon,
    Input,
    message,
    Modal,
    Select,
    Table,
    Tooltip
} from "antd";
import catchErrors from "../../utils/catchErrors";
import Highlighter from "react-highlight-words";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import Router from 'next/router';
import Link from "next/link";

const {Option} = Select;
const {TextArea} = Input;
const FormItem = Form.Item;


function index({tubewells, google, form, form: {getFieldDecorator, validateFields}}) {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredtubewells, setFilteredtubewells] = useState([]);

    const [searchText, setSearchText] = useState('');
    const searchInput = useRef(null);
    const [updateModelVisible, setUpdateModelVisible] = useState(false);
    const [viewModelVisible, setViewModelVisible] = useState(false);

    const [tubewell, setTubewell] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0])
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('')
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
                textToHighlight={(text) && text.toString()}
            />
        ),
    });

    useEffect(() => {
        let mydata = [];
        for (let i = 0; i < tubewells.length; i++) {
            const tw = tubewells[i];
            mydata.push({
                key: tw.tubewell_id,
                tubewell_name: tw.tubewell_name,
                status: tw.status_title,
                status_date_change: tw.status_date_change ? moment(tw.status_date_change).format('YYYY-MM-DD') : "N/A",
            })
        }
        setData(mydata)
    }, []);
    useEffect(() => {
        if (tubewell) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                obj[key] = tubewell[key] || null;
                form.setFieldsValue(obj);
            });
        }
    }, [tubewell]);

    const columns = [
        {
            ellipsis: true,
            title: 'Name',
            dataIndex: 'tubewell_name',
            key: 'tubewell_name',
            ...getColumnSearchProps('tubewell_name'),
            render: (text, r) => (
                <span><Link href={`tubewells/${r.key}`} ><a>{r.tubewell_name}</a></Link></span>
            ),
        },
        {
            ellipsis: true,
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            ...getColumnSearchProps('status'),

        },
        {
            ellipsis: true,
            title: 'Status date',
            dataIndex: 'status_date_change',
            key: 'status_date_change',
            width: '12%',
            ...getColumnSearchProps('status_date_change'),
        }
    ];

    function handleSubmit(e) {
        e.preventDefault();
        validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                try {
                    const payload = {...values, sub_div_id: tubewell.sub_div_id, tubewell_id: tubewell.key};
                    console.log(payload);
                    const url = `${baseUrl}/api/update_tubewell`;
                    const response = await axios.post(url, payload);
                    if (response.status === 200) {
                        message.success('tubewell Added ', 3);

                    }
                } catch (error) {
                    message.error(catchErrors(error));

                } finally {
                    setLoading(false);
                }
            }
        });
    }

    function handleCancel() {
        setUpdateModelVisible(false)
    }

    return (<>
        <Button className='mb-3' style={{backgroundColor: '#0a8080', color: 'white'}} size={"large"}
                onClick={() => setUpdateModelVisible(true)}>
            Add new Tubewell
        </Button>
        <Table className='p-2' style={{backgroundColor: "white"}} loading={loading}
               columns={columns} dataSource={data} scroll={{x: 1000}}
               /*onRow={(record, rowIndex) => ({
                       onClick: event => {
                           setTubewell(record);
                           setViewModelVisible(true)
                       } // click row
                   }
               )}*/
        />

        {(tubewell) && <Modal destroyOnClose={true}
                              width={780}
                              visible={updateModelVisible}
                              onOk={() => setUpdateModelVisible(false)}
                              onCancel={() => setUpdateModelVisible(false)}
                              footer={null}
                              closable={false}>
            <Card bordered={false}
                  title={<span className='text-large font-weight-bolder'>Update Tubewell Details</span>}>
                <div className='text-large'>Fill out the form below to Update Tubewell Details</div>


                <div className='p-5'>
                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            <dt className="col-xl-3 p-4  font-weight-bold">Tubewell Name:</dt>
                            <dd className="col-xl-9 p-4">
                                <FormItem>
                                    {getFieldDecorator('tubewell_name', {
                                        rules: [{required: true, message: 'Name is required'}],
                                    })(<Input size='large' className='w-100' placeholder='Name'/>)}
                                </FormItem>
                            </dd>

                            <dt className="col-xl-3 p-4  font-weight-bold">Rock Type:</dt>
                            <dd className="col-xl-9 p-4">
                                <FormItem>
                                    {getFieldDecorator('rock_type', {
                                        rules: [{required: true, message: 'Rock Type is required'}],
                                    })(<Input size='large' className='w-100' placeholder='Alluvial'/>)}
                                </FormItem>
                            </dd>
                            <dt className="col-xl-3 p-4 font-weight-bold">Install Date</dt>
                            <dd className="col-xl-9 p-4 ">
                                <FormItem>
                                    {getFieldDecorator('install_date', {
                                        rules: [{
                                            required: true,
                                            message: 'Please provide Install Date!'
                                        }]
                                    })(
                                        <DatePicker size='large' format='YYYY-MM-DD' className='w-100'
                                                    placeholder='11/02/2019'/>
                                    )}
                                </FormItem>
                            </dd>
                            <dt className="col-xl-3 p-4 font-weight-bold">Elevation</dt>
                            <dd className="col-xl-9 p-4 ">
                                <FormItem>
                                    {getFieldDecorator('elevation', {
                                        rules: [{
                                            required: true,
                                            message: 'Please provide Install Date!'
                                        }]
                                    })(
                                        <Input size='large' className='w-100' placeholder='5453 ± 3m'/>
                                    )}
                                </FormItem>
                            </dd>
                            {/*<dt className="col-xl-3 p-4 font-weight-bold">Status</dt>
                            <dd className="col-xl-9 p-4 ">
                                <FormItem>
                                    {getFieldDecorator('status', {
                                        rules: [{
                                            required: true,
                                            message: 'Please provide Install Date!'
                                        }]
                                    })(
                                        <Input size='large' className='w-100' placeholder='inactive since last week'/>
                                    )}
                                </FormItem>
                            </dd>*/}

                            <dt className="col-xl-3 p-4 font-weight-bold">Phone</dt>
                            <dd className="col-xl-9 p-4 ">
                                <FormItem>
                                    {getFieldDecorator('phone1', {
                                        rules: [{
                                            required: true,
                                            message: 'Please provide Install Date!'
                                        }]
                                    })(
                                        <Input size='large' type='number' className='w-100' placeholder='0333333333'/>
                                    )}
                                </FormItem>
                            </dd>
                            <dt className="col-xl-3 p-4 font-weight-bold">Lat</dt>
                            <dd className="col-xl-9 p-4 ">
                                <FormItem>
                                    {getFieldDecorator('lat', {
                                        rules: [{
                                            required: true,
                                            message: 'Please provide lat!'
                                        }]
                                    })(
                                        <Input size='large' type='number' className='w-100' placeholder='lat'/>
                                    )}
                                </FormItem>
                            </dd>
                            <dt className="col-xl-3 p-4 font-weight-bold">Lng</dt>
                            <dd className="col-xl-9 p-4 ">
                                <FormItem>
                                    {getFieldDecorator('lng', {
                                        rules: [{
                                            required: true,
                                            message: 'Please provide Lng'
                                        }]
                                    })(
                                        <Input size='large' type='number' className='w-100' placeholder='lng'/>
                                    )}
                                </FormItem>
                            </dd>
                            <dt className="col-xl-3 p-4 font-weight-bold">Address</dt>
                            <dd className="col-xl-9 p-4 ">
                                <FormItem>
                                    {getFieldDecorator('address', {
                                        rules: [{
                                            required: true,
                                            message: 'Please provide Install Date!'
                                        }]
                                    })(
                                        <TextArea rows={8} size='large' type='number' className='w-100'/>
                                    )}
                                </FormItem>
                            </dd>
                            <dt className="col-xl-3 p-4 font-weight-bold"/>
                            <dd className="col-xl-9 p-4 ">
                                <FormItem>
                                    {getFieldDecorator('is_office', {valuePropName: 'checked'})(
                                        <Checkbox>is Office</Checkbox>
                                    )}
                                </FormItem>
                            </dd>
                        </div>
                        <Divider/>
                        <div className='flex-justify-content'>
                            <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                                    disabled={loading}
                                    style={{backgroundColor: '#0a8080', color: 'white'}}>Update</Button>
                            <Button size={"large"} disabled={loading} onClick={handleCancel}>Cancel</Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </Modal>}

        {(tubewell) && <Modal
            width={780}
            visible={viewModelVisible}
            onOk={() => setViewModelVisible(false)}
            onCancel={() => setViewModelVisible(false)}
            footer={null}
            closable={false}>
            <Card bordered={false}
                  title={<strong className={'text-large font-weight-bold'}>Tubewell Details</strong>}>

                <div>
                    <dl className="row centered p-5">
                        <dt className="col-xl-3 p-3  font-weight-bold">Tubewell Name:</dt>
                        <dd className="col-xl-9 p-3">{tubewell.tubewell_name}</dd>
                        <dt className="col-xl-3 p-3 font-weight-bold">Rock Type:</dt>
                        <dd className="col-xl-9 p-3 ">{tubewell.rock_type}</dd>
                        <dt className="col-xl-3 p-3 font-weight-bold">Install Date:</dt>
                        <dd className="col-xl-9 p-3 ">{moment(tubewell.install_date).format('YYYY-MM-DD')}</dd>
                        <dt className="col-xl-3 p-3 font-weight-bold">Elevation:</dt>
                        <dd className="col-xl-9 p-3 ">{tubewell.elevation}</dd>
                        <dt className="col-xl-3 p-3 font-weight-bold">Status:</dt>
                        <dd className="col-xl-7 p-3 ">{(tubewell.status) ? tubewell.status : 'Unknown'}</dd>
                        <dd className="col-xl-2 p-3 "><Icon theme="twoTone" type='edit'/></dd>
                        <dt className="col-xl-3 p-3 font-weight-bold">Is Office:</dt>
                        <dd className="col-xl-9 p-3 ">{(tubewell.is_office) ? "YES" : "NO"}</dd>
                        <dt className="col-xl-3 p-3 font-weight-bold">Phone Number:</dt>
                        <dd className="col-xl-9 p-3 ">{tubewell.phone1}</dd>
                        <dt className="col-xl-3 p-3 font-weight-bold">Address:</dt>
                        <dd className="col-xl-9 p-3 ">{tubewell.address}</dd>
                        <dt className="col-xl-3 p-3 font-weight-bold">Lat and Lng:</dt>
                        <dd className="col-xl-9 p-3 ">{tubewell.lat} {tubewell.lng}</dd>

                    </dl>
                    <Divider/>
                    <div className={'flex-justify-content'}>
                        <Button size={"large"} className='mr-2'
                                style={{backgroundColor: '#0a8080', color: 'white'}}
                                onClick={() => setViewModelVisible(false)}>Looks Good</Button>
                    </div>

                    <div className={'flex-justify-content'}>
                        <Button onClick={() => setUpdateModelVisible(true)} size={"large"} type="link"
                                style={{color: '#234361'}}>Edit</Button>
                    </div>


                </div>
            </Card>
        </Modal>}

    </>);
}

export default Form.create()(index);

