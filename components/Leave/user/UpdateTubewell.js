import {Button, Card, DatePicker, Divider, Form, message, Modal} from "antd";
import React, {useState} from "react";
import baseUrl from "../../../utils/baseUrl";
import {LEAVE_STATUS} from "../../../server/utils/status";
import axios from "axios";
import catchErrors from "../../../utils/catchErrors";

function UpdateTubewell({form: {getFieldDecorator, validateFields}, tubewell}) {
    const [data, setData] = useState([]);
    const [modelVisible, setModelVisible] = useState(false);
    const [loading, setLoading] = useState(false);


    function handleSubmit(e) {
        e.preventDefault();
        validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                try {

                } catch (error) {
                    message.error(catchErrors(error));

                } finally {
                    setLoading(false);
                }
            }
        });
    }


    return(
        <div>
        </div>
    );
}

export default Form.create()(UpdateTubewell);
