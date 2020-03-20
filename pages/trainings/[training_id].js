import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import React, {useEffect} from "react";
import {useRouter} from 'next/router'
import {redirectUser} from "../../utils/auth";
import {Layout} from "antd";
import Head from "next/head";
import Error from "next/error";
import ChartCard from "../../components/Training/ChartCard";
import {Col, Row} from "reactstrap";
import TrainingGraph from "../../components/Training/TrainingGraph";

let $primary = "#7367F0",
    $success = "#28C76F",
    $danger = "#EA5455",
    $warning = "#FF9F43",
    $info = "#00cfe8",
    $primary_light = "#9c8cfc",
    $warning_light = "#FFC085",
    $danger_light = "#f29292",
    $info_light = "#1edec5",
    $stroke_color = "#b9c3cd",
    $label_color = "#e7eef7",
    $purple = "#df87f2",
    $white = "#fff";

function Training_id({gender, grade, depart, ctx}) {
    /* const router = useRouter();
     const {training_id} = router.query;*/
    return (
        <div style={{minHeight: '100vh'}}>
            <Row>
                <Col lg="4" sm="12">
                    <ChartCard
                        type="pie"
                        title='Employees by Gender'
                        values={[gender.Males, gender.Females]}
                        labels={["Male", "Female"]}
                        colors={[$primary, $warning]}
                        gradient={[$primary_light, $warning_light, $danger_light]}/>
                </Col>
                <Col lg="4" sm="12">
                    <ChartCard
                        type="donut"
                        title='Employees by Grade'
                        values={grade.flatMap(i => i.count)}
                        labels={grade.flatMap(i => i.scale)}
                        colors={[$primary, $warning, $danger]}
                        gradient={[$primary_light, $warning_light, $danger_light]}/>
                </Col>
                <Col lg="4" sm="12">
                    <ChartCard
                        type="radialBar"
                        title='Employees by Department'
                        values={depart.flatMap(i => i.DepartCount)}
                        labels={depart.flatMap(i => i.department_name)}
                        colors={[$primary, $warning, $danger]}
                        gradient={[$primary_light, $warning_light, $danger_light]}/>
                </Col>
            </Row>

        </div>
    );
}

Training_id.getInitialProps = async ({query: {training_id}, ctx}) => {
    const url = `${baseUrl}/api/training_reports/${training_id}`;
    const {data} = await axios.get(url);
    return {gender: data.gender, grade: data.grade, depart: data.depart, ctx};
};

export default Training_id;
