import {Button, DatePicker, Divider, Form, Input, message, Select} from 'antd';
import * as React from 'react';
import {useEffect, useState} from 'react';
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import catchErrors from "../../../utils/catchErrors";

const {TextArea} = Input;

const FormItem = Form.Item;
const {Option} = Select;


function TransferComponent({handleOk, hideHandler, id, data, form}) {
    const [transfer_Date, setTransfer_Date] = useState(false);
    const [joining_Date, setJoining_Date] = useState(false);
    const [divisions, setDivisions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fimage, setFimage] = useState('');
    const [image, setImage] = useState(null);
    const [departs, setDeparts] = useState(null);
    const [sub_Div_Items, setSub_Div_Items] = useState(null);
    const [tubwell_Items, setTubwell_Items] = useState(null);

    useEffect(() => {
        setBaseInfo();
        getDivisionList();
    }, []);

    const getDivisionList = () => {
        let items = [];
        fetch(baseUrl + '/api/division_list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                for (let i = 1; i <= data.length; i++) {
                    const division = data[i - 1];
                    items.push(<Option value={division.div_id}>{division.div_title}</Option>)
                }
                setDivisions(items);
            })
    };
    const setBaseInfo = () => {
        if (data) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                // @ts-ignore
                obj[key] = data[key] || null;
                form.setFieldsValue(obj);
            });
        }
    };
    const handlerSubmit = (event) => {
        event.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                try {
                    setLoading(true);
                    getDataOutofForm();
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    setLoading(false);
                }
            }
        });
    };
    const getDataOutofForm = async () => {
        const fd = new FormData();
        Object.keys(form.getFieldsValue()).forEach((value, key, data) => fd.append(value, form.getFieldValue(value)));
        fd.append("employee_id", id);
        fd.append('image', image, image.name);
        const url = `${baseUrl}/api/transfer_emoployee`;
        const response = await axios.post(url, fd);
        const {status} = response.data;
        if (status === 200) {
            message.success("Updated Successfully", 5);
            hideHandler()
        } else if (status === 500) {
            message.error("Error while performing Action ", 2);
        }

    };
    const onDivisionValueSelected = (e) => getSubDivisionsList(e);
    const onSubDivisionValueSelected = (e) => getTubwellsList(e);
    const getTubwellsList = (e) => {
        let items = [];
        fetch(baseUrl + `/api/tubwells_list/${e}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                for (let i = 1; i <= data.length; i++) {
                    const sub_div = data[i - 1];
                    items.push(<Option value={sub_div.tubewell_id}>{sub_div.tubewell_name}</Option>)
                }
                setTubwell_Items(items);
            })

    };
    const getSubDivisionsList = (e) => {
        let items = [];
        fetch(baseUrl + `/api/sub_division_list/${e}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                for (let i = 1; i <= data.length; i++) {
                    const sub_div = data[i - 1];
                    items.push(
                        <Option value={sub_div.sd_id}>{sub_div.sub_div_name}</Option>)
                }
                setSub_Div_Items(items);
            })

    };
    const disabledStartDate = (startValue) => {
        if (!startValue || !joining_Date) {
            return false;
        }
        return startValue.valueOf() > joining_Date.valueOf();
    };
    const disabledEndDate = (endValue) => {
        if (!endValue || !transfer_Date) {
            return false;
        }
        return endValue.valueOf() <= transfer_Date.valueOf();
    };
    const onImageDataChange = (e) => {
        let files = e.target.files;
        if (files && files[0]) {
            setImage(files[0]);
        }
    };
    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 16},
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };
    const {getFieldDecorator} = form;
    return (
        <div className='p-5'>
            <Form onSubmit={handlerSubmit} {...formItemLayout} >
                <FormItem label="Division">{
                    getFieldDecorator('Division', {
                        rules: [{required: true, message: "Division not selected"}]
                    })(
                        <Select size='large' onChange={onDivisionValueSelected}>
                            {divisions}
                        </Select>
                    )}
                </FormItem>
                <FormItem label="Sub Division">{
                    getFieldDecorator('Sub_Division', {
                        rules: [{required: true, message: "SubDivision not selected"}]
                    })(
                        <Select size='large' onChange={onSubDivisionValueSelected}>
                            {sub_Div_Items}
                        </Select>
                    )}
                </FormItem>
                <FormItem label="Tubewell Name">{
                    getFieldDecorator('tubewell_id', {
                        rules: [{required: true, message: "Tubewell not selected"}]
                    })(
                        <Select size='large'>
                            {tubwell_Items}
                        </Select>
                    )}
                </FormItem>
                <FormItem label="transfer Date">{
                    getFieldDecorator('transfer_Date', {
                        rules: [{required: true, message: "Please Provide Transfer Date"}]
                    })(<DatePicker size='large' className='w-100' format="YYYY-MM-DD" disabledDate={disabledStartDate}
                                   onChange={v => setTransfer_Date(v)} placeholder="Provide Transfer Date"/>)}
                </FormItem>
                <FormItem label="joining Date">{
                    getFieldDecorator('joining_Date', {
                        rules: [{required: true, message: "Please Provide Joining Date"}]
                    })(
                        <DatePicker size='large' className='w-100' format="YYYY-MM-DD" disabledDate={disabledEndDate}
                                    onChange={v => setJoining_Date(v)} placeholder="Provide Joining Date"/>
                    )}
                </FormItem>
                <FormItem label="Descrition">{
                    getFieldDecorator('description', {
                        rules: [{required: true, min: 10, message: "Descrition not valid (min 10)"}]
                    })(<TextArea rows={4}/>)}
                </FormItem>
                <FormItem label="Order Letter">{
                    getFieldDecorator('image', {rules: [{required: true, message: "please provide order letter photo"}]})
                    (<Input onChange={onImageDataChange} type='file' size='large' title='Order Letter Photo'/>)}
                </FormItem>
                <Divider/>
                <div className='flex-justify-content'>
                    <Button size={"large"} className='mr-2' htmlType="submit" loading={loading}
                            disabled={loading}
                            style={{backgroundColor: '#0a8080', color: 'white'}}>Submit</Button>
                    <Button onClick={handleOk} size={"large"}>Cancel</Button>
                </div>
            </Form>
        </div>
    );
}


export default Form.create()(TransferComponent);
