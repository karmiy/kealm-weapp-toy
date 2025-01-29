import { useCallback } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { TAB_BAR_ID } from '@shared/tabBar';
import { PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { STORE_NAME } from '@core';
import { Button, CheckButton, StatusWrapper, WhiteSpace } from '@ui/components';
import { withCustomTabBar } from '@ui/hoc';
import { useProductShopCart, useStoreIds, useStoreLoadingStatus } from '@ui/viewModel';
import { ShopItem } from './components';
import styles from './index.module.scss';

function ShopCart() {
  const ids = useStoreIds(STORE_NAME.PRODUCT_SHOP_CART);
  const loading = useStoreLoadingStatus(STORE_NAME.PRODUCT_SHOP_CART);
  const { checkedIds, isCheckedAll, checkAll, uncheckAll, totalScore, toggleCheckStatus } =
    useProductShopCart({ enableCheckIds: true, enableCheckAll: true, enableTotalScore: true });

  const handleCheckOut = useCallback(() => {
    navigateToPage({
      pageName: PAGE_ID.CHECKOUT,
    });
  }, []);

  return (
    <View className={styles.wrapper}>
      <View className={styles.list}>
        <StatusWrapper loading={loading} count={ids.length} size='fill'>
          <ScrollView scrollY className={styles.scrollView}>
            <View className={styles.container}>
              {ids.map(id => {
                return (
                  <ShopItem
                    key={id}
                    id={id}
                    checked={checkedIds.includes(id)}
                    onChecked={() => toggleCheckStatus(id)}
                  />
                );
              })}
              <WhiteSpace size='medium' />
            </View>
          </ScrollView>
        </StatusWrapper>
      </View>
      <View className={styles.actionBar}>
        <View className={styles.select} onClick={() => (!isCheckedAll ? checkAll() : uncheckAll())}>
          <CheckButton checked={isCheckedAll} />
          <Text className={styles.label}>全选</Text>
        </View>
        <View className={styles.operate}>
          <View className={styles.total}>
            <Text>合计：</Text>
            <Text className={styles.score}>{totalScore}积分</Text>
          </View>
          <Button
            className={styles.checkout}
            onClick={handleCheckOut}
            disabled={!checkedIds.length}
          >
            结算
          </Button>
        </View>
      </View>
    </View>
  );
}

const ShopCartPage = withCustomTabBar(ShopCart, {
  tabBarId: TAB_BAR_ID.SHOP_CART,
});

export default ShopCartPage;
