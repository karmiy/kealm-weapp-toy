import { useCallback, useMemo, useRef, useState } from 'react';
import { View } from '@tarojs/components';
import isNil from 'lodash/isNil';
import { COLOR_VARIABLES, PAGE_ID } from '@shared/utils/constants';
import { showModal, showToast } from '@shared/utils/operateFeedback';
import { navigateToPage } from '@shared/utils/router';
import { sleep } from '@shared/utils/utils';
import {
  Button,
  CheckButton,
  FloatLayout,
  Icon,
  Input,
  PickerSelector,
  SortableItem,
  SortableList,
  WhiteSpace,
} from '@ui/components';
import { FormItem, Layout } from '@ui/container';
import { useCoupon } from '@ui/viewModel';
import { PrizeItem, PrizeItemProps } from './components';
import { LUCKY_DRAW_TYPE, LUCKY_DRAW_TYPE_LIST, MAX_PRIZE_COUNT, PRIZE_TYPE } from './constants';
import styles from './index.module.scss';

export default function () {
  // 祈愿池名称
  const [drawName, setDrawName] = useState('');

  // 祈愿池奖品列表
  const [prizeList, setPrizeList] = useState<Array<PrizeItemProps & { id?: string }>>([]);

  // 祈愿池类型
  const [drawTypeIndex, setDrawTypeIndex] = useState<number>();
  const handleDrawTypeChange = useCallback(
    (index: number) => {
      const nextType = LUCKY_DRAW_TYPE_LIST[index].value;
      // 宫格 -> 转盘，需要检测是否超出最大数量
      const maxCount = MAX_PRIZE_COUNT[nextType];
      if (prizeList.length > maxCount) {
        showToast({
          title: `该祈愿池奖品不能超过 ${maxCount} 个，请先删除多余的奖品`,
          icon: 'none',
        });
        setDrawTypeIndex(drawTypeIndex);
        return;
      }
      setDrawTypeIndex(index);
    },
    [drawTypeIndex, prizeList.length],
  );
  const drawType = useMemo(() => {
    if (isNil(drawTypeIndex)) {
      return;
    }
    return LUCKY_DRAW_TYPE_LIST[drawTypeIndex].value;
  }, [drawTypeIndex]);
  const drawTypeTip = useMemo(() => {
    if (isNil(drawType)) {
      return;
    }
    if (drawType === LUCKY_DRAW_TYPE.WHEEL) {
      return '转盘最大奖品数量 10';
    }
    return '宫格最大奖品数量 24，建议配置 8/11/15/19/24 个奖品';
  }, [drawType]);
  const maxPrizeCount = useMemo(() => {
    if (isNil(drawType)) {
      return MAX_PRIZE_COUNT.DEFAULT;
    }
    return MAX_PRIZE_COUNT[drawType];
  }, [drawType]);

  // 祈愿券数量
  const [drawQuantity, setDrawQuantity] = useState('');

  // 奖品编辑弹框
  const [showEditModal, setShowEditModal] = useState(false);
  const editedPrizeRef = useRef<{ index?: number }>({});
  const getEditedPrizeIndex = useCallback(() => {
    return editedPrizeRef.current.index;
  }, []);
  const setEditedPrizeIndex = useCallback((index?: number) => {
    editedPrizeRef.current.index = index;
  }, []);
  // 奖品类型
  const [prizeType, setPrizeType] = useState(PRIZE_TYPE.POINTS);

  // 奖品编辑弹框 - 选择 - 积分
  const [pointsValue, setPointsValue] = useState('');
  // 奖品编辑弹框 - 选择 - 优惠券
  const { activeCoupons } = useCoupon({
    enableActiveIds: true,
  });
  const [couponId, setCouponId] = useState<string>();
  const couponIndex = useMemo(() => {
    if (!couponId) {
      return;
    }
    const index = activeCoupons.findIndex(item => item.id === couponId);
    return index === -1 ? undefined : index;
  }, [couponId, activeCoupons]);

  // 奖品编辑弹框 - 奖品权重
  const [prizeRange, setPrizeRange] = useState<string>('');
  const totalRange = useMemo(() => {
    return prizeList.reduce((acc, item) => acc + (item.range ?? 0), 0);
  }, [prizeList]);

  const isSavePrizeBtnDisabled = useMemo(() => {
    if (!Number(prizeRange)) {
      return true;
    }
    if (prizeType === PRIZE_TYPE.NONE) {
      return false;
    }
    if (prizeType === PRIZE_TYPE.POINTS) {
      return !Number(pointsValue);
    }
    if (prizeType === PRIZE_TYPE.COUPON) {
      return !couponId;
    }
  }, [prizeRange, prizeType, pointsValue, couponId]);

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

  const clearEditModel = useCallback(() => {
    setEditedPrizeIndex();
    setCouponId(undefined);
    setPointsValue('');
    setPrizeType(PRIZE_TYPE.POINTS);
    setPrizeRange('');
  }, [setEditedPrizeIndex]);

  const handleCloseEditModal = useCallback(async () => {
    setShowEditModal(false);
    await sleep(500);
    clearEditModel();
  }, [clearEditModel]);

  const handleAddPrize = useCallback(() => {
    setEditedPrizeIndex();
    setShowEditModal(true);
  }, [setEditedPrizeIndex]);

  const handleSavePrize = useCallback(() => {
    const editIndex = getEditedPrizeIndex();
    setPrizeList(prev => {
      if (isNil(editIndex)) {
        return [
          {
            type: prizeType,
            points: Number(pointsValue),
            couponId,
            range: Number(prizeRange),
          },
          ...prev,
        ];
      }
      const prevPrize = { ...prev[editIndex] };
      prevPrize.type = prizeType;
      prevPrize.points = Number(pointsValue);
      prevPrize.couponId = couponId;
      prevPrize.range = Number(prizeRange);
      const newArray = [...prev];
      newArray.splice(editIndex, 1, prevPrize);
      return newArray;
    });
    handleCloseEditModal();
  }, [couponId, getEditedPrizeIndex, handleCloseEditModal, pointsValue, prizeRange, prizeType]);

  const handleEditPrize = useCallback(
    (index: number) => {
      setEditedPrizeIndex(index);
      const prize = prizeList[index];
      const { type, points, couponId: prizeCouponId } = prize;
      if (type === PRIZE_TYPE.POINTS) {
        setPointsValue(points?.toString() ?? '');
        setPrizeType(PRIZE_TYPE.POINTS);
      } else if (type === PRIZE_TYPE.COUPON) {
        setCouponId(prizeCouponId);
        setPrizeType(PRIZE_TYPE.COUPON);
      } else if (type === PRIZE_TYPE.NONE) {
        setPrizeType(PRIZE_TYPE.NONE);
      }
      setPrizeRange(prize.range?.toString() ?? '');
      setShowEditModal(true);
    },
    [prizeList, setEditedPrizeIndex],
  );

  const handleDeletePrize = useCallback(async (index: number) => {
    const feedback = await showModal({
      content: '确定要删除吗？',
    });
    if (!feedback) {
      return;
    }
    setPrizeList(prev => {
      const newArray = [...prev];
      newArray.splice(index, 1);
      return newArray;
    });
  }, []);

  const handleSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      const newArray = [...prizeList];
      const [removedItem] = newArray.splice(oldIndex, 1);
      newArray.splice(newIndex, 0, removedItem);
      setPrizeList(newArray);
    },
    [prizeList],
  );

  return (
    <Layout type='card'>
      <FormItem title='祈愿池名称' required>
        <Input
          placeholder='请输入祈愿池名称'
          value={drawName}
          onInput={e => setDrawName(e.detail.value)}
        />
      </FormItem>
      <FormItem title='祈愿券' required>
        <Input
          placeholder='请输入所需祈愿券数量'
          type='number'
          value={drawQuantity}
          onInput={e => setDrawQuantity(e.detail.value)}
        />
      </FormItem>
      <FormItem title='祈愿池类型' required>
        <PickerSelector
          placeholder='请选择祈愿池类型'
          type='select'
          mode='selector'
          range={LUCKY_DRAW_TYPE_LIST}
          rangeKey='label'
          onChange={e => handleDrawTypeChange(Number(e.detail.value))}
          value={drawTypeIndex}
        />
        {drawTypeTip ? (
          <>
            <WhiteSpace size='small' />
            <View className={styles.tip}>注：{drawTypeTip}</View>
          </>
        ) : null}
      </FormItem>
      <FormItem title='奖品配置' required>
        <View className={styles.actionButtonWrapper}>
          <Button
            type='plain'
            icon='add'
            size='small'
            onClick={handleAddPrize}
            disabled={prizeList.length >= maxPrizeCount}
          >
            添加奖品
          </Button>
          <WhiteSpace isVertical={false} size='small' />
          <Button type='primary' icon='present' size='small' disabled={!prizeList.length}>
            预览祈愿池
          </Button>
        </View>
        <WhiteSpace size='small' />
        <FloatLayout visible={showEditModal} onClose={handleCloseEditModal}>
          <View className={styles.editModalWrapper}>
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
                <WhiteSpace isVertical={false} size='medium' />
                <CheckButton
                  label='谢谢惠顾'
                  checked={prizeType === PRIZE_TYPE.NONE}
                  onChange={v => handleSelectPrizeType(PRIZE_TYPE.NONE, v)}
                />
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
              <WhiteSpace size='small' />
              <Input
                type='number'
                placeholder='请输入权重值'
                value={prizeRange}
                onInput={e => setPrizeRange(e.detail.value)}
              />
              <WhiteSpace size='small' />
              <View className={styles.tip}>
                注：权重值体现了奖品的中奖概率（示例：权重 2，总奖品权重和 10，则中奖率 20%）
              </View>
            </FormItem>
            <Button
              size='large'
              width='100%'
              onClick={handleSavePrize}
              disabled={isSavePrizeBtnDisabled}
            >
              确定
            </Button>
          </View>
        </FloatLayout>
      </FormItem>
      <SortableList onSortEnd={handleSortEnd}>
        {prizeList.map((item, index) => {
          return (
            <SortableItem key={item.id ?? index} index={index}>
              <PrizeItem
                {...item}
                totalRange={totalRange}
                onEdit={() => handleEditPrize(index)}
                onDelete={() => handleDeletePrize(index)}
              />
              <WhiteSpace size='medium' />
            </SortableItem>
          );
        })}
      </SortableList>
      <Button width='100%' type='primary' size='large'>
        保存
      </Button>
    </Layout>
  );
}
