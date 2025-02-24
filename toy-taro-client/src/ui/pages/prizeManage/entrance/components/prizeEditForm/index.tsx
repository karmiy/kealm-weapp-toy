import { useCallback, useMemo, useState } from 'react';
import { View } from '@tarojs/components';
import { COLOR_VARIABLES, PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { PRIZE_TYPE, STORE_NAME } from '@core';
import { Button, CheckButton, Icon, Input, PickerSelector, WhiteSpace } from '@ui/components';
import { FormItem } from '@ui/container';
import { useCoupon, useStoreById } from '@ui/viewModel';
import styles from './index.module.scss';

interface PrizeEditFormProps {
  id?: string;
  afterSave?: () => void;
}

export const PrizeEditForm = (props: PrizeEditFormProps) => {
  const { id, afterSave } = props;
  const prize = useStoreById(STORE_NAME.PRIZE, id);
  // const { isActionLoading, handleUpdateCategory } = useTaskAction();
  const isActionLoading = false;
  const [prizeType, setPrizeType] = useState(prize?.type ?? PRIZE_TYPE.POINTS);

  const handleSelectPrizeType = useCallback((type: PRIZE_TYPE, checked: boolean) => {
    if (!checked) {
      return;
    }
    setPrizeType(type);
  }, []);

  const handleEditCoupon = useCallback(() => {
    navigateToPage({
      pageName: PAGE_ID.COUPON,
    });
  }, []);

  const [pointsValue, setPointsValue] = useState(prize?.points?.toString() ?? '');

  const { activeCoupons } = useCoupon({
    enableActiveIds: true,
  });

  const [couponId, setCouponId] = useState<string>(prize?.coupon?.id ?? '');
  const couponIndex = useMemo(() => {
    if (!couponId) {
      return;
    }
    const index = activeCoupons.findIndex(item => item.id === couponId);
    return index === -1 ? undefined : index;
  }, [couponId, activeCoupons]);

  const isSavePrizeBtnDisabled = useMemo(() => {
    if (prizeType === PRIZE_TYPE.POINTS) {
      return !Number(pointsValue);
    }
    if (prizeType === PRIZE_TYPE.COUPON) {
      return !couponId;
    }
  }, [prizeType, pointsValue, couponId]);

  const handleSave = async () => {
    // await handleUpdateCategory({
    //   id,
    //   name: categoryName,
    //   onSuccess: afterSave,
    // });
  };

  return (
    <View className={styles.prizeEditFormWrapper}>
      <FormItem title='奖品类型' required>
        <View className={styles.checkButtonWrapper}>
          <CheckButton
            label='积分'
            checked={prizeType === PRIZE_TYPE.POINTS}
            onChange={v => handleSelectPrizeType(PRIZE_TYPE.POINTS, v)}
          />
          <WhiteSpace isVertical={false} size='medium' />
          <CheckButton
            label='优惠券'
            checked={prizeType === PRIZE_TYPE.COUPON}
            onChange={v => handleSelectPrizeType(PRIZE_TYPE.COUPON, v)}
          />
          <View className={styles.editCoupon} onClick={handleEditCoupon}>
            <Icon name='edit' color={COLOR_VARIABLES.COLOR_RED} />
          </View>
        </View>
        <WhiteSpace size='small' />
        {prizeType === PRIZE_TYPE.POINTS ? (
          <Input
            type='number'
            placeholder='请输入奖品积分'
            value={pointsValue}
            onInput={e => setPointsValue(e.detail.value)}
          />
        ) : null}
        {prizeType === PRIZE_TYPE.COUPON ? (
          <PickerSelector
            placeholder='请选择优惠券'
            type='select'
            mode='selector'
            range={activeCoupons}
            rangeKey='detailTip'
            onChange={e => setCouponId(activeCoupons[Number(e.detail.value)]?.id)}
            value={couponIndex}
          />
        ) : null}
      </FormItem>
      <Button
        size='large'
        width='100%'
        loading={isActionLoading}
        disabled={isSavePrizeBtnDisabled || isActionLoading}
        onClick={handleSave}
      >
        保存
      </Button>
    </View>
  );
};
