import { useCallback, useMemo, useState } from 'react';
import { navigateBack } from '@tarojs/taro';
import { DISCIPLINE_TYPE, PRIZE_TYPE } from '@core/constants';
import { Button, PickerSelector, Textarea } from '@ui/components';
import { FormItem, Layout } from '@ui/container';
import { useSyncOnPageShow } from '@ui/hooks';
import {
  ActivePrize,
  useContactList,
  useDisciplineAction,
  usePrizeSelector,
  useUserCouponList,
} from '@ui/viewModel';
import styles from './index.module.scss';

const DISCIPLINE_TYPE_LIST = [
  { id: DISCIPLINE_TYPE.REWARD, name: '奖励' },
  { id: DISCIPLINE_TYPE.PUNISHMENT, name: '惩罚' },
];

export default function () {
  const { scrollViewRefreshProps } = useSyncOnPageShow();
  // 获取用户列表
  const { userContacts } = useContactList();

  // 惩罚/奖励类型
  const [disciplineType, setDisciplineType] = useState(DISCIPLINE_TYPE.REWARD);

  const disciplineTypeIndex = useMemo(() => {
    return DISCIPLINE_TYPE_LIST.findIndex(item => item.id === disciplineType);
  }, [disciplineType]);

  const isPunishment = disciplineType === DISCIPLINE_TYPE.PUNISHMENT;

  // 选中的用户
  const [userId, setUserId] = useState<string>();
  const userIndex = useMemo(() => {
    if (!userId) {
      return;
    }
    const index = userContacts.findIndex(item => item.id === userId);
    return index === -1 ? undefined : index;
  }, [userId, userContacts]);

  // 用户可用奖品/惩品
  const { activeCoupons } = useUserCouponList({
    enableActiveIds: true,
    userId,
  });
  const activeCouponIds = useMemo(() => {
    return activeCoupons.map(item => item.plainCouponId);
  }, [activeCoupons]);
  const isMatchPrizeFunc = useCallback(
    (prize: ActivePrize) => {
      // 奖励可用选择全部优惠券
      if (
        disciplineType === DISCIPLINE_TYPE.REWARD ||
        prize.type !== PRIZE_TYPE.COUPON ||
        !prize.couponId
      ) {
        return true;
      }
      // 如果是优惠券，则需要判断是否用户拥有且有效
      return activeCouponIds.includes(prize.couponId);
    },
    [activeCouponIds, disciplineType],
  );

  // 使用奖品选择器
  const { prizeId, setPrizeId, PrizeSelector } = usePrizeSelector({
    includeLuckyDraw: true,
    isMatchFunc: isMatchPrizeFunc,
    placeholder: `请选择${isPunishment ? '惩罚' : '奖励'}内容`,
  });

  // 惩罚/奖励原因
  const [reason, setReason] = useState('');

  // 切换类型
  const handleDisciplineTypeChange = useCallback(
    (type: DISCIPLINE_TYPE) => {
      setDisciplineType(type);
      setUserId(undefined);
      setPrizeId(undefined);
      setReason('');
    },
    [setPrizeId],
  );

  // 使用奖惩操作
  const { handleCreate, isCreateLoading } = useDisciplineAction();

  const handleSubmit = useCallback(() => {
    handleCreate({
      userId,
      prizeId,
      type: disciplineType,
      reason,
      onSuccess: () => navigateBack(),
    });
  }, [handleCreate, userId, prizeId, disciplineType, reason]);

  const isSubmitDisabled = useMemo(() => {
    if (!userId || !reason || !prizeId) {
      return true;
    }

    return false;
  }, [userId, reason, prizeId]);

  return (
    <Layout type='card' scrollViewProps={scrollViewRefreshProps}>
      <FormItem title='操作类型' required>
        <PickerSelector
          placeholder='请选择操作类型'
          type='select'
          mode='selector'
          range={DISCIPLINE_TYPE_LIST}
          rangeKey='name'
          onChange={e =>
            handleDisciplineTypeChange(DISCIPLINE_TYPE_LIST[Number(e.detail.value)]?.id)
          }
          value={disciplineTypeIndex}
        />
      </FormItem>

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

      {userId ? (
        <FormItem title={isPunishment ? '惩罚类型' : '奖励类型'} required>
          {PrizeSelector}
        </FormItem>
      ) : null}

      <FormItem title={isPunishment ? '惩罚原因' : '奖励原因'} required>
        <Textarea
          placeholder={
            disciplineType === DISCIPLINE_TYPE.PUNISHMENT ? '请输入惩罚原因' : '请输入奖励原因'
          }
          value={reason}
          onInput={e => setReason(e.detail.value)}
        />
      </FormItem>

      <Button
        width='100%'
        type='primary'
        size='large'
        disabled={isSubmitDisabled || isCreateLoading}
        loading={isCreateLoading}
        onClick={handleSubmit}
      >
        {isPunishment ? '确认惩罚' : '确认奖励'}
      </Button>
    </Layout>
  );
}
