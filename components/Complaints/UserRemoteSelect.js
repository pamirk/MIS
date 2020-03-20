import React, {Component} from 'react';
import {Select, Spin} from 'antd';
import debounce from 'lodash/debounce';
import baseUrl from "../../utils/baseUrl";

const {Option} = Select;

export default class UserRemoteSelect extends React.Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 100);
    }

    state = {
        data: [],
        value: [],
        fetching: false,
    };

    fetchUser = value => {
        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({data: [], fetching: true});
        fetch(baseUrl + '/api/employee_list')
            .then(response => response.json())
            .then(body => {
                if (fetchId !== this.lastFetchId) {
                    // for fetch callback order
                    return;
                }
                console.log(body);

                const data = body.map(user => ({
                    text: `${user.full_name}`,
                    value: user.employee_id,
                }));
                this.setState({data, fetching: false});
            });
    };

    handleChange = value => {
        console.log("handleChange called from userRemote", value);

        this.setState({
            value,
            data: [],
            fetching: false,
        }, function () {
            this.props.confirmBtnClicked(value);
        });
    };

    render() {
        const {fetching, data, value} = this.state;
        return (
            <>
                <Select
                    mode="multiple"
                    className='w-100'
                    labelInValue
                    value={value}
                    placeholder="Select users"
                    notFoundContent={fetching ? <Spin size="small"/> : null}
                    filterOption={false}
                    onSearch={this.fetchUser}
                    onChange={this.handleChange}
                >
                    {data.map(d => (
                        <Option key={d.value}>{d.text}</Option>
                    ))}
                </Select>
            </>


        );
    }
}
