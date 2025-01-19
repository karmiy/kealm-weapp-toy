import { useCallback, useEffect, useState } from 'react';
import { reaction } from '@shared/utils/observer';
import { sdk, STORE_NAME } from '@core';
import { ToyShopCartController } from '@ui/controller/toyShopCartController';
import { useDebounceFunc } from '@ui/hooks/useDebounceFunc';

export function useToyShopCart() {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
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
  }, []);

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
    async (id: string, quantity: number, fallback?: (prevQuantity: number) => void) => {
      try {
        await sdk.modules.toy.updateToyShopCart(id, quantity);
      } catch {
        const toyShopCart = sdk.storeManager.getById(STORE_NAME.TOY_SHOP_CART, id);
        toyShopCart && fallback?.(toyShopCart.quantity);
      }
    },
    500,
  );

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
    toggleCheckStatus,
    updateToyShopCart,
    getToyShopCartScore,
  };
}
