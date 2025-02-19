import { Fragment } from 'react';
import { View } from '@tarojs/components';
import { COLOR_VARIABLES, PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { Icon, WhiteSpace } from '@ui/components';
import { Layout } from '@ui/container';
import { DrawItem } from './components';
import styles from './index.module.scss';

export default function () {
  return (
    <Layout type='plain' className={styles.wrapper}>
      <View className={styles.header}>
        <View className={styles.prizeListEntrance}>
          <View
            className={styles.action}
            onClick={() => navigateToPage({ pageName: PAGE_ID.LUCKY_PRIZE_LIST })}
          >
            我的祈愿记录
            <Icon name='arrow-right' color={COLOR_VARIABLES.COLOR_RED} />
          </View>
        </View>
        <View className={styles.headerCoverImg} />
        <View className={styles.headerContent}>
          <Icon name='present-fill' size={16} color={COLOR_VARIABLES.COLOR_RED} />
          <View className={styles.title}>我的祈愿券:</View>
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
