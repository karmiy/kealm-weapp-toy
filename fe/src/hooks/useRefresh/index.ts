import { useSafeState } from 'ahooks';
import { asyncWrapper, sleep } from '@/utils/base';

interface Service<T> {
    (): Promise<T>;
}
const LOADING_DURATION = 1000;

export default function <T>(service: Service<T>) {
    const [refresherTriggered, setRefresherTriggered] = useSafeState(false);

    const onRefresherRefresh = async () => {
        setRefresherTriggered(true);
        const startTime = new Date().getTime();

        await asyncWrapper(service());

        const deltaTime = new Date().getTime() - startTime;
        if (deltaTime < LOADING_DURATION) {
            await sleep(LOADING_DURATION - deltaTime);
        }

        setRefresherTriggered(false);
    };

    return {
        refresherTriggered,
        onRefresherRefresh,
    };
}
