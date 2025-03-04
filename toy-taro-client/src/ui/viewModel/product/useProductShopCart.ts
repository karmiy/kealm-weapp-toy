import { useCallback, useEffect, useState } from 'react';
import { reaction } from '@shared/utils/observer';
import { showToast } from '@shared/utils/operateFeedback';
import { sdk, STORE_NAME } from '@core';
import { ProductShopCartController } from '@ui/controller';
import { useDebounceFunc } from '@ui/hooks/useDebounceFunc';

interface Props {
  enableCheckIds?: boolean;
  enableCheckAll?: boolean;
  enableTotalScore?: boolean;
  enableAllProductIds?: boolean;
}

export function useProductShopCart(props?: Props) {
  const {
    enableCheckIds = false,
    enableCheckAll = false,
    enableTotalScore = false,
    enableAllProductIds = false,
  } = props ?? {};
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [allProductIds, setAllProductIds] = useState<string[]>([]);

  useEffect(() => {
    if (!enableCheckIds) {
      return;
    }
    const disposer = reaction(
      () => ProductShopCartController.getInstance().checkIds,
      ids => {
        setCheckedIds(ids);
      },
      {
        fireImmediately: true,
      },
    );
    return () => disposer();
  }, [enableCheckIds]);

  useEffect(() => {
    if (!enableCheckAll) {
      return;
    }
    const disposer = reaction(
      () => ProductShopCartController.getInstance().isCheckedAll,
      v => {
        setIsCheckedAll(v);
      },
      {
        fireImmediately: true,
      },
    );
    return () => disposer();
  }, [enableCheckAll]);

  useEffect(() => {
    if (!enableTotalScore) {
      return;
    }
    const disposer = reaction(
      () => ProductShopCartController.getInstance().totalScore,
      v => {
        setTotalScore(v);
      },
      {
        fireImmediately: true,
      },
    );
    return () => disposer();
  }, [enableTotalScore]);

  useEffect(() => {
    if (!enableAllProductIds) {
      return;
    }
    const disposer = reaction(
      () => ProductShopCartController.getInstance().allProductIds,
      ids => {
        setAllProductIds(ids);
      },
      {
        fireImmediately: true,
      },
    );
    return () => disposer();
  }, [enableAllProductIds]);

  const toggleCheckStatus = useCallback((id: string) => {
    ProductShopCartController.getInstance().toggleCheckStatus(id);
  }, []);

  const checkAll = useCallback(() => {
    ProductShopCartController.getInstance().checkAll();
  }, []);

  const uncheckAll = useCallback(() => {
    ProductShopCartController.getInstance().uncheckAll();
  }, []);

  const updateProductShopCart = useDebounceFunc(
    async (params: {
      id: string;
      productId: string;
      quantity: number;
      callback?: {
        success?: () => void;
        fallback?: (prevQuantity: number) => void;
      };
    }) => {
      const { id, productId, quantity, callback } = params;
      try {
        await sdk.modules.product.updateProductShopCart({
          id,
          productId,
          quantity,
        });
        callback?.success?.();
      } catch (err) {
        const productShopCart = sdk.storeManager.getById(STORE_NAME.PRODUCT_SHOP_CART, id);
        showToast({ title: err?.message ?? '商品数量更新失败！' });
        productShopCart && callback?.fallback?.(productShopCart.quantity);
      }
    },
    500,
  );

  const addProductShopCart = useCallback(async (productId: string, quantity: number) => {
    try {
      const allIds = ProductShopCartController.getInstance().allProductIds;
      if (allIds.includes(productId)) {
        showToast({ title: '购物车里已存在该商品！' });
        return;
      }
      await sdk.modules.product.addProductShopCart(productId, quantity);
      showToast({ title: '已加入购物车！' });
    } catch {
      showToast({ title: '添加失败！' });
    }
  }, []);

  const getProductShopCartScore = useCallback((id: string) => {
    const storeManager = sdk.storeManager;
    const productShopCart = storeManager.getById(STORE_NAME.PRODUCT_SHOP_CART, id);
    if (!productShopCart) {
      return 0;
    }
    const product = storeManager.getById(STORE_NAME.PRODUCT, productShopCart.productId);
    if (!product) {
      return 0;
    }
    return product.score * productShopCart.quantity;
  }, []);

  return {
    checkedIds,
    isCheckedAll,
    checkAll,
    uncheckAll,
    totalScore,
    allProductIds,
    toggleCheckStatus,
    updateProductShopCart,
    addProductShopCart,
    getProductShopCartScore,
  };
}
