import { useCallback, useEffect, useState } from 'react';
import { reaction } from '@shared/utils/observer';
import { sdk, STORE_NAME } from '@core';
import { ToyShopCartController } from '@ui/controller/toyShopCartController';
import { useDebounceFunc } from '@ui/hooks/useDebounceFunc';

interface Props {
  enableCheckIds?: boolean;
  enableCheckAll?: boolean;
  enableTotalScore?: boolean;
  enableAllProductIds?: boolean;
}

export function useToyShopCart(props?: Props) {
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
      () => ToyShopCartController.getInstance().checkIds,
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
      () => ToyShopCartController.getInstance().isCheckedAll,
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
      () => ToyShopCartController.getInstance().totalScore,
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
      () => ToyShopCartController.getInstance().allProductIds,
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
    ToyShopCartController.getInstance().toggleCheckStatus(id);
  }, []);

  const checkAll = useCallback(() => {
    ToyShopCartController.getInstance().checkAll();
  }, []);

  const uncheckAll = useCallback(() => {
    ToyShopCartController.getInstance().uncheckAll();
  }, []);

  const updateToyShopCart = useDebounceFunc(
    async (
      id: string,
      quantity: number,
      callback?: {
        success?: () => void;
        fallback?: (prevQuantity: number) => void;
      },
    ) => {
      try {
        await sdk.modules.toy.updateToyShopCart(id, quantity);
        callback?.success?.();
      } catch {
        const toyShopCart = sdk.storeManager.getById(STORE_NAME.TOY_SHOP_CART, id);
        toyShopCart && callback?.fallback?.(toyShopCart.quantity);
      }
    },
    500,
  );

  const addToyShopCart = useCallback(async (productId: string, quantity: number) => {
    await sdk.modules.toy.addToyShopCart(productId, quantity);
  }, []);

  const getToyShopCartScore = useCallback((id: string) => {
    const storeManager = sdk.storeManager;
    const toyShopCart = storeManager.getById(STORE_NAME.TOY_SHOP_CART, id);
    if (!toyShopCart) {
      return 0;
    }
    const toy = storeManager.getById(STORE_NAME.TOY, toyShopCart.productId);
    if (!toy) {
      return 0;
    }
    return toy.score * toyShopCart.quantity;
  }, []);

  return {
    checkedIds,
    isCheckedAll,
    checkAll,
    uncheckAll,
    totalScore,
    allProductIds,
    toggleCheckStatus,
    updateToyShopCart,
    addToyShopCart,
    getToyShopCartScore,
  };
}
