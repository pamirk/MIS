import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import Index from "../../components/Employee/Index";
import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router'
import Error from "next/error";
import RolesForm from "../../components/roles/rolesForm";
import {message} from "antd";
import catchErrors from "../../utils/catchErrors";

function role_id() {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState(null);
    const [data, setData] = useState(null);

    const router = useRouter();
    const {role_id} = router.query;
    useEffect(() => {
        getRoleDetails();
    }, []);
    const getRoleDetails = async () => {
        setLoading(true);
        const url = `${baseUrl}/api/role_details/${role_id}`;
        const {status, data: {role, details}} = await axios.get(url);
        setLoading(false);
        setData({...role, permissions: details.map(i => i.p_id)});
    };

    const handlerSubmit = (event, form) => {
        event.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    console.log(values);
                    const url = `${baseUrl}/api/update_role/`;
                    const payload = {...values, role_id};
                    const {status} = await axios.post(url, payload);
                    if (status === 200){
                        router.push('/roles')
                    }
                } catch (error) {
                    console.log("error", error);
                    message.error(500);
                } finally {
                    setLoading(false);
                }
            }
        });
    };
    return (
        <div>
            {data && <RolesForm data={data} handlerSubmit={handlerSubmit}/>}
        </div>
    );
}


export default role_id;
