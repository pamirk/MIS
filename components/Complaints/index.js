import React, {useEffect, useState} from "react";
import ComplaintList from "./ComplaintList";
import {Col, Row} from "reactstrap";
import {Statuses} from "../../utils/common";
import IconWithTextCard from "./components/IconWithTextCard";

function Index({complaints}) {
    const [totalCount, setTotalCount] = useState(0);
    const [newCount, setNewCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [resolvedCount, setResolvedCount] = useState(0);
    const [loading, setloading] = useState(false);

    const calculateStatuses = (complaints) => {
        let s_total = 0, s_new = 0, s_pending = 0, s_resolved = 0;
        let c;
        s_total = complaints.length;
        for (let i = 0; i < complaints.length; i++) {
            c = complaints[i];
            if (c.complain_status === Statuses.initiated || c.complain_status === Statuses.inProcess) {
                s_pending += 1;
            } else if (c.complain_status === Statuses.registered) {
                s_new += 1
            } else if (c.complain_status === Statuses.resolved) {
                s_resolved += 1
            }
        }
        setTotalCount(s_total);
        setNewCount(s_new);
        setPendingCount(s_pending);
        setResolvedCount(s_resolved);
    };
    useEffect(() => {
        calculateStatuses(complaints)
    }, [complaints]);
    return <>
        <>
            <Row className='p-1'>
                <Col className='p-1'>
                    <IconWithTextCard cardColor="gx-bg-orange" icon="diamond" title={totalCount} subTitle="Total"/>
                </Col>
                <Col className='p-1'>
                    <IconWithTextCard cardColor="gx-bg-cyan" icon="tasks" title={newCount} subTitle="New"/>
                </Col>
                <Col className='p-1'>
                    <IconWithTextCard cardColor="color-425A70" icon="team" title={pendingCount} subTitle="Process"/>
                </Col>
                <Col className='p-1'>
                    <IconWithTextCard cardColor="gx-bg-teal" icon="files" title={pendingCount} subTitle="Resolved"/>
                </Col>
                <Col className='p-1'>
                    <IconWithTextCard cardColor="Green-light" icon="files" title={totalCount} subTitle="Forwarded"/>
                </Col>
                <Col className='p-1'>
                    <IconWithTextCard cardColor="gx-bg-red" icon="files" title={0} subTitle="Delay"/>
                </Col>
            </Row>
            {/*<div style={{ fontSize:'1em', background: '#ECECEC', padding: '30px'}}>
                <Row gutter={16}>
                    <Col span={4}>
                        <Card bordered={false} style={{backgroundColor: '#D4EEE2'}}>
                            <Statistic
                                title="Total"
                                value={totalCount}
                                precision={0}
                                suffix={<img width={30} src="https://img.icons8.com/color/96/000000/total-sales-1.png" />}

                            />

                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false} style={{backgroundColor: '#F1FAF5'}}>
                            <Statistic
                                title="New"
                                value={newCount}
                                precision={0}
                                suffix={<img width={30} src="https://img.icons8.com/nolan/64/000000/fire-element.png" />}
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false} style={{backgroundColor: '#D4EEE2'}}>
                            <Statistic
                                title="In Process"
                                value={pendingCount}
                                precision={0}
                                suffix={<img width={30} src="https://img.icons8.com/office/80/000000/road-worker.png" />}
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false} style={{backgroundColor: '#F1FAF5'}}>
                            <Statistic
                                title="Resolved"
                                value={pendingCount}
                                precision={0}
                                // prefix={<Icon type="arrow-up" />}
                                suffix={<img width={30} src="https://img.icons8.com/bubbles/50/000000/checkmark.png" />}
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false} style={{backgroundColor: '#D4EEE2'}}>
                            <Statistic
                                title="Forwarded"
                                value={totalCount}
                                precision={0}
                                suffix={<img width={30} src="https://img.icons8.com/cute-clipart/64/000000/forward-message.png" />}
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false} style={{backgroundColor: '#F1FAF5'}}>
                            <Statistic
                                title="Delay"
                                value={0}
                                precision={0}
                                suffix={<img width={30} src="https://img.icons8.com/color/96/000000/timetable.png" />}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>*/}
            <Row>
                <Col>
                    <ComplaintList complaints={complaints}/>
                </Col>
            </Row>
        </>
    </>;
}

export default Index;
