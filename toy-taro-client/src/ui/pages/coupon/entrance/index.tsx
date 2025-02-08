import { useEffect } from 'react';
import { View } from '@tarojs/components';
import { setNavigationBarTitle } from '@tarojs/taro';
import { SafeAreaBar } from '@ui/components';
import { useSyncOnPageShow } from '@ui/hooks';
import { useUserInfo } from '@ui/viewModel';
import { CouponAdminPage, CouponUserPage } from './components';
import styles from './index.module.scss';

export default function () {
  useSyncOnPageShow();
  const { isAdmin } = useUserInfo();
  useEffect(() => {
    setNavigationBarTitle({
      title: isAdmin ? '优惠券管理' : '我的优惠券',
    });
  }, [isAdmin]);

  return (
    <View className={styles.wrapper}>
      {isAdmin ? <CouponAdminPage /> : <CouponUserPage />}
      <SafeAreaBar isWhiteBg inset='bottom' />
    </View>
  );
}
