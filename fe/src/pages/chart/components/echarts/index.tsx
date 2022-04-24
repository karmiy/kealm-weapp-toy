import { useEffect, useRef } from 'react';
import { EChart } from 'taro3-echarts-react';

interface Props {
    options?: Record<string, any>;
}

export default function ({ options }: Props) {
    const ref = useRef<EChart>(null);

    useEffect(() => {
        ref.current?.refresh(options ?? {});
        // setTimeout(() => {
        //     ref.current?.Chart.chart?.on('finished', () => {
        //         console.log('finished');
        //     });
        // }, 1000);
    }, [options]);

    return <EChart ref={ref} canvasId='bar-canvas' />;
}
