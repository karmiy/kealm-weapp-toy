import { useState } from 'react';
import { Image, Text, View } from '@tarojs/components';
import { CheckButton, Icon, Stepper } from '@/components';
import { ToyScore } from '@/container';
import { COLOR_VARIABLES } from '@/utils/constants';
import styles from './index.module.scss';

interface ItemProps {
  title: string;
}

const Item = (props: ItemProps) => {
  const { title } = props;
  const [checked, setChecked] = useState(false);
  return (
    <View className={styles.wrapper}>
      <CheckButton className={styles.select} checked={checked} onChange={setChecked} />
      {/* <View className={styles.select} onClick={() => setChecked(!checked)}>
        <Icon size={20} color={COLOR_VARIABLES.COLOR_RED} name={checked ? 'check' : 'uncheck'} />
      </View> */}
      <Image
        src='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-shop-cart-1.png'
        mode='aspectFill'
        lazyLoad
        className={styles.coverImage}
      />
      <View className={styles.content}>
        <View className={styles.info}>
          <Text className={styles.title}>{title}</Text>
        </View>
        <View className={styles.operate}>
          <ToyScore current={129} original={144} />
          <Stepper min={0} />
        </View>
      </View>
    </View>
  );
};

export { Item };
