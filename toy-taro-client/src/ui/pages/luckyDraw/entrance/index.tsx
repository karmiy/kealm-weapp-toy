import { Fragment, useMemo } from 'react';
import { View } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { COLOR_VARIABLES, PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { LUCK_DRAW_PREVIEW_ID, STORE_NAME } from '@core';
import { Icon, WhiteSpace } from '@ui/components';
import { Layout } from '@ui/container';
import { useLuckyDrawAction, useStoreList, useUserInfo } from '@ui/viewModel';
import { DrawItem } from './components';
import styles from './index.module.scss';

export default function () {
  const { isAdmin, drawTicket } = useUserInfo();
  const allList = useStoreList(STORE_NAME.LUCKY_DRAW);
  const list = useMemo(() => {
    return allList.filter(item => item.id !== LUCK_DRAW_PREVIEW_ID);
  }, [allList]);
  const { clearPreview } = useLuckyDrawAction();

  useDidShow(() => {
    clearPreview({});
  });

  const HeaderAction = useMemo(() => {
    if (!isAdmin) {
      return (
        <View
          className={styles.action}
          onClick={() => navigateToPage({ pageName: PAGE_ID.LUCKY_DRAW_HISTORY })}
        >
          我的祈愿记录
          <Icon name='arrow-right' color={COLOR_VARIABLES.COLOR_RED} />
        </View>
      );
    }
    return (
      <View
        className={styles.action}
        onClick={() => navigateToPage({ pageName: PAGE_ID.LUCKY_DRAW_CONFIGURATION })}
      >
        新增祈愿池
        <Icon name='arrow-right' color={COLOR_VARIABLES.COLOR_RED} />
      </View>
    );
  }, [isAdmin]);

  return (
    <Layout type='plain' className={styles.wrapper}>
      <View className={styles.header}>
        <View className={styles.prizeListEntrance}>{HeaderAction}</View>
        <View className={styles.headerCoverImg} />
        <View className={styles.headerContent}>
          <Icon name='present-fill' size={16} color={COLOR_VARIABLES.COLOR_RED} />
          <View className={styles.title}>我的祈愿券:</View>
          <View className={styles.info}>{drawTicket}张</View>
        </View>
      </View>
      {list.map(item => {
        return (
          <Fragment key={item.id}>
            <WhiteSpace size='large' isVertical />
            <DrawItem id={item.id} />
          </Fragment>
        );
      })}
    </Layout>
  );
}
