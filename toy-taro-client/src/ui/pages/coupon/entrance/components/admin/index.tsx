import { useCallback, useMemo } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { COLOR_VARIABLES, PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { STORE_NAME } from '@core';
import { Icon, StatusWrapper, WhiteSpace } from '@ui/components';
import type { CouponRenderAction } from '@ui/container';
import { CouponList } from '@ui/container';
import { useSyncOnPageShow } from '@ui/hooks';
import { useCouponAction, useCouponList, useStoreLoadingStatus } from '@ui/viewModel';
import styles from './index.module.scss';

export function CouponAdminPage() {
  const { handleRefresh, refresherTriggered } = useSyncOnPageShow();
  const loading = useStoreLoadingStatus(STORE_NAME.COUPON);
  const { allCouponModels } = useCouponList();
  const couponList = useMemo(() => {
    return allCouponModels.map(coupon => {
      return {
        ...coupon,
        discountTip: coupon.discountTip,
        usageScopeTip: coupon.usageScopeTip,
        conditionTip: coupon.conditionTip,
        expirationTip: coupon.expirationTip,
        detailTip: coupon.detailTip,
        shortTip: coupon.shortTip,
        type: coupon.isExpired ? ('expired' as const) : ('active' as const),
      };
    });
  }, [allCouponModels]);
  const { handleDelete } = useCouponAction();

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
          <View onClick={() => handleManageCoupon(id)}>
            <Icon name='edit' color={COLOR_VARIABLES.COLOR_RED} />
          </View>
          <WhiteSpace size='small' isVertical={false} />
          <View onClick={() => handleDelete({ id })}>
            <Icon name='delete' />
          </View>
        </View>
      );
    },
    [handleDelete, handleManageCoupon],
  );

  return (
    <View className={styles.wrapper}>
      <ScrollView
        scrollY
        className={styles.scrollView}
        refresherEnabled
        refresherTriggered={refresherTriggered}
        onRefresherRefresh={handleRefresh}
        refresherBackground={COLOR_VARIABLES.FILL_BODY}
      >
        <View className={styles.container}>
          <View className={styles.header}>
            <View className={styles.action} onClick={() => handleManageCoupon()}>
              <Icon name='add' color={COLOR_VARIABLES.COLOR_RED} />
              新增
            </View>
          </View>
          <StatusWrapper loading={loading} count={couponList.length} size='flex'>
            <CouponList list={couponList} renderAction={renderAction} />
          </StatusWrapper>
        </View>
      </ScrollView>
    </View>
  );
}
