import { ScrollView, Text, View } from '@tarojs/components';
import { Button, SafeAreaBar, WhiteSpace } from '@/components';
import { ToyCard } from '@/container';
import { FormItem } from './formItem';
import styles from './index.module.scss';

export default function () {
  return (
    <View className={styles.wrapper}>
      <View className={styles.detail}>
        <ScrollView scrollY className={styles.scrollView}>
          <View className={styles.container}>
            <View className={styles.area}>
              {[...Array(8).keys()].map(index => {
                return (
                  <>
                    {index !== 0 ? <WhiteSpace isVertical line size='large' /> : null}
                    <ToyCard
                      mode='horizontal'
                      paddingSize='none'
                      title='美乐蒂经典毛绒玩偶美乐蒂经典毛绒玩偶'
                      subTitle='30cm 粉色'
                      coverImage='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-checkout-1.png'
                      currentScore={119}
                      originalScore={140}
                      action={<Text>x1</Text>}
                    />
                  </>
                );
              })}
            </View>
            <WhiteSpace isVertical size='medium' />
            <View className={styles.area}>
              <FormItem mode='select' label='优惠券' text='满100减10' highlight />
              <WhiteSpace isVertical size='medium' />
              <FormItem label='商品积分' text='327积分' />
              <WhiteSpace isVertical size='medium' />
              <FormItem label='优惠积分' text='-20积分' highlight />
              <WhiteSpace isVertical size='medium' />
              <FormItem label='实付积分' text='317积分' highlight emphasize />
            </View>
          </View>
        </ScrollView>
      </View>
      <View className={styles.actionWrapper}>
        <Text className={styles.tip}>共3件商品</Text>
        <Button>支付</Button>
      </View>
      <SafeAreaBar isWhiteBg inset='bottom' />
    </View>
  );
}
