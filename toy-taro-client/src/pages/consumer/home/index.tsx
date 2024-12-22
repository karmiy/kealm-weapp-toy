import { useMemo, useState } from 'react';
import { Text, View } from '@tarojs/components';
import { OsButton, OsCarousel, OsSearch } from 'ossaui';
import { SafeAreaBar } from '@/components';
// import styles from './index.module.scss';
import Banner from '@/images/melody-banner-1.png';

const initImg1 = [
  {
    content: Banner,
  },
  {
    content: Banner,
  },
  {
    content: Banner,
  },
  {
    content: Banner,
  },
];

export default function () {
  return (
    <View>
      <SafeAreaBar />
      {/* <View className='bg-black text-blue-100 mx-12'>123</View> */}
      <OsSearch
        className='bg-transparent'
        customStyle={{ width: 150 }}
        showSplitLine={false}
        placeholder='搜索'
      />
      <OsCarousel
        data={initImg1}
        width={750}
        height={375}
        interval={4000}
        circular
        current={1}
        indicatorDots
        indicatorActiveColor='#DD1A21'
        indicatorColor='#FFF'
        onChange={() => 1}
      />
      {/* <OsButton type='primary'>按钮</OsButton> */}
    </View>
  );
}
