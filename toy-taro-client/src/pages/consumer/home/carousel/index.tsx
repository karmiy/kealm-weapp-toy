import { OsCarousel } from 'ossaui';
// import styles from './index.module.scss';

const demoList = [
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

const Carousel = () => {
  return (
    <OsCarousel
      data={demoList}
      width={750}
      height={375}
      interval={4000}
      circular
      current={1}
      indicatorDots
      indicatorActiveColor='#FF69B4'
      indicatorColor='#FFF'
      onChange={() => {}}
    />
  );
};

export { Carousel };
