import {Icon} from "antd";
import * as React from "react";

export const cardTitleIcon = (title, icon, callBack) => (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span>{title}</span>
        <Icon onClick={callBack} type={icon} title={`Edit ${title}`}/>
    </div>
)
export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
export const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};
