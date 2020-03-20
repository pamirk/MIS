import React from "react";
import Widget from "./Widget";
import {Icon} from "antd";
import Plane from "../../../static/plane.svg";

const IconWithTextCard = ({cardColor, icon, title, subTitle, iconColor}) => {
    return (
        <Widget styleName={`gx-card-full gx-p-3 ${cardColor}`}>
            <div className="gx-media gx-align-items-center gx-flex-nowrap">
                <div classN ame="mr-2 gx-mr-xxl-3">
                </div>
                <div className="gx-media-body">
                    <h1 className="gx-fs-xxl gx-font-weight-semi-bold gx-mb-1 gx-text-white">{title}</h1>
                    <p className="mb-0 gx-text-white">{subTitle}</p>
                </div>
            </div>
        </Widget>
    );
};

export default IconWithTextCard;
