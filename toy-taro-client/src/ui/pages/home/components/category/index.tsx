import { useCallback, useState } from 'react';
import { showToast } from '@shared/utils/operateFeedback';
import { STORE_NAME } from '@core';
import { TabPanel, Tabs, WhiteSpace } from '@ui/components';
import { useProductShopCart, useStoreList } from '@ui/viewModel';
import { ProductList } from './productList';

const ADD_TO_CART_TOAST_MES = {
  SUCCESS: '已加入购物车！',
  EXIST: '购物车里已存在该商品！',
  FAIL: '添加失败！',
};

const Category = () => {
  const list = useStoreList(STORE_NAME.PRODUCT_CATEGORY);
  const { allProductIds, addProductShopCart } = useProductShopCart({ enableAllProductIds: true });
  const [current, setCurrent] = useState(0);

  const handleAddToCart = useCallback(
    async (id: string) => {
      try {
        if (allProductIds.includes(id)) {
          showToast({ title: ADD_TO_CART_TOAST_MES.EXIST });
          return;
        }
        await addProductShopCart(id, 1);
        showToast({ title: ADD_TO_CART_TOAST_MES.SUCCESS });
      } catch {
        showToast({ title: ADD_TO_CART_TOAST_MES.FAIL });
      }
    },
    [allProductIds, addProductShopCart],
  );

  if (!list.length) {
    return null;
  }

  return (
    <>
      <Tabs current={current} onChange={setCurrent}>
        {list.map(item => {
          const { id, name } = item;
          return (
            <TabPanel key={id} label={name}>
              <ProductList categoryId={id} onAddToCart={handleAddToCart} />
            </TabPanel>
          );
        })}
      </Tabs>
      <WhiteSpace size='large' />
    </>
  );
};

export { Category };
