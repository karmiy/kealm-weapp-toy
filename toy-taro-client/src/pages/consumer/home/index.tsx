import { Text, View } from '@tarojs/components';
import { OsButton, OsCarousel, OsSearch } from 'ossaui';
import { SafeAreaBar } from '@/components';
// import styles from './index.module.scss';
import Banner from '@/images/demo-melody-banner.png';
import { TopBar } from './topBar';

const initImg1 = [
  {
    content: 'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/melody-banner.png',
  },
  {
    content: 'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/melody-banner.png',
  },
  {
    content: 'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/melody-banner.png',
  },
];

export default function () {
  return (
    <View>
      <SafeAreaBar />
      {/* <View className='bg-black text-blue-100 mx-12'>123</View> */}
      <TopBar />
      <OsCarousel
        data={initImg1}
        width={750}
        height={375}
        interval={4000}
        circular
        current={1}
        indicatorDots
        indicatorActiveColor='#FF69B4'
        indicatorColor='#FFF'
        onChange={() => 1}
      />
      <OsButton type='primary'>按钮</OsButton>
    </View>
  );
}
