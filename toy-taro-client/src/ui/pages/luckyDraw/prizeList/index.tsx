import { LoadingMore, StatusWrapper } from '@ui/components';
import { Layout } from '@ui/container';
import { useLoadMore } from '@ui/hooks';
import { PrizeItem } from './components';
import styles from './index.module.scss';

const generateNext20Numbers = (start: number): number[] => {
  return Array.from({ length: 20 }, (_, i) => start + i + 1);
};

export default function () {
  const { list, loading, hasMore, onScrollToLower } = useLoadMore<number>({
    request: () => {
      const lastId = list[list.length - 1] ?? 0;
      return {
        data: generateNext20Numbers(lastId),
        hasMore: lastId < 60,
      };
    },
  });

  return (
    <StatusWrapper loading={loading} count={list.length} size='fill'>
      <Layout
        type='card'
        classes={{ cardList: styles.prizeCardWrapper }}
        scrollViewProps={{
          // onScrollToLower: () => console.log('[test] scroll to bottom'),
          onScrollToLower,
        }}
      >
        {list.map(index => {
          return <PrizeItem id={String(index)} key={index} />;
        })}
        <LoadingMore loading={hasMore} />
      </Layout>
    </StatusWrapper>
  );
}
