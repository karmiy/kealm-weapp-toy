import { ScrollView, Text, View } from '@tarojs/components';
import { ToyCard } from '@/container';
import styles from './index.module.scss';

export default function () {
  return (
    <View className={styles.wrapper}>
      <View className={styles.detail}>
        <ScrollView scrollY className={styles.scrollView}>
          <View className={styles.container}>
            <View className={styles.area}>
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
              {/* <ToyDetail
                title='美乐蒂经典毛绒玩偶美乐蒂经典毛绒玩偶'
                coverImage='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-checkout-1.png'
                currentScore={119}
                originalScore={140}
                action={<Text>x1</Text>}
              /> */}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
