import { useCallback, useMemo } from 'react';
import { BaseEventOrig, Button, Text, View } from '@tarojs/components';
import { TAB_BAR_ID } from '@shared/tabBar';
import { COLOR_VARIABLES, PAGE_ID } from '@shared/utils/constants';
import { Logger } from '@shared/utils/logger';
import { showToast } from '@shared/utils/operateFeedback';
import { navigateToPage } from '@shared/utils/router';
import { sdk, STORE_NAME } from '@core';
import { FallbackImage, Icon, WhiteSpace } from '@ui/components';
import { withCustomTabBar } from '@ui/hoc';
import { useSingleStore } from '@ui/viewModel';
import styles from './index.module.scss';

const logger = Logger.getLogger('[UI][Mine]');

function Mine() {
  const user = useSingleStore(STORE_NAME.USER);
  const isAdmin = !!user?.isAdmin;
  const subTitle = useMemo(() => {
    return isAdmin ? '角色：管理员' : `积分: ${user?.availableScore ?? 0}`;
  }, [isAdmin, user?.availableScore]);
  const onChooseAvatar = useCallback(async (e: BaseEventOrig<any>) => {
    try {
      const { avatarUrl } = e.detail;
      await sdk.modules.user.uploadAvatar(avatarUrl);
    } catch (error) {
      logger.error('onChooseAvatar error', error.message);
      showToast({ title: '头像更新失败' });
    }
  }, []);
  return (
    <View className={styles.wrapper}>
      <View className={styles.header}>
        <Button className={styles.avatar} openType='chooseAvatar' onChooseAvatar={onChooseAvatar}>
          {user ? <FallbackImage src={user.avatar} className={styles.image} /> : null}
        </Button>
        <View className={styles.info}>
          <Text className={styles.name}>{user?.nickName}</Text>
          <Text className={styles.subTitle}>{subTitle}</Text>
        </View>
      </View>
      <View className={styles.container}>
        {/* <AtButton type='primary'>按钮</AtButton> */}
        <View className={styles.menuList}>
          <View
            className={styles.menuItem}
            onClick={() => navigateToPage({ pageName: PAGE_ID.COUPON })}
          >
            <View className={styles.title}>
              <Icon name='coupon' size={14} color={COLOR_VARIABLES.COLOR_RED} />
              <Text>优惠券</Text>
            </View>
            <Icon name='arrow-right' size={14} />
          </View>
          <View
            className={styles.menuItem}
            onClick={() => navigateToPage({ pageName: PAGE_ID.EXCHANGE_RECORD })}
          >
            <View className={styles.title}>
              <Icon name='exchange-record' size={14} color={COLOR_VARIABLES.COLOR_RED} />
              <Text>兑换记录</Text>
            </View>
            <Icon name='arrow-right' size={14} />
          </View>
          {isAdmin ? (
            <View
              className={styles.menuItem}
              onClick={() => navigateToPage({ pageName: PAGE_ID.PRODUCT_MANAGE })}
            >
              <View className={styles.title}>
                <Icon name='product' size={14} color={COLOR_VARIABLES.COLOR_RED} />
                <Text>商品管理</Text>
              </View>
              <Icon name='arrow-right' size={14} />
            </View>
          ) : null}
        </View>
        <WhiteSpace size='medium' />
        <View className={styles.menuList}>
          <View className={styles.menuButton}>
            <Text>退出登录</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const MinePage = withCustomTabBar(Mine, { tabBarId: TAB_BAR_ID.MINE });

export default MinePage;
