const colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF'];
let base = +new Date(2000, 9, 3);
const oneDay = 24 * 3600 * 1000;
const date: any[] = [];

const data1: any[] = [];
const data2: any[] = [];
const data3: any[] = [];

for (let j = 1; j < 10; j++) {
    const now = new Date((base += oneDay));
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-'));
}

for (let i = 1; i < 8; i++) {
    data1.push(Math.round(Math.random() * 20));
    data2.push(Math.round(Math.random() * 20));
    data3.push(Math.round(Math.random() * 20));
}

export const options = {
    // backgroundColor: '#fff',
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
        data: ['支出', '收入', '总计'],
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
        top: '15%',
        y2: 88,
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
            height: 20,
            handleIcon:
                'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2,
            },
        },
    ],
    xAxis: [
        {
            type: 'category',
            data: date,
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
            name: '支出',
            type: 'line',
            data: data1,
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
                shadowColor: 'rgba(158,135,255, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20,
            },
            itemStyle: {
                normal: {
                    color: colorList[0],
                    borderColor: colorList[0],
                },
            },
            markPoint: {
                symbol: 'pin', //标记(气泡)的图形
                symbolSize: 50, //标记(气泡)的大小
                itemStyle: {
                    // color: '#4587E7', //图形的颜色。
                    borderColor: '#000', //图形的描边颜色。支持的颜色格式同 color，不支持回调函数。
                    borderWidth: 0, //描边线宽。为 0 时无描边。
                    borderType: 'solid', //柱条的描边类型，默认为实线，支持 ‘solid’, ‘dashed’, ‘dotted’。
                },
                data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' },
                ],
            },
            markLine: {
                data: [{ type: 'average', name: '平均值' }],
            },
        },
        {
            name: '收入',
            type: 'line',
            data: data2,
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
                shadowColor: 'rgba(115,221,255, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20,
            },
            itemStyle: {
                normal: {
                    color: colorList[1],
                    borderColor: colorList[1],
                },
            },
            markPoint: {
                symbol: 'pin', //标记(气泡)的图形
                symbolSize: 50, //标记(气泡)的大小
                itemStyle: {
                    color: '#4587E7', //图形的颜色。
                    borderColor: '#000', //图形的描边颜色。支持的颜色格式同 color，不支持回调函数。
                    borderWidth: 0, //描边线宽。为 0 时无描边。
                    borderType: 'solid', //柱条的描边类型，默认为实线，支持 ‘solid’, ‘dashed’, ‘dotted’。
                },
                data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' },
                ],
            },
            markLine: {
                data: [{ type: 'average', name: '平均值' }],
            },
        },
        {
            name: '总计',
            type: 'line',
            data: data3,
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
                shadowColor: 'rgba(254,154,139, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20,
            },
            itemStyle: {
                normal: {
                    color: colorList[2],
                    borderColor: colorList[2],
                },
            },
            markPoint: {
                symbol: 'pin', //标记(气泡)的图形
                symbolSize: 50, //标记(气泡)的大小
                itemStyle: {
                    // color: '#4587E7', //图形的颜色。
                    borderColor: '#000', //图形的描边颜色。支持的颜色格式同 color，不支持回调函数。
                    borderWidth: 0, //描边线宽。为 0 时无描边。
                    borderType: 'solid', //柱条的描边类型，默认为实线，支持 ‘solid’, ‘dashed’, ‘dotted’。
                },
                data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' },
                ],
            },
            markLine: {
                data: [{ type: 'average', name: '平均值' }],
            },
        },
    ],
};
