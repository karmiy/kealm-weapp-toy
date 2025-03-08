import { useCallback, useMemo, useRef, useState } from 'react';
import { View } from '@tarojs/components';
import { navigateBack, useRouter } from '@tarojs/taro';
import isNil from 'lodash/isNil';
import type { File } from 'taro-ui/types/image-picker';
import { PAGE_ID } from '@shared/utils/constants';
import { showModal, showToast } from '@shared/utils/operateFeedback';
import { navigateToPage } from '@shared/utils/router';
import { sleep } from '@shared/utils/utils';
import {
  Button,
  FloatLayout,
  ImagePicker,
  Input,
  PickerSelector,
  SortableItem,
  SortableList,
  WhiteSpace,
} from '@ui/components';
import { FormItem, Layout } from '@ui/container';
import { useLuckyDrawAction, useLuckyDrawItem, usePrizeSelector } from '@ui/viewModel';
import { PrizeItem, PrizeItemProps } from './components';
import { LUCKY_DRAW_TYPE, LUCKY_DRAW_TYPE_LIST, MAX_PRIZE_COUNT } from './constants';
import styles from './index.module.scss';

export default function () {
  const router = useRouter();
  const id = router.params.id;
  const { luckyDraw } = useLuckyDrawItem({ id });
  const { createPreview, isUpdateLoading, handleUpdate, handleDelete, isDeleteLoading } =
    useLuckyDrawAction();
  // 祈愿池封面
  const [pictures, setPictures] = useState<File[]>(() => {
    if (!luckyDraw) {
      return [];
    }
    return [{ url: luckyDraw.coverImageUrl }];
  });
  // 祈愿池名称
  const [drawName, setDrawName] = useState(luckyDraw?.name ?? '');

  // 祈愿池奖品列表
  const [prizeList, setPrizeList] = useState<Array<PrizeItemProps>>(() => {
    return (
      luckyDraw?.list.map(item => ({
        id: item.prize_id,
        range: item.range,
      })) ?? []
    );
  });

  // 祈愿池类型
  const [drawType, setDrawType] = useState(luckyDraw?.type);
  const drawTypeIndex = useMemo(() => {
    if (!drawType) {
      return;
    }
    const index = LUCKY_DRAW_TYPE_LIST.findIndex(item => item.value === drawType);
    return index === -1 ? undefined : index;
  }, [drawType]);
  // const [drawTypeIndex, setDrawTypeIndex] = useState<number>();
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
        setDrawType(drawType);
        return;
      }
      setDrawType(nextType);
    },
    [drawType, prizeList.length],
  );
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
  const [drawQuantity, setDrawQuantity] = useState(luckyDraw?.quantity.toString() ?? '');

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
  // 奖品编辑弹框 - 选择 - 奖品
  const { prizeId, setPrizeId, PrizeSelector } = usePrizeSelector({
    includeNone: true,
    includeLuckyDraw: false,
  });

  // 奖品编辑弹框 - 奖品权重
  const [prizeRange, setPrizeRange] = useState<string>('');
  const totalRange = useMemo(() => {
    return prizeList.reduce((acc, item) => acc + (item.range ?? 0), 0);
  }, [prizeList]);

  const isSavePrizeBtnDisabled = useMemo(() => {
    if (!Number(prizeRange)) {
      return true;
    }
    return !prizeId;
  }, [prizeId, prizeRange]);

  const handleGoToEditPrize = useCallback(() => {
    navigateToPage({
      pageName: PAGE_ID.PRIZE_MANAGE,
    });
  }, []);

  const clearEditModel = useCallback(() => {
    setEditedPrizeIndex();
    setPrizeId(undefined);
    setPrizeRange('');
  }, [setEditedPrizeIndex, setPrizeId]);

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
    if (!prizeId) {
      showToast({
        title: '奖品不能为空',
      });
      return;
    }
    setPrizeList(prev => {
      if (isNil(editIndex)) {
        return [
          {
            id: prizeId,
            range: Number(prizeRange),
          },
          ...prev,
        ];
      }
      const prevPrize = { ...prev[editIndex] };
      prevPrize.id = prizeId;
      prevPrize.range = Number(prizeRange);
      const newArray = [...prev];
      newArray.splice(editIndex, 1, prevPrize);
      return newArray;
    });
    handleCloseEditModal();
  }, [getEditedPrizeIndex, handleCloseEditModal, prizeId, prizeRange]);

  const handleEditPrize = useCallback(
    (index: number) => {
      setEditedPrizeIndex(index);
      const prize = prizeList[index];
      setPrizeId(prize.id);
      setPrizeRange(prize.range?.toString() ?? '');
      setShowEditModal(true);
    },
    [prizeList, setEditedPrizeIndex, setPrizeId],
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

  const handlePreview = useCallback(() => {
    createPreview({
      coverImage: pictures[0]?.url,
      name: drawName,
      type: drawType,
      quantity: Number(drawQuantity),
      list: prizeList.map(item => {
        return {
          prize_id: item.id,
          range: item.range ?? 0,
        };
      }),
    });
  }, [createPreview, drawName, drawQuantity, drawType, prizeList, pictures]);

  const handleDeleteLuckyDraw = useCallback(async () => {
    if (!id) {
      return;
    }
    await handleDelete({
      id,
      onSuccess: () => navigateBack(),
    });
  }, [handleDelete, id]);

  const handleSave = useCallback(() => {
    handleUpdate({
      id,
      coverImage: pictures[0]?.url,
      name: drawName,
      type: drawType,
      quantity: Number(drawQuantity),
      list: prizeList.map(item => {
        return {
          prize_id: item.id,
          range: item.range ?? 0,
        };
      }),
      onSuccess: () => navigateBack(),
    });
  }, [drawName, drawQuantity, drawType, handleUpdate, id, pictures, prizeList]);

  return (
    <Layout type='card'>
      <FormItem title='祈愿池封面' required>
        <ImagePicker
          count={1}
          showAddBtn={!pictures.length}
          files={pictures}
          onChange={e => {
            setPictures(e);
          }}
        />
      </FormItem>
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
            添加奖品({prizeList.length})
          </Button>
          <WhiteSpace isVertical={false} size='small' />
          <Button
            type='primary'
            icon='present'
            size='small'
            disabled={!prizeList.length}
            onClick={handlePreview}
          >
            预览祈愿池
          </Button>
        </View>
        <WhiteSpace size='small' />
        <FloatLayout visible={showEditModal} onClose={handleCloseEditModal}>
          <View className={styles.editModalWrapper}>
            <FormItem
              title='奖品配置'
              required
              showSettingEntrance
              onSettingClick={handleGoToEditPrize}
            >
              {PrizeSelector}
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
            <SortableItem key={`${item.id}_${index}`} index={index}>
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
      <Button
        width='100%'
        type='primary'
        size='large'
        disabled={isUpdateLoading}
        loading={isUpdateLoading}
        onClick={handleSave}
      >
        保存
      </Button>
      {id ? (
        <>
          <WhiteSpace size='medium' />
          <Button
            width='100%'
            type='plain'
            size='large'
            disabled={isDeleteLoading}
            onClick={handleDeleteLuckyDraw}
          >
            删除
          </Button>
        </>
      ) : null}
    </Layout>
  );
}
