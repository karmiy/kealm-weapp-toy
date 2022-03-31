import { useRef } from 'react';
import { useMount, useSafeState } from 'ahooks';
import { isFunction } from 'lodash-es';
import { asyncWrapper } from '@/utils/base';

interface Service<T> {
    (params: { pageNo: number }): Promise<Array<T> | undefined>;
}

interface Options<T> {
    initialRequest?: boolean;
    isLoadAll?: (currentList: Array<T>, loading: boolean) => boolean;
}

export default function <T>(service: Service<T>, options?: Options<T>) {
    const { isLoadAll, initialRequest = true } = options ?? {};
    const [list, setList] = useSafeState<Array<T>>([]);
    const pageNoRef = useRef(1);
    const getPageNo = () => pageNoRef.current;
    const setPageNo = (value: number | ((prev: number) => number)) => {
        const nextValue = isFunction(value) ? value(getPageNo()) : value;
        pageNoRef.current = nextValue;
    };
    const [loading, setLoading] = useSafeState(false);
    const loadAll = isLoadAll?.(list, loading) ?? false;

    const handleLoadMore = async () => {
        setLoading(true);

        const [data, err] = await asyncWrapper(
            service({
                pageNo: getPageNo(),
            }),
        );
        setLoading(false);

        if (err) return Promise.reject(err);
        if (!data) return;

        setList(prevList => (getPageNo() === 1 ? [...data] : [...prevList, ...data]));
        setPageNo(v => v + 1);
    };

    const onScrollToLower = () => {
        if (!list.length) return;

        if (loadAll) return;

        if (loading) return;

        handleLoadMore();
    };

    const refresh = async () => {
        setPageNo(1);

        // account_type 没收到
        await handleLoadMore();
    };

    useMount(() => {
        if (!initialRequest) return;
        handleLoadMore();
    });

    return {
        handleLoadMore,
        onScrollToLower,
        list,
        loading,
        loadAll,
        refresh,
    };
}
