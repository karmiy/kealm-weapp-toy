import { Fragment } from 'react/jsx-runtime';
import { View } from '@tarojs/components';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { Icon, WhiteSpace } from '@ui/components';
import { Layout } from '@ui/container';
import { DrawItem } from './components';
import styles from './index.module.scss';

export default function () {
  return (
    <Layout type='plain' className={styles.wrapper}>
      <View className={styles.header}>
        <View className={styles.headerCoverImg} />
        <View className={styles.headerContent}>
          <Icon name='gift-fill' size={16} color={COLOR_VARIABLES.COLOR_RED} />
          <View className={styles.title}>我的抽奖券:</View>
          <View className={styles.info}>8张</View>
        </View>
      </View>
      {[...Array(5).keys()].map(index => {
        return (
          <Fragment key={index}>
            <WhiteSpace size='large' isVertical />
            <DrawItem />
          </Fragment>
        );
      })}
    </Layout>
  );
}
