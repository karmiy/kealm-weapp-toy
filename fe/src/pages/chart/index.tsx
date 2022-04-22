import { useRef } from 'react';
import { Text, View } from '@tarojs/components';
import { useMount } from 'ahooks';
import { ECharts } from './components';
import { options } from './utils';
import styles from './index.module.scss';

// const options = {
//     xAxis: {
//         type: 'category',
//         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     },
//     yAxis: {
//         type: 'value',
//     },
//     series: [
//         {
//             data: [120, 200, 150, 80, 70, 110, 130],
//             type: 'bar',
//             showBackground: true,
//             backgroundStyle: {
//                 color: 'rgba(220, 220, 220, 0.8)',
//             },
//         },
//     ],
// };

export default function () {
    return (
        <View className='chart'>
            <Text>charts</Text>
            <View style={{ height: 300 }}>
                <ECharts options={options} />
            </View>
        </View>
    );
}
