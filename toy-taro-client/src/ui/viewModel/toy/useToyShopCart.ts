import { sdk, STORE_NAME } from '@core';
import { useDebounceFunc } from '@ui/hooks/useDebounceFunc';

export function useToyShopCart(id: string) {
  const updateToyShopCart = useDebounceFunc(
    async (quantity: number, fallback?: (prevQuantity: number) => void) => {
      try {
        await sdk.modules.toy.updateToyShopCart(id, quantity);
      } catch {
        const toyShopCart = sdk.storeManager.getById(STORE_NAME.TOY_SHOP_CART, id);
        toyShopCart && fallback?.(toyShopCart.quantity);
      }
    },
    500,
  );

  return {
    updateToyShopCart,
  };
}
