import { Fragment } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { WhiteSpace } from '@/components';
import { STORE_NAME } from '@/core';
import { useStoreIds } from '@/store';
import { Item } from './item';
import styles from './index.module.scss';

const LimitedTimeOffer = () => {
  const ids = useStoreIds(STORE_NAME.TOY);
  return (
    <View className={styles.wrapper}>
      <View className={styles.header}>
        <Text className={styles.title}>限时特惠</Text>
      </View>
      <ScrollView scrollX className={styles.content} enableFlex>
        {ids.map((id, index) => {
          return (
            <Fragment key={id}>
              {index !== 0 ? <WhiteSpace size='small' isVertical={false} /> : null}
              <Item id={id} />
            </Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
};

export { LimitedTimeOffer };
