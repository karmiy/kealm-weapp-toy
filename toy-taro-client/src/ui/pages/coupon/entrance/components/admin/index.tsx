import { useCallback } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { Icon, StatusWrapper, WhiteSpace } from '@ui/components';
import type { CouponRenderAction } from '@ui/container';
import { CouponList } from '@ui/container';
import { useCoupon, useStoreLoadingStatus } from '@ui/viewModel';
import { COLOR_VARIABLES } from '@/shared/utils/constants';
import styles from './index.module.scss';

export function CouponAdminPage() {
  const loading = useStoreLoadingStatus(STORE_NAME.COUPON);
  const { allCoupons, handleDelete } = useCoupon({
    enableAllIds: true,
  });

  const renderAction: CouponRenderAction = useCallback(
    (id, type) => {
      return (
        <View className={styles.itemAction}>
          {type !== 'expired' ? (
            <>
              <View>
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
    [handleDelete],
  );

  return (
    <StatusWrapper loading={loading} count={allCoupons.length}>
      <View className={styles.wrapper}>
        <ScrollView scrollY className={styles.scrollView}>
          <View className={styles.container}>
            <View className={styles.header}>
              <View className={styles.action}>
                <Icon name='add' color={COLOR_VARIABLES.COLOR_RED} />
                新增
              </View>
            </View>
            <CouponList list={allCoupons} renderAction={renderAction} />
          </View>
        </ScrollView>
      </View>
    </StatusWrapper>
  );
}
