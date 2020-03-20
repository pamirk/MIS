import React, {useEffect, useState} from 'react';
import {Card, Col, Divider, Row} from "antd";
import LeavesList from "../../components/Leave/LeavesList";
import {parseCookies} from "nookies";
import {redirectUser} from "../../utils/auth";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import Index from "../../components/Training";
import TrainingGraph from "../../components/Training/TrainingGraph";

let $primary = "#7367F0",
    $success = "#28C76F",
    $danger = "#EA5455",
    $warning = "#FF9F43",
    $primary_light = "#9c8cfc",
    $warning_light = "#FFC085",
    $danger_light = "#f29292",
    $stroke_color = "#b9c3cd",
    $label_color = "#e7eef7";

export default function training({trainings, reports}) {
    const [malesCount, setMalesCount] = useState(reports.flatMap(i => i.Males));
    const [femalesCount, setFemalesCount] = useState(reports.flatMap(i => i.Females));
    const [categoryCount, setCategoryCount] = useState(reports.flatMap(i => i.category));

    return (
        <Card style={{minHeight: '100vh'}}>

            <Row>
                <Col>
                    <TrainingGraph
                        title='Capacity Matrix'
                        label1="Males"
                        label2="Females"
                        dataset1={malesCount}
                        dataset2={femalesCount}
                        categories={categoryCount}
                        strokeColor={$stroke_color}
                        colors={[$primary, $danger]}
                        labelColor={$label_color}/>
                </Col>
            </Row>
            <Divider/>
            <Index trainings={trainings}/>
        </Card>
    );
}

training.getInitialProps = async (ctx) => {
    const {token} = parseCookies(ctx);
    if (!token) redirectUser(ctx, "/signin");

    const payload = {headers: {Authorization: token}};
    const url = `${baseUrl}/api/trainings`;

    const {data} = await axios.get(url, payload);
    return {trainings: data.trainings, reports: data.reports}
};
