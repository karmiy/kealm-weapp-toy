import { useCallback, useState } from 'react';
import { STORE_NAME } from '@core';
import { TabPanel, Tabs, WhiteSpace } from '@ui/components';
import { useProductShopCart, useStoreList } from '@ui/viewModel';
import { ProductList } from './productList';

const Category = () => {
  const list = useStoreList(STORE_NAME.PRODUCT_CATEGORY);
  const { addProductShopCart } = useProductShopCart();
  const [current, setCurrent] = useState(0);

  const handleAddToCart = useCallback(
    (id: string) => addProductShopCart(id, 1),
    [addProductShopCart],
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
