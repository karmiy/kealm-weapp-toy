import { Fragment } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { WhiteSpace } from '@/components';
import { useToyLimitedTimeOffer } from '@/store';
import { Item } from './item';
import styles from './index.module.scss';

const LimitedTimeOffer = () => {
  const { ids } = useToyLimitedTimeOffer();
  if (!ids.length) {
    return null;
  }
  return (
    <>
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
      <WhiteSpace size='large' />
    </>
  );
};

export { LimitedTimeOffer };
