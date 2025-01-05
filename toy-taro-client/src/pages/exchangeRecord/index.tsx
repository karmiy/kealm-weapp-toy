import { Fragment } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { SafeAreaBar, WhiteSpace } from '@/components';
import { Item } from './item';
import styles from './index.module.scss';

export default function () {
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
                    test={index === 0}
                  />
                </Fragment>
              );
            })}
            <WhiteSpace size='medium' />
          </View>
        </ScrollView>
      </View>
      <SafeAreaBar isWhiteBg inset='bottom' />
      {/* <View
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 100,
          backgroundColor: 'pink',
          opacity: 0.3,
        }}
      /> */}
    </View>
  );
}
