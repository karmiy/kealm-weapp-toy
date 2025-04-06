import { useCallback, useMemo, useState } from 'react';
import { View } from '@tarojs/components';
import { COLOR_VARIABLES, PAGE_ID } from '@shared/utils/constants';
import { CheckButton, Textarea, Input, PickerSelector, Button, WhiteSpace } from '@ui/components';
import { FormItem, Layout } from '@ui/container';
import { navigateToPage } from '@shared/utils/router';
import { useContactList, useUserCouponList } from '@ui/viewModel';
import styles from './index.module.scss';

enum PUNISHMENT_TYPE {
  POINTS = 'points',
  COUPON = 'coupon',
  LUCKY_DRAW = 'luckyDraw',
}

export default function() {
  // 获取用户列表
  const { userContacts } = useContactList();
  
  // 惩罚类型
  const [punishmentType, setPunishmentType] = useState<PUNISHMENT_TYPE>(PUNISHMENT_TYPE.POINTS);
  
  // 选中的用户
  const [userId, setUserId] = useState<string>('');
  const userIndex = useMemo(() => {
    if (!userId) {
      return;
    }
    const index = userContacts.findIndex(item => item.id === userId);
    return index === -1 ? undefined : index;
  }, [userId, userContacts]);
  
  // 惩罚积分数量
  const [pointsAmount, setPointsAmount] = useState<string>('');
  
  // 惩罚祈愿券数量
  const [drawCount, setDrawCount] = useState<string>('');
  
  // 回收的优惠券ID
  const [couponId, setCouponId] = useState<string>('');
  
  // 获取用户优惠券列表
  const { activeCoupons } = useUserCouponList({
    enableActiveIds: true,
    userId,
  });
  const hasActiveCoupons = Boolean(activeCoupons.length) && userId;
  
  const couponIndex = useMemo(() => {
    if (!couponId) {
      return;
    }
    const index = activeCoupons.findIndex(item => item.id === couponId);
    return index === -1 ? undefined : index;
  }, [couponId, activeCoupons]);
  
  // 惩罚原因
  const [reason, setReason] = useState<string>('');
  
  const handleSelectPunishmentType = useCallback((type: PUNISHMENT_TYPE, checked: boolean) => {
    if (!checked) {
      return;
    }
    setPunishmentType(type);
  }, []);

  const handleEditCoupon = useCallback(() => {
    navigateToPage({
      pageName: PAGE_ID.COUPON,
    });
  }, []);
  
  const handleSubmit = useCallback(() => {
    // 实际实现会调用API提交数据
    console.log('提交惩罚', {
      userId,
      type: punishmentType,
      points: punishmentType === PUNISHMENT_TYPE.POINTS ? pointsAmount : undefined,
      couponId: punishmentType === PUNISHMENT_TYPE.COUPON ? couponId : undefined,
      drawCount: punishmentType === PUNISHMENT_TYPE.LUCKY_DRAW ? drawCount : undefined,
      reason,
    });
    
    // 清空表单
    setUserId('');
    setPointsAmount('');
    setDrawCount('');
    setCouponId('');
    setReason('');
  }, [userId, punishmentType, pointsAmount, couponId, drawCount, reason]);
  
  const isSubmitDisabled = useMemo(() => {
    if (!userId || !reason) {
      return true;
    }
    
    if (punishmentType === PUNISHMENT_TYPE.POINTS && !pointsAmount) {
      return true;
    }
    
    if (punishmentType === PUNISHMENT_TYPE.COUPON && !couponId) {
      return true;
    }
    
    if (punishmentType === PUNISHMENT_TYPE.LUCKY_DRAW && !drawCount) {
      return true;
    }
    
    return false;
  }, [userId, reason, punishmentType, pointsAmount, couponId, drawCount]);
  
  return (
    <Layout type='card'>
      <FormItem title='选择用户' required>
        <PickerSelector
          placeholder='请选择用户'
          type='select'
          mode='selector'
          range={userContacts}
          rangeKey='name'
          onChange={e => setUserId(userContacts[Number(e.detail.value)]?.id)}
          value={userIndex}
        />
      </FormItem>
      
      <FormItem title='惩罚类型' required>
        <View className={styles.checkButtonWrapper}>
          <CheckButton
            label='积分'
            checked={punishmentType === PUNISHMENT_TYPE.POINTS}
            onChange={v => handleSelectPunishmentType(PUNISHMENT_TYPE.POINTS, v)}
          />
          <WhiteSpace isVertical={false} size='medium' />
          <CheckButton
            label='优惠券'
            checked={punishmentType === PUNISHMENT_TYPE.COUPON}
            onChange={v => handleSelectPunishmentType(PUNISHMENT_TYPE.COUPON, v)}
          />
          <WhiteSpace isVertical={false} size='medium' />
          <CheckButton
            label='祈愿券'
            checked={punishmentType === PUNISHMENT_TYPE.LUCKY_DRAW}
            onChange={v => handleSelectPunishmentType(PUNISHMENT_TYPE.LUCKY_DRAW, v)}
          />
        </View>
        <WhiteSpace size='small' />
        {punishmentType === PUNISHMENT_TYPE.POINTS && (
          <Input
            type='number'
            placeholder='请输入扣除的积分数量'
            value={pointsAmount}
            onInput={e => setPointsAmount(e.detail.value)}
          />
        )}
        
        {punishmentType === PUNISHMENT_TYPE.COUPON && (
          <PickerSelector
            placeholder={hasActiveCoupons ? '请选择回收的优惠券' : '暂无优惠券'}
            type='select'
            mode='selector'
            range={activeCoupons}
            rangeKey='name'
            onChange={e => setCouponId(activeCoupons[Number(e.detail.value)]?.id)}
            value={couponIndex}
            disabled={!hasActiveCoupons}
          />
        )}
        
        {punishmentType === PUNISHMENT_TYPE.LUCKY_DRAW && (
          <Input
            type='number'
            placeholder='请输入扣除的祈愿券数量'
            value={drawCount}
            onInput={e => setDrawCount(e.detail.value)}
          />
        )}
      </FormItem>
      
      <FormItem title='惩罚原因' required>
        <Textarea
          placeholder='请输入惩罚原因'
          value={reason}
          onInput={e => setReason(e.detail.value)}
        />
      </FormItem>
      
      <Button
        width='100%'
        type='primary'
        size='large'
        disabled={isSubmitDisabled}
        onClick={handleSubmit}
      >
        确认惩罚
      </Button>
    </Layout>
  );
} 