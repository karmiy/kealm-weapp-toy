import { Fragment } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { WhiteSpace } from '@/components';
import { Item } from './item';
import styles from './index.module.scss';

const LimitedTimeOffer = () => {
  return (
    <View className={styles.wrapper}>
      <View className={styles.header}>
        <Text className={styles.title}>限时特惠</Text>
      </View>
      <ScrollView scrollX className={styles.content} enableFlex>
        {[...Array(3).keys()].map(index => {
          const img = `https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-limited-time-offer-${
            index + 1
          }.png`;
          return (
            <Fragment key={index}>
              {index !== 0 ? <WhiteSpace size='small' isVertical={false} /> : null}
              <Item img={img} title='美乐蒂毛绒玩偶' normalPrice={29} emphasizePrice={19} />
            </Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
};

export { LimitedTimeOffer };
