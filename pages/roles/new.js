import React, {useEffect, useState} from 'react';
import {Button, Card, Checkbox, Col, Divider, Form, Input, message, Row} from "antd";
import {formItemLayout} from "../../components/Common/UI";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import catchErrors from "../../utils/catchErrors";
import RolesForm from "../../components/roles/rolesForm";
import {useRouter} from "next/router";

const FI = Form.Item;

function Index({form}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlerSubmit = (event, form) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    console.log(values);
                    const url = `${baseUrl}/api/create_role/`;
                    const payload = {...values};
                    const {status} = await axios.post(url, payload);
                    if (status === 200){
                        router.push('/roles')
                    }
                } catch (error) {
                    message.error(catchErrors(error));
                } finally {
                    setLoading(false);
                }
            }
        });
    };
    return (
        <div>
            <RolesForm data={null} handlerSubmit={handlerSubmit}  />
        </div>
    );
}

export default Form.create()(Index);
