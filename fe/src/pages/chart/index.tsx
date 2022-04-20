import { useRef } from 'react';
import { Text, View } from '@tarojs/components';
import { useMount } from 'ahooks';
import { EChart } from 'taro3-echarts-react';
import styles from './index.module.scss';

export default function () {
    const barChartRef = useRef<EChart>(null);
    console.log('EChart', EChart);

    useMount(() => {
        const options = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(220, 220, 220, 0.8)',
                    },
                },
            ],
        };
        barChartRef.current?.refresh(options);
    });

    return (
        <View className='chart'>
            <Text>charts</Text>
            <View style={{ height: 300 }}>
                <EChart ref={barChartRef} canvasId='bar-canvas' />
            </View>
        </View>
    );
}
