import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import { PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { STORE_NAME } from '@core';
import { Button, CheckButton, StatusWrapper, WhiteSpace } from '@ui/components';
import { useStoreIds, useStoreLoadingStatus } from '@ui/viewModel';
import { Item } from './item';
import styles from './index.module.scss';

export default function () {
  const ids = useStoreIds(STORE_NAME.TOY_SHOP_CART);
  const loading = useStoreLoadingStatus(STORE_NAME.TOY_SHOP_CART);
  const [checkAll, setCheckAll] = useState(false);
  const [isUpdateQuantityError, setIsUpdateQuantityError] = useState(false);

  const handleCheckOut = useCallback(() => {
    navigateToPage({
      pageName: PAGE_ID.CHECKOUT,
    });
  }, []);

  const handleUpdateQuantityError = useCallback(() => {
    setIsUpdateQuantityError(true);
  }, []);

  return (
    <View className={styles.wrapper}>
      <View className={styles.list}>
        <StatusWrapper loading={loading} count={ids.length} size='fill'>
          <ScrollView scrollY className={styles.scrollView}>
            <View className={styles.container}>
              {ids.map(id => {
                return <Item key={id} id={id} onUpdateQuantityError={handleUpdateQuantityError} />;
              })}
              <WhiteSpace size='medium' />
            </View>
          </ScrollView>
        </StatusWrapper>
      </View>
      <View className={styles.actionBar}>
        <View className={styles.select} onClick={() => setCheckAll(!checkAll)}>
          <CheckButton checked={checkAll} />
          <Text className={styles.label}>全选</Text>
        </View>
        <View className={styles.operate}>
          <View className={styles.total}>
            <Text>合计：</Text>
            <Text className={styles.score}>328积分</Text>
          </View>
          <Button className={styles.checkout} onClick={handleCheckOut}>
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
