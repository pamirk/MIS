import React, {useState} from "react";
import ApexAreaCharts from "../components/ApexAreaCharts";
import {parseCookies} from "nookies";
import {redirectUser} from "../utils/auth";
import baseUrl from "../utils/baseUrl";
import Head from "next/head";
import axios from "axios";
import {Col, Row} from "reactstrap";
import TrainingGraph from "../components/Training/TrainingGraph";
import IconWithTextCard from "../components/Complaints/components/IconWithTextCard";
import {Card} from "antd";
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';

let $primary = "#7367F0",
    $success = "#28C76F",
    $danger = "#EA5455",
    $warning = "#FF9F43",
    $primary_light = "#9c8cfc",
    $warning_light = "#FFC085",
    $danger_light = "#f29292",
    $stroke_color = "#b9c3cd",
    $label_color = "#e7eef7";

function Home({reports, weeks, lv_count}) {
    const [malesCount, setMalesCount] = useState(reports.reduce((acc, val) => acc.concat(val.Males), []));
    const [femalesCount, setFemalesCount] = useState(reports.reduce((acc, val) => acc.concat(val.Females), []));
    const [categoryCount, setCategoryCount] = useState(reports.reduce((acc, val) => acc.concat(val.category), []));
    let week1 = [0, 0, 0, 0, 0, 0, 0];
    let week2 = [0, 0, 0, 0, 0, 0, 0];
    console.log("lv_count", lv_count);
    weeks.weak1.map(v => week1[v.day] = v.count);
    weeks.weak2.map(v => week2[v.day] = v.count);
    return (
        <div className='p-1'>
            <Head>
                <link rel="stylesheet" type="text/css" href="/static/heatmap.css"/>
            </Head>
            <Card title='Complaints Stats'>
                <Row className='p-1'>
                    <Col className='p-1'>
                        <IconWithTextCard cardColor="gx-bg-orange" icon="diamond" title={16} subTitle="Total"/>
                    </Col>
                    <Col className='p-1'>
                        <IconWithTextCard cardColor="gx-bg-cyan" icon="tasks" title={2} subTitle="New"/>
                    </Col>
                    <Col className='p-1'>
                        <IconWithTextCard cardColor="color-425A70" icon="team" title={2} subTitle="Process"/>
                    </Col>
                    <Col className='p-1'>
                        <IconWithTextCard cardColor="gx-bg-teal" icon="files" title={2} subTitle="Resolved"/>
                    </Col>
                    <Col className='p-1'>
                        <IconWithTextCard cardColor="Green-light" icon="files" title={2} subTitle="Forwarded"/>
                    </Col>
                    <Col className='p-1'>
                        <IconWithTextCard cardColor="gx-bg-red" icon="files" title={0} subTitle="Delay"/>
                    </Col>
                </Row>
            </Card>

            <ApexAreaCharts
                title='Complaints Weekly trends'
                label1="This week"
                label2="Previous week"
                dataset1={week1}
                dataset2={week2}
                strokeColor={$stroke_color}
                colors={['#084B8A', '#E4E7EB']}
                labelColor={'#fff'}/>

            <Card title='Number of Employees on Leave over the Year'>
                <CalendarHeatmap
                    titleForValue={() => ''}
                    showMonthLabels showWeekdayLabels showOutOfRangeDays
                    startDate={new Date(new Date().getFullYear(), 0, 1)}
                    endDate={new Date(new Date().getFullYear(), 11, 31)}
                    classForValue={value => {
                        if (!value) {
                            return 'color-empty';
                        } else if (value.count < 5) {
                            return `color-github-1`;
                        } else if (value.count < 10) {
                            return `color-github-2`;
                        } else if (value.count < 20) {
                            return `color-github-3`;
                        } else {
                            return `color-github-4`;

                        }
                    }}
                    values={lv_count}
                    tooltipDataAttrs={value => {
                        return {
                            'data-tip': (value.date) && `Employee Absent count on ${value.date} is ${value.count} `,
                        };
                    }}
                />
                <ReactTooltip  />
            </Card>
            <Row>
                <Col>
                    <TrainingGraph
                        title='Training Capacity Matrix'
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
        </div>
    );
}

export default Home;
Home.getInitialProps = async (ctx) => {
    const {token} = parseCookies(ctx);
    if (!token) redirectUser(ctx, "/signin");
    const payload = {headers: {Authorization: token}};
    const url = `${baseUrl}/api/trainings`;
    const url2 = `${baseUrl}/api/complaints_weekly_counts`;
    const url3 = `${baseUrl}/api/leaves_yearly_count`;
    const response = await axios.all([axios.get(url, payload), axios.get(url2), axios.get(url3)]);
    return {reports: response[0].data.reports, weeks: response[1].data, lv_count: response[2].data.data}
};
