import { useState } from 'react';
import { Swiper, SwiperItem } from '@tarojs/components';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { FallbackImage, WhiteSpace } from '@ui/components';
import styles from './index.module.scss';

const demoList = [
  {
    content:
      'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-melody-banner.png',
  },
  {
    content:
      'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-melody-banner.png',
  },
  {
    content:
      'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-melody-banner.png',
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  return (
    <>
      <Swiper
        className={styles.swiper}
        indicatorColor={COLOR_VARIABLES.FILL_DISABLE}
        indicatorActiveColor={COLOR_VARIABLES.COLOR_RED}
        current={current}
        interval={3000}
        circular
        autoplay
        indicatorDots
      >
        {demoList.map((item, idx) => (
          <SwiperItem key={idx}>
            <FallbackImage className={styles.swiperItemImage} src={item.content} />
          </SwiperItem>
        ))}
      </Swiper>
      <WhiteSpace size='large' />
    </>
  );
};

export { Carousel };
