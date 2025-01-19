import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import { PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { STORE_NAME } from '@core';
import { Button, CheckButton, StatusWrapper, WhiteSpace } from '@ui/components';
import { useStoreIds, useStoreLoadingStatus, useToyShopCart } from '@ui/viewModel';
import { Item } from './item';
import styles from './index.module.scss';

export default function () {
  const ids = useStoreIds(STORE_NAME.TOY_SHOP_CART);
  const loading = useStoreLoadingStatus(STORE_NAME.TOY_SHOP_CART);
  const { checkedIds, isCheckedAll, checkAll, uncheckAll, toggleCheckStatus, getToyShopCartScore } =
    useToyShopCart();
  const [isUpdateQuantityError, setIsUpdateQuantityError] = useState(false);

  const handleCheckOut = useCallback(() => {
    navigateToPage({
      pageName: PAGE_ID.CHECKOUT,
      params: {
        ids: checkedIds.join(','),
      },
    });
  }, [checkedIds]);

  const handleUpdateQuantityError = useCallback(() => {
    setIsUpdateQuantityError(true);
  }, []);

  const totalScore = useMemo(() => {
    return checkedIds.reduce((acc, curr) => {
      return acc + getToyShopCartScore(curr);
    }, 0);
  }, [checkedIds, getToyShopCartScore]);

  return (
    <View className={styles.wrapper}>
      <View className={styles.list}>
        <StatusWrapper loading={loading} count={ids.length} size='fill'>
          <ScrollView scrollY className={styles.scrollView}>
            <View className={styles.container}>
              {ids.map(id => {
                return (
                  <Item
                    key={id}
                    id={id}
                    onUpdateQuantityError={handleUpdateQuantityError}
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
      <AtToast
        isOpened={isUpdateQuantityError}
        onClose={() => setIsUpdateQuantityError(false)}
        text='商品数量更新失败！'
      />
    </View>
  );
}
