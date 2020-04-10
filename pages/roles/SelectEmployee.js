import React, {useEffect, useState} from 'react';
import {message, Select, Spin} from 'antd';
import debounce from 'lodash/debounce';
import baseUrl from "../../utils/baseUrl";
import axios from "axios";

const {Option} = Select;

export default function UserRemoteSelect({getValues}) {
    const [data, setData] = useState([]);
    const [value, setValue] = useState([]);
    const [fetching, setFetching] = useState(false);
    let lastFetchId = 0;
    let fetchUser = async value => {
        value = value.trim();
        if (value.length > 3) {
            console.log('fetching user', value);
            lastFetchId += 1;
            const fetchId = lastFetchId;
            setData([]);

            try {
                const url = `${baseUrl}/api/employee_list/${value}`;
                let {data} = await axios.get(url);
                if (fetchId !== lastFetchId) {
                    // for fetch callback order
                    return;
                }
                data = data.map(user => ({
                    text: `${user.full_name}`,
                    value: user.employee_id,
                }));
                setData(data);
            }
            catch (e) {
                message.error('No employee found')
            }
            finally {
                setFetching(false);
            }
        }
    };

    fetchUser =  debounce(fetchUser, 800);


    const handleChange = value => {
        getValues(value);//prop
        setValue(value);
        setData([]);
        setFetching(false);
    };

    return (
        <div className='select-employee'>
            <Select
                mode="multiple"
                size='large'
                allowClear={true}
                labelInValue
                value={value}
                placeholder="type 3+ letters of employee Name to Select"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={fetchUser}
                maxTagCount={10}
                onChange={handleChange}
                style={{width: '100%' }}
            >
                {data.map(d => (
                    <Option key={d.value}>{d.text}</Option>
                ))}
            </Select>
        </div>


    );
}
