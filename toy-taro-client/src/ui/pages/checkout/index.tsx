import { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { Button, SafeAreaBar, WhiteSpace } from '@ui/components';
import { CouponActionSheet } from '@ui/container';
import { useSyncOnPageShow } from '@ui/hooks';
import { useOrderAction, useProductShopCart, useUserCouponList } from '@ui/viewModel';
import { FormItem, ProductItem } from './components';
import styles from './index.module.scss';

export default function () {
  const { scrollViewRefreshProps } = useSyncOnPageShow();
  const { checkedIds, totalScore } = useProductShopCart({
    enableCheckIds: true,
    enableTotalScore: true,
  });
  const { handleCreate } = useOrderAction();
  const { activeCoupons } = useUserCouponList({ enableActiveIds: true, orderScore: totalScore });
  const hasAvailableCoupon = useMemo(
    () => activeCoupons.some(coupon => coupon.selectable),
    [activeCoupons],
  );

  const [couponVisible, setCouponVisible] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string>();
  const selectedCoupon = useMemo(() => {
    if (!selectedCouponId) {
      return;
    }
    return activeCoupons.find(item => item.id === selectedCouponId);
  }, [activeCoupons, selectedCouponId]);
  const couponTip = useMemo(() => {
    if (!hasAvailableCoupon) {
      return '暂无可用优惠券';
    }
    if (!selectedCoupon) {
      return '请选择优惠券';
    }
    return selectedCoupon.name;
  }, [hasAvailableCoupon, selectedCoupon]);

  const handlePay = useCallback(() => {
    handleCreate({
      shopCartIds: checkedIds,
      couponId: selectedCouponId,
    });
  }, [checkedIds, handleCreate, selectedCouponId]);

  return (
    <View className={styles.wrapper}>
      <View className={styles.detail}>
        <ScrollView scrollY className={styles.scrollView} {...scrollViewRefreshProps}>
          <View className={styles.container}>
            <View className={styles.area}>
              {checkedIds.map((id, index) => {
                return (
                  <>
                    {index !== 0 ? <WhiteSpace isVertical line size='large' /> : null}
                    <ProductItem key={id} id={id} />
                  </>
                );
              })}
            </View>
            <WhiteSpace isVertical size='medium' />
            <View className={styles.area}>
              <FormItem
                mode={hasAvailableCoupon ? 'select' : 'text'}
                label='优惠券'
                text={couponTip}
                highlight
                onClick={() => setCouponVisible(true)}
              />
              <WhiteSpace isVertical size='medium' />
              <FormItem label='商品积分' text={`${totalScore}积分`} />
              <WhiteSpace isVertical size='medium' />
              <FormItem
                label='优惠积分'
                text={`-${selectedCoupon?.discountScore ?? 0}积分`}
                highlight
              />
              <WhiteSpace isVertical size='medium' />
              <FormItem
                label='实付积分'
                text={`${totalScore - (selectedCoupon?.discountScore ?? 0)}积分`}
                highlight
                emphasize
              />
            </View>
          </View>
        </ScrollView>
      </View>
      <View className={styles.actionWrapper}>
        <Text className={styles.tip}>共{checkedIds.length}件商品</Text>
        <Button onClick={handlePay}>支付</Button>
      </View>
      <CouponActionSheet
        visible={couponVisible}
        list={activeCoupons}
        selectedId={selectedCouponId}
        onSelect={setSelectedCouponId}
        onClose={() => setCouponVisible(false)}
      />
      <SafeAreaBar isWhiteBg inset='bottom' />
    </View>
  );
}
