import { Fragment, useCallback, useMemo, useState } from 'react';
import { navigateBack, useRouter } from '@tarojs/taro';
import { navigateToPage } from '@shared/utils/router';
import { STORE_NAME } from '@core';
import {
  Button,
  Input,
  PickerSelector,
  Rate,
  StatusWrapper,
  Textarea,
  WhiteSpace,
} from '@ui/components';
import { FormItem, Layout } from '@ui/container';
import { useLoading } from '@ui/hooks';
import {
  TASK_ACTION_ID,
  usePrizeSelector,
  useStoreById,
  useStoreList,
  useTaskAction,
} from '@ui/viewModel';
import { PAGE_ID } from '@/shared/utils/constants';
import { TASK_TYPE_LIST } from './constants';
import styles from './index.module.scss';

export default function () {
  const router = useRouter();
  const id = router.params.id;
  const isLoading = useLoading();
  const { isActionLoading, currentActionId, handleUpdate, handleDelete } = useTaskAction();
  const task = useStoreById(STORE_NAME.TASK, id);
  // 任务名称
  const [taskName, setTaskName] = useState(task?.name ?? '');
  // 任务描述
  const [taskDesc, setTaskDesc] = useState(task?.desc ?? '');
  // 任务类型
  const [taskTypeId, setTaskTypeId] = useState(task?.type);
  const taskTypeIndex = useMemo(() => {
    if (!taskTypeId) {
      return;
    }
    const index = TASK_TYPE_LIST.findIndex(item => item.id === taskTypeId);
    return index === -1 ? undefined : index;
  }, [taskTypeId]);
  // 任务分类
  const taskCategoryList = useStoreList(STORE_NAME.TASK_CATEGORY);
  const [taskCategoryId, setTaskCategoryId] = useState(task?.categoryId);
  const taskCategoryIndex = useMemo(() => {
    if (!taskCategoryId) {
      return;
    }
    const index = taskCategoryList.findIndex(item => item.id === taskCategoryId);
    return index === -1 ? undefined : index;
  }, [taskCategoryId, taskCategoryList]);

  // 任务难度
  const [taskDifficulty, setTaskDifficulty] = useState(task?.difficulty ?? 1);

  // 奖品
  const { prizeId, PrizeSelector } = usePrizeSelector({ defaultValue: task?.prizeId });

  const handleEditPrize = useCallback(() => {
    navigateToPage({
      pageName: PAGE_ID.PRIZE_MANAGE,
    });
  }, []);

  const handleEditCategory = useCallback(() => {
    navigateToPage({ pageName: PAGE_ID.TASK_CATEGORY_MANAGE });
  }, []);

  const handleSave = useCallback(() => {
    const type = typeof taskTypeIndex === 'number' ? TASK_TYPE_LIST[taskTypeIndex].id : undefined;
    handleUpdate({
      id: task?.id,
      name: taskName,
      desc: taskDesc,
      type,
      categoryId: taskCategoryId,
      difficulty: taskDifficulty,
      prizeId,
      onSuccess: () => navigateBack(),
    });
  }, [
    handleUpdate,
    prizeId,
    task?.id,
    taskCategoryId,
    taskDesc,
    taskDifficulty,
    taskName,
    taskTypeIndex,
  ]);

  const handleDeleteTask = useCallback(async () => {
    if (!id) {
      return;
    }
    await handleDelete({
      id,
      onSuccess: () => navigateBack(),
    });
  }, [handleDelete, id]);

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
            onChange={e => setTaskTypeId(TASK_TYPE_LIST[Number(e.detail.value)].id)}
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
            onChange={e => setTaskCategoryId(taskCategoryList[Number(e.detail.value)]?.id)}
            value={taskCategoryIndex}
          />
        </FormItem>
        <FormItem title='任务难度' required>
          <Rate size={24} value={taskDifficulty} onChange={setTaskDifficulty} />
        </FormItem>
        <FormItem title='任务奖励' required showSettingEntrance onSettingClick={handleEditPrize}>
          {PrizeSelector}
        </FormItem>
        {/* <FormItem title='奖励类型' required>
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
              onChange={e => setCouponId(activeCoupons[Number(e.detail.value)]?.id)}
              value={couponIndex}
            />
          ) : null}
        </FormItem> */}
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
        {id ? (
          <Fragment>
            <WhiteSpace size='medium' />
            <Button
              width='100%'
              type='plain'
              size='large'
              disabled={isActionLoading}
              loading={isActionLoading && currentActionId === TASK_ACTION_ID.DELETE_TASK}
              onClick={handleDeleteTask}
            >
              删除
            </Button>
          </Fragment>
        ) : null}
      </Layout>
    </StatusWrapper>
  );
}
