import {Button, Form, Col, Icon, Input, message, Switch, Card, Checkbox} from 'antd';
import * as React from 'react';
import {Component} from 'react';
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import {Check, Lock} from "react-feather";
import {Table} from "reactstrap";

class AccountSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount() {
        this.getData()

    }

    onStatusChange = (checked) => {
        this.setState({
            status: checked
        });

        console.log(`switch to ${checked}`);
        this.postStatusData(checked);
    };
    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({loading: true,});
        const fd = new FormData();
        fd.append('id', this.props.id);
        fd.append('password', this.password.value);

        axios.post(baseUrl + '/api/set_employee_password', fd)
            .then(d => {
                const data = d.data;
                console.log(data);
                this.setState({
                    loading: false,
                });
                if (data.err || data.status === 500) {
                    message.error("Sorry, Try again")
                } else if (data.status === 200) {
                    message.success("Password Changed")
                }

            });
        this.password.value = ''
    };
    postStatusData = (checked) => {
        this.setState({loading: true,});
        const fd = new FormData();
        fd.append('id', this.props.id);
        fd.append('status', checked);

        axios.post(baseUrl + '/api/set_employee_status', fd)
            .then(d => {
                const data = d.data;
                console.log(data);
                this.setState({
                    loading: false,
                });
                if (data.err) {
                    message.error("Sorry, Try again")
                } else if (data.status === 200) {
                    message.success("Status Changed")
                }

            })
    };

    getData = () => {
        this.setState({loading: true,});


        fetch(baseUrl + `/api/get_employee_status/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.warn(data);
                if (data.status === 200) {
                    console.warn(data);
                    this.setState({
                        active: (data.is_active === 1),
                        loading: false,
                        ploading: false,
                    });
                }
            })
    };

    render() {
        return (
            <>

                <Form>
                    <>
                        <Col sm={{size: 18, offset: 2}}>
                            {(!this.state.ploading) &&
                            <Switch loading={this.state.loading} title='Status '
                                    onChange={this.onStatusChange}
                                    checkedChildren={<Icon type="check"/>}
                                    unCheckedChildren={<Icon type="close"/>}/>
                            }
                        </Col>
                    </>
                    <>
                        <Col sm={{size: 18, offset: 2}}>
                            <Input innerRef={node => this.password = node}
                                   type="password" name="password"
                                   id="password" placeholder="Enter New password here"/>
                        </Col>
                    </>

                    <>
                        <Col sm={{size: 18, offset: 2}}>
                            <Button onClick={this.handleSubmit}>Save</Button>
                        </Col>
                    </>
                </Form>

                <Col sm="12">
                    <Card headStyle={{borderBottom: '1px solid #dee2e6', paddingBottom:'.25rem', marginRight:'.5rem', paddingLeft: 0}} title={<><Lock size={18} /><span className="align-middle ml-50">Permissions</span></>}>
                        <>
                            {" "}
                            <Table className="permissions-table" borderless responsive>
                                <thead>
                                <tr>
                                    <th>Module</th>
                                    <th>Read</th>
                                    <th>Write</th>
                                    <th>Create</th>
                                    <th>Delete</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Users</td>
                                    <td>
                                        <Checkbox
                                            disabled
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label=""
                                            defaultChecked={true}
                                        />
                                    </td>
                                    <td>
                                        <Checkbox
                                            disabled
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label=""
                                            defaultChecked={false}
                                        />
                                    </td>
                                    <td>
                                        <Checkbox
                                            disabled
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label=""
                                            defaultChecked={false}
                                        />
                                    </td>
                                    <td>
                                        {" "}
                                        <Checkbox
                                            disabled
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label=""
                                            defaultChecked={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Articles</td>
                                    <td>
                                        <Checkbox
                                            disabled
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label=""
                                            defaultChecked={false}
                                        />
                                    </td>
                                    <td>
                                        <Checkbox
                                            disabled
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label=""
                                            defaultChecked={true}
                                        />
                                    </td>
                                    <td>
                                        <Checkbox
                                            disabled
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label=""
                                            defaultChecked={false}
                                        />
                                    </td>
                                    <td>
                                        {" "}
                                        <Checkbox
                                            disabled
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label=""
                                            defaultChecked={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Staff</td>
                                    <td>
                                        <Checkbox
                                            disabled
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label=""
                                            defaultChecked={true}
                                        />
                                    </td>
                                    <td>
                                        <Checkbox
                                            disabled
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label=""
                                            defaultChecked={true}
                                        />
                                    </td>
                                    <td>
                                        <Checkbox
                                            disabled
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label=""
                                            defaultChecked={false}
                                        />
                                    </td>
                                    <td>
                                        {" "}
                                        <Checkbox
                                            disabled
                                            color="primary"
                                            icon={<Check className="vx-icon" size={16} />}
                                            label=""
                                            defaultChecked={false}
                                        />
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        </>
                    </Card>
                </Col>
            </>
        );
    }
}

export default AccountSettings;
