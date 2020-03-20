import React, {useState} from "react"
import loadable from "loadable-components";
import {Card} from "antd";

const Chart = loadable(() => import('react-apexcharts'));

function TrainingGraph({title, colors, labelColor, strokeColor, categories, dataset1, dataset2 ,label1, label2}) {
    const [options, setOptions] = useState({
        loading: true,
        chart: {
            stacked: true,
            toolbar: {show: true}
        },
        plotOptions: {bar: {columnWidth: "10%"}},
        colors: colors,
        dataLabels: {enabled: true},
        grid: {
            borderColor: labelColor, padding: {
                left: 0,
                right: 0
            }
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
            offsetX: 0,
            fontSize: "14px",
            markers: {radius: 50, width: 10, height: 10}
        },
        xaxis: {
            labels: {style: {colors: strokeColor}},
            axisTicks: {show: true},
            categories:  categories,
            axisBorder: {show: true}
        },
        yaxis: {
            tickAmount: 5,
            labels: {style: {color: strokeColor}}
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
                type="bar"
                height={290}
                id="client-retention-chart"/>
        </Card>
    )
}

export default TrainingGraph
