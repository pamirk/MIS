import React, {useState} from "react"
import loadable from "loadable-components";
import {Card} from "antd";

const Chart = loadable(() => import('react-apexcharts'));

function ApexAreaCharts({title, colors, labelColor, strokeColor, categories, dataset1, dataset2 ,label1, label2}) {
    const [options, setOptions] = useState({
        markers: {
            size: 6,
            strokeWidth: 3,
            fillOpacity: 0,
            strokeOpacity: 0,
            hover: {size: 8}
        },
        chart: {id: "areaChart"},
        xaxis: {categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]},
        stroke: {curve: "straight", width: [2, 1]},
        dataLabels: {enabled: false},
        colors: colors,
        grid: {borderColor: labelColor, padding: {left: 0, right: 0}},
        legend: {
            show: true,
            position: "bottom",
            horizontalAlign: "right",
            offsetX: 0,
            fontSize: "14px",
            markers: {radius: 50, width: 10, height: 10}
        },
        tooltip: {x: {show: true}}
    });
    const [series, setSeries] = useState([
        {
            name: label1,
            data: dataset1
        },
        {
            name: label2,
            data: dataset2
        }
    ]);

    return (
        <Card title={title}>
            <Chart
                options={options}
                series={series}
                type="area"
                height={370}
                width={'100%'}
            />
        </Card>
    )
}

export default ApexAreaCharts
