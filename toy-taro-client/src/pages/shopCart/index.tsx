import { Fragment, useCallback, useState } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { OsButton } from 'ossaui';
import { Button, CheckButton, WhiteSpace } from '@/components';
import { PAGE_ID } from '@/utils/constants';
import { navigateToPage } from '@/utils/router';
import { Item } from './item';
import styles from './index.module.scss';

export default function () {
  const [checkAll, setCheckAll] = useState(false);

  const handleCheckOut = useCallback(() => {
    navigateToPage({
      pageName: PAGE_ID.CHECKOUT,
    });
  }, []);

  return (
    <View className={styles.wrapper}>
      <View className={styles.list}>
        <ScrollView scrollY className={styles.scrollView}>
          <View className={styles.container}>
            {[...Array(24).keys()].map(index => {
              return (
                <Fragment key={index}>
                  <WhiteSpace size='medium' />
                  <Item
                    title='美乐蒂经典毛绒玩偶'
                    coverImage='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-shop-cart-1.png'
                    currentScore={129}
                    originalScore={140}
                  />
                </Fragment>
              );
            })}
            <WhiteSpace size='medium' />
          </View>
        </ScrollView>
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
    </View>
  );
}
