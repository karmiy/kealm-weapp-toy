import { Fragment, useCallback, useMemo, useState } from 'react';
import { navigateBack, useRouter } from '@tarojs/taro';
import { format } from 'date-fns';
import type { File } from 'taro-ui/types/image-picker';
import { PAGE_ID } from '@shared/utils/constants';
import { showToast } from '@shared/utils/operateFeedback';
import { navigateToPage } from '@shared/utils/router';
import { STORE_NAME } from '@core';
import {
  Button,
  ImagePicker,
  Input,
  PickerSelector,
  StatusWrapper,
  Textarea,
  WhiteSpace,
} from '@ui/components';
import { FormItem, Layout } from '@ui/container';
import { useLoading } from '@ui/hooks';
import { PRODUCT_ACTION_ID, useProductAction, useStoreById, useStoreList } from '@ui/viewModel';
// import styles from './index.module.scss';

export default function () {
  const router = useRouter();
  const isLoading = useLoading();
  const id = router.params.id;
  const product = useStoreById(STORE_NAME.PRODUCT, id);
  const { isActionLoading, currentActionId, handleUpdate, handleDelete } = useProductAction();
  // 商品图片
  const [pictures, setPictures] = useState<File[]>(() => {
    if (!product) {
      return [];
    }
    return [{ url: product.coverImageUrl }];
  });

  // 商品名称
  const [productName, setProductName] = useState(product?.name ?? '');
  // 商品描述
  const [productDesc, setProductDesc] = useState(product?.desc ?? '');
  // 商品分类
  const productCategoryList = useStoreList(STORE_NAME.PRODUCT_CATEGORY);
  const [productCategoryId, setProductCategoryId] = useState(product?.categoryId);
  const productCategoryIndex = useMemo(() => {
    if (!productCategoryId) {
      return;
    }
    const index = productCategoryList.findIndex(item => item.id === productCategoryId);
    return index === -1 ? undefined : index;
  }, [productCategoryId, productCategoryList]);

  const handleEditCategory = useCallback(() => {
    navigateToPage({ pageName: PAGE_ID.PRODUCT_CATEGORY_MANAGE });
  }, []);

  // 库存数量
  const [productStock, setProductStock] = useState(product?.stock.toString() ?? '');

  // 兑换积分
  const [productOriginalScore, setProductOriginalScore] = useState(
    product?.originalScore?.toString() ?? '',
  );

  // 特惠积分
  const [productDiscountedScore, setProductDiscountedScore] = useState(
    product?.discountedScore?.toString() ?? '',
  );

  // 范围日期
  const [startTime, setStartTime] = useState<string>(() => {
    if (!product?.flashSaleStart) {
      return '';
    }
    return format(product.flashSaleStart, 'yyyy-MM-dd');
  });
  const [endTime, setEndTime] = useState<string>(() => {
    if (!product?.flashSaleEnd) {
      return '';
    }
    return format(product.flashSaleEnd, 'yyyy-MM-dd');
  });
  const handleSelectStartTime = useCallback(
    (value: string) => {
      if (!endTime) {
        setStartTime(value);
        return;
      }
      if (new Date(value).getTime() > new Date(endTime).getTime()) {
        showToast({
          title: '开始日期不能大于结束日期',
        });
        return;
      }
      setStartTime(value);
    },
    [endTime],
  );
  const handleSelectEndTime = useCallback(
    (value: string) => {
      if (!startTime) {
        setEndTime(value);
        return;
      }
      if (new Date(value).getTime() < new Date(startTime).getTime()) {
        showToast({
          title: '结束日期需不能小于开始日期',
        });
        return;
      }
      setEndTime(value);
    },
    [startTime],
  );

  const handleSave = useCallback(() => {
    handleUpdate({
      id: product?.id,
      coverImage: pictures[0]?.url,
      name: productName,
      desc: productDesc,
      categoryId: productCategoryId,
      stock: Number(productStock),
      originalScore: productOriginalScore,
      discountedScore: productDiscountedScore,
      flashSaleStart: startTime,
      flashSaleEnd: endTime,
      onSuccess: () => navigateBack(),
    });
  }, [
    endTime,
    handleUpdate,
    pictures,
    productCategoryId,
    product?.id,
    productDesc,
    productDiscountedScore,
    productName,
    productOriginalScore,
    productStock,
    startTime,
  ]);

  const handleDeleteProduct = useCallback(async () => {
    if (!id) {
      return;
    }
    await handleDelete({
      id,
      onSuccess: () => navigateBack(),
    });
  }, [handleDelete, id]);

  return (
    <StatusWrapper loading={isLoading} loadingIgnoreCount count={1} size='overlay'>
      <Layout type='card'>
        <FormItem title='商品封面' required>
          <ImagePicker
            count={1}
            showAddBtn={!pictures.length}
            files={pictures}
            onChange={e => {
              setPictures(e);
            }}
          />
        </FormItem>
        <FormItem title='商品名称' required>
          <Input
            placeholder='请输入商品名称'
            value={productName}
            onInput={e => setProductName(e.detail.value)}
          />
        </FormItem>
        <FormItem title='商品描述' required>
          <Textarea
            placeholder='请输入商品描述'
            value={productDesc}
            onInput={e => setProductDesc(e.detail.value)}
          />
        </FormItem>
        <FormItem title='商品分类' required showSettingEntrance onSettingClick={handleEditCategory}>
          <PickerSelector
            placeholder='请选择商品分类'
            type='select'
            mode='selector'
            range={productCategoryList}
            rangeKey='name'
            onChange={e => setProductCategoryId(productCategoryList[Number(e.detail.value)]?.id)}
            value={productCategoryIndex}
          />
        </FormItem>
        <FormItem title='库存数量' required>
          {/* 注意 Number 下，可能输入 03 这种 */}
          <Input
            placeholder='请输入库存数量'
            type='number'
            value={productStock}
            onInput={e => setProductStock(e.detail.value)}
          />
        </FormItem>
        <FormItem title='兑换积分' required>
          <Input
            placeholder='请输入兑换积分'
            type='number'
            value={productOriginalScore}
            onInput={e => setProductOriginalScore(e.detail.value)}
          />
        </FormItem>
        <FormItem title='特惠积分'>
          <Input
            placeholder='请输入特惠积分'
            type='number'
            value={productDiscountedScore}
            onInput={e => setProductDiscountedScore(e.detail.value)}
          />
          <WhiteSpace size='small' />
          {productDiscountedScore ? (
            <>
              <PickerSelector
                placeholder='请选择特惠开始日期'
                type='select'
                mode='date'
                onChange={e => handleSelectStartTime(e.detail.value)}
                value={startTime}
              />
              <WhiteSpace size='small' />
              <PickerSelector
                placeholder='请选择特惠结束日期'
                type='select'
                mode='date'
                onChange={e => handleSelectEndTime(e.detail.value)}
                value={endTime}
              />
            </>
          ) : null}
        </FormItem>
        <Button
          width='100%'
          type='primary'
          size='large'
          disabled={isActionLoading}
          loading={isActionLoading && currentActionId === PRODUCT_ACTION_ID.UPDATE_PRODUCT}
          onClick={handleSave}
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
              loading={isActionLoading && currentActionId === PRODUCT_ACTION_ID.DELETE_PRODUCT}
              onClick={handleDeleteProduct}
            >
              删除
            </Button>
          </Fragment>
        ) : null}
      </Layout>
    </StatusWrapper>
  );
}
