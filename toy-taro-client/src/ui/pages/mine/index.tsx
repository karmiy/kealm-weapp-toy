import { useCallback, useMemo, useState } from 'react';
import { Button as TaroButton, Text, View } from '@tarojs/components';
import { TAB_BAR_ID } from '@shared/tabBar';
import { COLOR_VARIABLES, PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { STORE_NAME } from '@core';
import {
  Button,
  FallbackImage,
  FloatLayout,
  Icon,
  Input,
  SafeAreaBar,
  WhiteSpace,
} from '@ui/components';
import { FormItem } from '@ui/container';
import { withCustomTabBar } from '@ui/hoc';
import { useSingleStore, useUserAction } from '@ui/viewModel';
import styles from './index.module.scss';

function Mine() {
  const user = useSingleStore(STORE_NAME.USER);
  const isAdmin = !!user?.isAdmin;
  const subTitle = useMemo(() => {
    return isAdmin ? '角色：管理员' : `积分: ${user?.availableScore ?? 0}`;
  }, [isAdmin, user?.availableScore]);

  const { isActionLoading, handleChooseAvatar, handleUpdateNickName, handleLogout } =
    useUserAction();

  const [showEditNickName, setShowEditNickName] = useState(false);
  const [nickName, setNickName] = useState('');
  const onSaveNickName = useCallback(async () => {
    try {
      await handleUpdateNickName({ nickName });
    } finally {
      setShowEditNickName(false);
      setNickName('');
    }
  }, [handleUpdateNickName, nickName]);

  return (
    <View className={styles.wrapper}>
      <View className={styles.header}>
        <TaroButton
          className={styles.avatar}
          openType='chooseAvatar'
          onChooseAvatar={handleChooseAvatar}
        >
          {user ? <FallbackImage src={user.avatar} className={styles.image} /> : null}
        </TaroButton>
        <View className={styles.info}>
          <View className={styles.title} onClick={() => setShowEditNickName(true)}>
            <Text className={styles.name}>{user?.nickName}</Text>
            <Icon name='edit' size={14} color={COLOR_VARIABLES.COLOR_WHITE} />
          </View>
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
              <Text>{isAdmin ? '订单管理' : '兑换记录'}</Text>
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
                <Text>商品录入</Text>
              </View>
              <Icon name='arrow-right' size={14} />
            </View>
          ) : null}
          <View
            className={styles.menuItem}
            onClick={() => navigateToPage({ pageName: PAGE_ID.TASK_FLOW_MANAGE })}
          >
            <View className={styles.title}>
              <Icon name='task' size={14} color={COLOR_VARIABLES.COLOR_RED} />
              <Text>任务清单</Text>
            </View>
            <Icon name='arrow-right' size={14} />
          </View>
        </View>
        <WhiteSpace size='medium' />
        <View className={styles.menuList}>
          <View className={styles.menuButton} onClick={handleLogout}>
            <Text>退出登录</Text>
          </View>
        </View>
      </View>
      <FloatLayout
        visible={showEditNickName}
        onClose={() => {
          setShowEditNickName(false);
          setNickName('');
        }}
        className={styles.floatLayout}
      >
        <View className={styles.editNickName}>
          <FormItem title='昵称'>
            {/* type nickname 在小程序输入非微信昵称的内容时，在关闭时会显示一个 loading toast */}
            {/* https://developers.weixin.qq.com/community/develop/doc/00006a2e168f30f9721e3afcd5b800?jumpto=comment&commentid=000ac886e6062889791ed8e0f514 */}
            <Input
              type='nickname'
              placeholder='请输入昵称'
              value={nickName}
              onInput={e => setNickName(e.detail.value)}
            />
          </FormItem>
          <Button
            size='large'
            width='100%'
            onClick={onSaveNickName}
            icon={isActionLoading ? 'loading' : undefined}
            disabled={!nickName || isActionLoading}
          >
            保存
          </Button>
        </View>
        <SafeAreaBar inset='tabBar' />
      </FloatLayout>
    </View>
  );
}

const MinePage = withCustomTabBar(Mine, { tabBarId: TAB_BAR_ID.MINE });

export default MinePage;
