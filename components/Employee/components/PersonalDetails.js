import React, {useEffect, useState} from "react";
import baseUrl from "../../../utils/baseUrl";
import axios from "axios";
import {AppStateProvider} from "../../useAppState";
import {Avatar, Button, Card, Skeleton} from "antd";

const {Meta} = Card;


const initialState = {
    roles: null,
};
const reducer = (state, action) => {
    switch (action.type) {
        case "add": {
            return {...state, count: state.count + 1}
        }
        default:
            return state
    }
};

function PersonalDetails({user}) {
    const [address, setAddress] = useState(null);
    const [designations, setDesignations] = useState(null);
    const employee = user.employee;
    useEffect(() => {
        getDetails();

    }, []);
    const getDetails = async () => {
        const resArray = await axios.all([
            axios.get(`${baseUrl}/api/show_one_employee_address/${employee.employee_id}`),
            axios.get(`${baseUrl}/api/employee_designation_details/${employee.employee_id}`)]);
        setAddress(resArray[0].data);
        setDesignations(resArray[1].data)
    };

    return (
        <Card className='min-vh-100'>
            <Card bordered={false} hoverable={true} style={{marginTop: 16}}>
                <Skeleton loading={false} avatar active>
                    <Meta
                        avatar={
                            <span className='header-avatar'>
                                {/*<span className='edit-text'> </span>*/}
                                <Avatar className='edit-text' size='large'
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />

                            </span>
                        }
                        title={
                            <>
                                <span> Pamir khan</span><br/>
                            </>
                        }
                    />
                </Skeleton>
            </Card>
        </Card>
    );
}

export default (props) => (<AppStateProvider reducer={reducer} initialState={{...initialState, ...props}}>
    <PersonalDetails {...props} />
</AppStateProvider>)
