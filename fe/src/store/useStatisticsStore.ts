import { useMount } from 'ahooks';
import { atom, useRecoilState } from 'recoil';
import { getStatistics } from '@/services';
import { asyncWrapper } from '@/utils/base';

const statisticsState = atom({
    key: 'statistics',
    default: null as Record<string, { income: number; expenditure: number }> | null,
});

export function useStatisticsStore() {
    const [statistics, setStatistics] = useRecoilState(statisticsState);

    useMount(async () => {
        if (statistics) return;

        const [res, err] = await asyncWrapper(getStatistics());

        if (err || !res || !res.data) return;

        setStatistics(res.data);
    });

    return {
        statistics,
    };
}
