import { lastDayOfMonth } from 'date-fns';
import { CHART_TYPE } from './constants';

export const createMockData = (type: CHART_TYPE, plain = true) => {
    const incomeData: number[] = [];
    const expenditureData: number[] = [];
    const totalData: number[] = [];

    for (let i = 0; i < (type === CHART_TYPE.MONTH ? 31 : 12); i++) {
        incomeData.push(!plain ? Math.round(Math.random() * 20) : 0);
        expenditureData.push(!plain ? Math.round(Math.random() * 20) : 0);
        totalData.push(!plain ? Math.round(Math.random() * 20) : 0);
    }

    return [incomeData, expenditureData, totalData];
};

export const createXAxis = (current: Date, type: CHART_TYPE) => {
    if (type === CHART_TYPE.YEAR) {
        return [...Array(12).keys()].map(index => {
            return `${index + 1}`.padStart(2, '0');
        });
    }
    const lastDate = lastDayOfMonth(current);
    return [...Array(lastDate.getDate()).keys()].map(index => {
        return `${index + 1}`.padStart(2, '0');
    });
};

export const createChartOptions = (
    current: Date,
    type: CHART_TYPE,
    statistics: Record<
        string,
        {
            income: number;
            expenditure: number;
            total: number;
        }
    > = {},
) => {
    const xAxisData = createXAxis(current, type);

    const colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF'];

    const [incomeData, expenditureData, totalData] = createMockData(type);

    Object.keys(statistics).forEach(dateStr => {
        try {
            const { income, expenditure, total } = statistics[dateStr];

            // 找到是数组的第一项进行替换
            let index = -1;
            switch (type) {
                case CHART_TYPE.MONTH: {
                    const dayOfMonth = new Date(dateStr).getDate();
                    index = dayOfMonth - 1;
                    break;
                }
                case CHART_TYPE.YEAR: {
                    const monthOfYear = new Date(dateStr).getMonth();
                    index = monthOfYear;
                    break;
                }
                default:
                    break;
            }
            if (index === -1) return;

            incomeData[index] = income;
            expenditureData[index] = -expenditure;
            totalData[index] = total;
        } catch (error) {}
    });
    // console.log(incomeData, expenditureData, totalData);

    return {
        legend: {
            x: 'center',
            y: 'top',
            show: true,
            top: '5%',
            right: '5%',
            itemWidth: 6,
            itemGap: 20,
            textStyle: {
                color: '#556677',
            },
            data: ['收入', '支出', '总计'],
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                label: {
                    show: true,
                    backgroundColor: '#fff',
                    color: '#556677',
                    borderColor: 'rgba(0,0,0,0)',
                    shadowColor: 'rgba(0,0,0,0)',
                    shadowOffsetY: 0,
                },
                lineStyle: {
                    width: 0,
                },
            },
            backgroundColor: '#fff',
            textStyle: {
                color: '#5c6c7c',
            },
            padding: [10, 10],
            extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)',
        },
        grid: {
            top: '25%',
            y2: 88,
            left: '5%',
            containLabel: true,
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100,
            },
            {
                textStyle: false,
                start: 0,
                end: 100,
                // height: 20,
                height: 8,
                handleIcon:
                    'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: 16,
                // handleSize: '80%',
                showDataShadow: false,
                fillerColor: '#f2f2f2',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                },
                // bottom: 50,
            },
        ],
        xAxis: [
            {
                type: 'category',
                data: xAxisData,
                axisLabel: {
                    textStyle: {
                        color: '#556677',
                    },
                    // 默认x轴字体大小
                    fontSize: 12,
                    // margin:文字到x轴的距离
                    margin: 15,
                },
                boundaryGap: false,
            },
        ],
        yAxis: [
            {
                type: 'value',
                name: '单位：元',
                // nameTextStyle: {
                //     color: '#9effff',

                // },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#DCE2E8',
                    },
                },
                axisLabel: {
                    textStyle: {
                        color: '#556677',
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                    },
                },
            },
        ],
        series: [
            {
                name: '收入',
                type: 'line',
                data: incomeData,
                symbolSize: 1,
                symbol: 'circle',
                smooth: true,
                yAxisIndex: 0,
                showSymbol: false,
                emphasis: {
                    focus: 'series',
                },
                lineStyle: {
                    width: 2,
                    color: '#73DDFF',
                    // shadowColor: 'rgba(115,221,255, 0.3)',
                    // shadowBlur: 10,
                    // shadowOffsetY: 20,
                },
                itemStyle: {
                    normal: {
                        color: colorList[1],
                        borderColor: colorList[1],
                    },
                },
                // markPoint: {
                //     symbol: 'pin', //标记(气泡)的图形
                //     symbolSize: 50, //标记(气泡)的大小
                //     itemStyle: {
                //         color: '#4587E7', //图形的颜色。
                //         borderColor: '#000', //图形的描边颜色。支持的颜色格式同 color，不支持回调函数。
                //         borderWidth: 0, //描边线宽。为 0 时无描边。
                //         borderType: 'solid', //柱条的描边类型，默认为实线，支持 ‘solid’, ‘dashed’, ‘dotted’。
                //     },
                //     data: [
                //         { type: 'max', name: '最大值' },
                //         { type: 'min', name: '最小值' },
                //     ],
                // },
                // markLine: {
                //     data: [{ type: 'average', name: '平均值' }],
                // },
            },
            {
                name: '支出',
                type: 'line',
                data: expenditureData,
                symbolSize: 1,
                symbol: 'circle',
                smooth: true,
                yAxisIndex: 0,
                showSymbol: false,
                emphasis: {
                    focus: 'series',
                },
                lineStyle: {
                    width: 2,
                    // color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    //     {
                    //         offset: 0,
                    //         color: '#9effff',
                    //     },
                    //     {
                    //         offset: 1,
                    //         color: '#9E87FF',
                    //     },
                    // ]),
                    // shadowColor: 'rgba(158,135,255, 0.3)',
                    // shadowBlur: 10,
                    // shadowOffsetY: 20,
                },
                itemStyle: {
                    normal: {
                        color: colorList[0],
                        borderColor: colorList[0],
                    },
                },
                // markPoint: {
                //     symbol: 'pin', //标记(气泡)的图形
                //     symbolSize: 50, //标记(气泡)的大小
                //     itemStyle: {
                //         // color: '#4587E7', //图形的颜色。
                //         borderColor: '#000', //图形的描边颜色。支持的颜色格式同 color，不支持回调函数。
                //         borderWidth: 0, //描边线宽。为 0 时无描边。
                //         borderType: 'solid', //柱条的描边类型，默认为实线，支持 ‘solid’, ‘dashed’, ‘dotted’。
                //     },
                //     data: [
                //         { type: 'max', name: '最大值' },
                //         { type: 'min', name: '最小值' },
                //     ],
                // },
                // markLine: {
                //     data: [{ type: 'average', name: '平均值' }],
                // },
            },
            {
                name: '总计',
                type: 'line',
                data: totalData,
                symbolSize: 1,
                yAxisIndex: 0,
                symbol: 'circle',
                smooth: true,
                showSymbol: false,
                emphasis: {
                    focus: 'series',
                },
                lineStyle: {
                    width: 2,
                    color: '#fe9a8b',
                    // shadowColor: 'rgba(254,154,139, 0.3)',
                    // shadowBlur: 10,
                    // shadowOffsetY: 20,
                },
                itemStyle: {
                    normal: {
                        color: colorList[2],
                        borderColor: colorList[2],
                    },
                },
                // markPoint: {
                //     symbol: 'pin', //标记(气泡)的图形
                //     symbolSize: 50, //标记(气泡)的大小
                //     itemStyle: {
                //         // color: '#4587E7', //图形的颜色。
                //         borderColor: '#000', //图形的描边颜色。支持的颜色格式同 color，不支持回调函数。
                //         borderWidth: 0, //描边线宽。为 0 时无描边。
                //         borderType: 'solid', //柱条的描边类型，默认为实线，支持 ‘solid’, ‘dashed’, ‘dotted’。
                //     },
                //     data: [
                //         { type: 'max', name: '最大值' },
                //         { type: 'min', name: '最小值' },
                //     ],
                // },
                // markLine: {
                //     data: [{ type: 'average', name: '平均值' }],
                // },
            },
        ],
    };
};
