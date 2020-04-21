import React, {useEffect, useState} from "react"
import loadable from 'loadable-components';
import {Card, List} from "antd";

const Chart = loadable(() => import('react-apexcharts'));

function ChartCard({type, title, values, labels, colors, gradient}) {
    const [series, setSeries] = useState(values);
    const [series2, setSeries2] = useState(values);
    const [total, setTotal] = useState(0);
    const [options, setOptions] = useState({
        chart: {
            dropShadow: {
                enabled: false,
                blur: 5,
                left: 1,
                top: 1,
                opacity: 0.2
            },
            toolbar: {
                show: false
            }
        },
        colors: colors,
        fill: {
            type: "gradient",
            gradient: {
                gradientToColors: gradient
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {show: false},
        stroke: {
            width: 5
        },
        labels: labels
    });
    const [options2, setOptions2] = useState({
        colors: colors,
        fill: {
            type: "gradient",
            gradient: {
                enabled: true,
                shade: "dark",
                type: "vertical",
                shadeIntensity: 0.5,
                gradientToColors: gradient,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        stroke: {
            lineCap: "round"
        },
        plotOptions: {
            radialBar: {
                size: 150,
                hollow: {
                    size: "20%"
                },
                track: {
                    strokeWidth: "100%",
                    margin: 15
                },
                dataLabels: {
                    name: {
                        fontSize: "18px"
                    },
                    value: {
                        fontSize: "16px"
                    },
                    total: {
                        show: true,
                        label: "Total",
                        formatter: () => {
                            return values.length
                        }
                    }
                }
            }
        },
        labels: labels,
    });
    useEffect(() => {
        let sum = values.reduce((sum, i) => sum + i, 0);
        setTotal(sum);
        setSeries2(values.map(value => (value / sum) * 100));
    }, []);
    return (
        <Card title={title}>
            {(total === 0) ? "This training has no Employees, please add to see stats" :
                <>
                    <Chart
                        options={(type === 'radialBar') ? options2 : options}
                        series={(type === 'radialBar') ? series2 : series}
                        type={type}
                        height={290}/>
                    <List>
                        {labels.map((label, index) => (
                            <List.Item key={index} className="d-flex justify-content-between">
                                <div className="item-info">
                                    <div style={{
                                        background: colors[index],
                                        height: "10px",
                                        width: "10px",
                                        borderRadius: "50%",
                                        display: "inline-block",
                                        margin: "0 5px"
                                    }}/>
                                    <span className="text-bold-600">{label}</span>
                                </div>
                                <div className="product-result">
                                    <span>{values[index]}</span>
                                </div>
                            </List.Item>
                        ))}
                        <List.Item className="d-flex justify-content-between">
                            <div className="item-info">
                                <div style={{
                                    background: '#111',
                                    height: "10px",
                                    width: "10px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    margin: "0 5px"
                                }}/>
                                <span className="text-bold-600">Total</span>
                            </div>
                            <div className="product-result">
                                <span>{total}</span>
                            </div>
                        </List.Item>
                    </List>
                </>
            }
        </Card>
    )
}

export default ChartCard
