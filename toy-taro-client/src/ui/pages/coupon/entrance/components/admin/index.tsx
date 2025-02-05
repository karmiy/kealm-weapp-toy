import { useCallback } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { COLOR_VARIABLES, PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { STORE_NAME } from '@core';
import { Icon, StatusWrapper, WhiteSpace } from '@ui/components';
import type { CouponRenderAction } from '@ui/container';
import { CouponList } from '@ui/container';
import { useCoupon, useStoreLoadingStatus } from '@ui/viewModel';
import styles from './index.module.scss';

export function CouponAdminPage() {
  const loading = useStoreLoadingStatus(STORE_NAME.COUPON);
  const { allCoupons, handleDelete } = useCoupon({
    enableAllIds: true,
  });

  const handleManageCoupon = useCallback((id?: string) => {
    navigateToPage({
      pageName: PAGE_ID.COUPON_MANAGE,
      params: id ? { id } : {},
    });
  }, []);

  const renderAction: CouponRenderAction = useCallback(
    (id, type) => {
      return (
        <View className={styles.itemAction}>
          {type !== 'expired' ? (
            <>
              <View onClick={() => handleManageCoupon(id)}>
                <Icon name='edit' color={COLOR_VARIABLES.COLOR_RED} />
              </View>
              <WhiteSpace size='small' isVertical={false} />
            </>
          ) : null}
          <View onClick={() => handleDelete(id)}>
            <Icon name='delete' />
          </View>
        </View>
      );
    },
    [handleDelete, handleManageCoupon],
  );

  return (
    <View className={styles.wrapper}>
      <ScrollView scrollY className={styles.scrollView}>
        <View className={styles.container}>
          <View className={styles.header}>
            <View className={styles.action} onClick={() => handleManageCoupon()}>
              <Icon name='add' color={COLOR_VARIABLES.COLOR_RED} />
              新增
            </View>
          </View>
          <StatusWrapper loading={loading} count={allCoupons.length} size='flex'>
            <CouponList list={allCoupons} renderAction={renderAction} />
          </StatusWrapper>
        </View>
      </ScrollView>
    </View>
  );
}
