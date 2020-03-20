import React from "react";
import {Card} from "antd";

function Widget({title, children, styleName, cover, extra, actions}){
    return (
        <Card title={title} actions={actions} cover={cover}
              className={`gx-card-widget ${styleName}`} extra={extra}>
            {children}
        </Card>
    )
}
export default Widget;
