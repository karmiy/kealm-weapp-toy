import { Fragment, useState } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { Modal, SafeAreaBar, WhiteSpace } from '@/components';
import { Item } from './item';
import styles from './index.module.scss';

export default function () {
  const [showConfirm, setShowConfirm] = useState(false);

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
                    originalScore={129}
                    handleUndo={() => setShowConfirm(true)}
                  />
                </Fragment>
              );
            })}
            <WhiteSpace size='medium' />
          </View>
        </ScrollView>
      </View>
      <Modal
        visible={showConfirm}
        title='提示'
        cancelText='取消'
        confirmText='确定'
        content='您确定要撤销兑换这件商品吗？撤销后请与管理员联系处理归还事宜'
        onClose={() => setShowConfirm(false)}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => setShowConfirm(false)}
      />
      <SafeAreaBar isWhiteBg inset='bottom' />
    </View>
  );
}
