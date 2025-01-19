import { useCallback, useState } from 'react';
import { AtToast } from 'taro-ui';
import { STORE_NAME } from '@core';
import { TabPanel, Tabs, WhiteSpace } from '@ui/components';
import { useStoreList, useToyShopCart } from '@ui/viewModel';
import { ToyList } from './toyList';

const ADD_TO_CART_TOAST_MES = {
  SUCCESS: '已加入购物车！',
  EXIST: '购物车里已存在该商品！',
  FAIL: '添加失败！',
};

const Category = () => {
  const list = useStoreList(STORE_NAME.TOY_CATEGORY);
  const { allProductIds, addToyShopCart } = useToyShopCart({ enableAllProductIds: true });
  const [current, setCurrent] = useState(0);
  const [addToCartToastMes, setAddToCartToastMes] = useState<string>(ADD_TO_CART_TOAST_MES.SUCCESS);
  const [isShowAddToCartToast, setIsShowAddToCartToast] = useState(false);

  const handleAddToCart = useCallback(
    async (id: string) => {
      try {
        if (allProductIds.includes(id)) {
          setAddToCartToastMes(ADD_TO_CART_TOAST_MES.EXIST);
          setIsShowAddToCartToast(true);
          return;
        }
        await addToyShopCart(id, 1);
        setAddToCartToastMes(ADD_TO_CART_TOAST_MES.SUCCESS);
        setIsShowAddToCartToast(true);
      } catch {
        setAddToCartToastMes(ADD_TO_CART_TOAST_MES.FAIL);
        setIsShowAddToCartToast(true);
      }
    },
    [allProductIds, addToyShopCart],
  );

  return (
    <>
      <Tabs current={current} onChange={setCurrent}>
        {list.map(item => {
          const { id, name } = item;
          return (
            <TabPanel key={id} label={name}>
              <ToyList categoryId={id} onAddToCart={handleAddToCart} />
            </TabPanel>
          );
        })}
      </Tabs>
      <AtToast
        isOpened={isShowAddToCartToast}
        onClose={() => setIsShowAddToCartToast(false)}
        text={addToCartToastMes}
      />
      <WhiteSpace size='large' />
    </>
  );
};

export { Category };
