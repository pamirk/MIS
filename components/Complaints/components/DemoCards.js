import {Col, Row} from "antd";
import IconWithTextCard from "./IconWithTextCard";
import React from "react";

const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: {marginBottom: 24},
};

function DemoCards() {
    return <Row gutter={24} type="flex">
        <Col {...topColResponsiveProps}>
            <IconWithTextCard cardColor="gx-bg-orange" icon="diamond" title="09" subTitle="Projects"/>
        </Col>
        <Col {...topColResponsiveProps}>
            <IconWithTextCard cardColor="gx-bg-cyan" icon="tasks" title="687" subTitle="Tasks"/>
        </Col>
        <Col {...topColResponsiveProps}>
            <IconWithTextCard cardColor="gx-bg-teal" icon="team" title="04" subTitle="Teams"/>
        </Col>
        <Col {...topColResponsiveProps}>
            <IconWithTextCard cardColor="gx-bg-red" icon="files" title="09" subTitle="Files"/>
        </Col>
    </Row>;
}

export default DemoCards;
