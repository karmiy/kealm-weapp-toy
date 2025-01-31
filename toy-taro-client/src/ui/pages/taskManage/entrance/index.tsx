import { useCallback, useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import { navigateBack, useRouter } from '@tarojs/taro';
import { Undefinable } from '@shared/types';
import { navigateToPage } from '@shared/utils/router';
import { COUPON_TYPE, STORE_NAME, TASK_REWARD_TYPE } from '@core';
import {
  Button,
  CheckButton,
  Icon,
  Input,
  PickerSelector,
  Rate,
  StatusWrapper,
  Textarea,
  WhiteSpace,
} from '@ui/components';
import { FormItem, Layout } from '@ui/container';
import { useLoading } from '@ui/hooks';
import { useCoupon, useStoreById, useStoreList, useTaskAction } from '@ui/viewModel';
import { COLOR_VARIABLES, PAGE_ID } from '@/shared/utils/constants';
import { TASK_REWARD_SELECT_TYPE, TASK_TYPE_LIST } from './constants';
import styles from './index.module.scss';

export default function () {
  const router = useRouter();
  const isLoading = useLoading();
  const { isActionLoading, handleUpdate } = useTaskAction();
  const task = useStoreById(STORE_NAME.TASK, router.params.id);
  const coupon = useStoreById(STORE_NAME.COUPON, task?.couponId);
  // 任务名称
  const [taskName, setTaskName] = useState(task?.name ?? '');
  // 任务描述
  const [taskDesc, setTaskDesc] = useState(task?.desc ?? '');
  // 任务类型
  const [taskTypeIndex, setTaskTypeIndex] = useState<Undefinable<number>>(() => {
    if (!task) {
      return;
    }
    const index = TASK_TYPE_LIST.findIndex(item => item.id === task.type);
    return index === -1 ? undefined : index;
  });
  // 任务分类
  const taskCategoryList = useStoreList(STORE_NAME.TASK_CATEGORY);
  const [taskCategoryIndex, setTaskCategoryIndex] = useState<Undefinable<number>>(() => {
    if (!task) {
      return;
    }
    const index = taskCategoryList.findIndex(item => item.id === task.categoryId);
    return index === -1 ? undefined : index;
  });
  // 任务难度
  const [taskDifficulty, setTaskDifficulty] = useState(task?.difficulty ?? 1);
  // 任务奖励类型
  const [taskRewardType, setTaskRewardType] = useState(
    task?.isCouponReward ? TASK_REWARD_SELECT_TYPE.COUPON : TASK_REWARD_SELECT_TYPE.POINTS,
  );

  const handleSelectTaskRewardType = useCallback(
    (type: TASK_REWARD_SELECT_TYPE, checked: boolean) => {
      if (!checked) {
        return;
      }
      setTaskRewardType(type);
    },
    [],
  );

  // 奖励类型 - 积分
  const [pointsValue, setPointsValue] = useState(() => task?.pointsValue?.toString() ?? '');
  // 奖励类型 - 优惠券
  const { activeCoupons } = useCoupon({
    enableActiveIds: true,
  });
  const [couponIndex, setCouponIndex] = useState<Undefinable<number>>();

  useEffect(() => {
    if (!coupon?.id) {
      return;
    }
    const index = activeCoupons.findIndex(item => item.id === coupon.id);
    setCouponIndex(index === -1 ? undefined : index);
  }, [activeCoupons, coupon?.id]);

  const handleEditCoupon = useCallback(() => {
    navigateToPage({
      pageName: PAGE_ID.COUPON,
    });
  }, []);

  const handleEditCategory = useCallback(() => {
    navigateToPage({ pageName: PAGE_ID.TASK_CATEGORY_MANAGE });
  }, []);

  const handleSave = useCallback(() => {
    const type = typeof taskTypeIndex === 'number' ? TASK_TYPE_LIST[taskTypeIndex].id : undefined;
    const categoryId =
      typeof taskCategoryIndex === 'number' ? taskCategoryList[taskCategoryIndex].id : undefined;
    const selectedCoupon = typeof couponIndex === 'number' ? activeCoupons[couponIndex] : undefined;
    const couponType =
      selectedCoupon?.originalType === COUPON_TYPE.CASH_DISCOUNT
        ? TASK_REWARD_TYPE.CASH_DISCOUNT
        : TASK_REWARD_TYPE.PERCENTAGE_DISCOUNT;
    const rewardType =
      taskRewardType === TASK_REWARD_SELECT_TYPE.POINTS ? TASK_REWARD_TYPE.POINTS : couponType;
    handleUpdate({
      id: task?.id,
      name: taskName,
      desc: taskDesc,
      type,
      categoryId,
      difficulty: taskDifficulty,
      rewardType,
      couponId: selectedCoupon?.id,
      value: pointsValue,
      onSuccess: () => navigateBack(),
    });
  }, [
    activeCoupons,
    couponIndex,
    handleUpdate,
    pointsValue,
    task?.id,
    taskCategoryIndex,
    taskCategoryList,
    taskDesc,
    taskDifficulty,
    taskName,
    taskRewardType,
    taskTypeIndex,
  ]);

  return (
    <StatusWrapper loading={isLoading} count={isLoading ? 0 : 1} size='overlay'>
      <Layout type='card'>
        <FormItem title='任务标题' required>
          <Input
            placeholder='请输入任务标题'
            value={taskName}
            onInput={e => setTaskName(e.detail.value)}
          />
        </FormItem>
        <FormItem title='任务描述' required>
          <Textarea
            placeholder='请输入任务描述'
            value={taskDesc}
            onInput={e => setTaskDesc(e.detail.value)}
          />
        </FormItem>
        <FormItem title='任务类型' required>
          <PickerSelector
            placeholder='请选择任务类型'
            type='select'
            mode='selector'
            range={TASK_TYPE_LIST}
            rangeKey='name'
            onChange={e => setTaskTypeIndex(Number(e.detail.value))}
            value={taskTypeIndex}
          />
        </FormItem>
        <FormItem title='任务分类' required showSettingEntrance onSettingClick={handleEditCategory}>
          <PickerSelector
            placeholder='请选择任务分类'
            type='select'
            mode='selector'
            range={taskCategoryList}
            rangeKey='name'
            onChange={e => setTaskCategoryIndex(Number(e.detail.value))}
            value={taskCategoryIndex}
          />
        </FormItem>
        <FormItem title='任务难度' required>
          <Rate size={24} value={taskDifficulty} onChange={setTaskDifficulty} />
        </FormItem>
        <FormItem title='奖励类型' required>
          <View className={styles.checkButtonWrapper}>
            <CheckButton
              label='积分'
              checked={taskRewardType === TASK_REWARD_SELECT_TYPE.POINTS}
              onChange={v => handleSelectTaskRewardType(TASK_REWARD_SELECT_TYPE.POINTS, v)}
            />
            <WhiteSpace isVertical={false} size='medium' />
            <CheckButton
              label='优惠券'
              checked={taskRewardType === TASK_REWARD_SELECT_TYPE.COUPON}
              onChange={v => handleSelectTaskRewardType(TASK_REWARD_SELECT_TYPE.COUPON, v)}
            />
            <View className={styles.editCoupon} onClick={handleEditCoupon}>
              <Icon name='edit' color={COLOR_VARIABLES.COLOR_RED} />
            </View>
          </View>
          <WhiteSpace size='small' />
          {taskRewardType === TASK_REWARD_SELECT_TYPE.POINTS ? (
            <Input
              type='number'
              placeholder='请输入奖励积分'
              value={pointsValue}
              onInput={e => setPointsValue(e.detail.value)}
            />
          ) : null}
          {taskRewardType === TASK_REWARD_SELECT_TYPE.COUPON ? (
            <PickerSelector
              placeholder='请选择优惠券'
              type='select'
              mode='selector'
              range={activeCoupons}
              rangeKey='detailTip'
              onChange={e => setCouponIndex(Number(e.detail.value))}
              value={couponIndex}
            />
          ) : null}
        </FormItem>
        <Button
          width='100%'
          type='primary'
          size='large'
          disabled={isActionLoading}
          onClick={handleSave}
          loading={isActionLoading}
        >
          保存
        </Button>
      </Layout>
    </StatusWrapper>
  );
}
