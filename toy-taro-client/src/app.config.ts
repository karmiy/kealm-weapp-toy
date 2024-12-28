import { useGlobalIconFont } from './utils/icon';

export default defineAppConfig({
  // eslint-disable-next-line react-hooks/rules-of-hooks
  usingComponents: Object.assign(useGlobalIconFont()),
  pages: [
    'pages/consumer/home/index',
    'pages/consumer/toyMarket/index',
    'pages/consumer/shopCart/index',
    'pages/consumer/mine/index',
  ],
  tabBar: {
    list: [
      {
        iconPath: 'images/home-inactive.png',
        selectedIconPath: 'images/home-active.png',
        pagePath: 'pages/consumer/home/index',
        text: '首页',
      },
      {
        iconPath: 'images/shop-cart-inactive.png',
        selectedIconPath: 'images/shop-cart-active.png',
        pagePath: 'pages/consumer/shopCart/index',
        text: '购物车',
      },
      {
        iconPath: 'images/mine-inactive.png',
        selectedIconPath: 'images/mine-active.png',
        pagePath: 'pages/consumer/mine/index',
        text: '我的',
      },
    ],
    color: '#3232332',
    selectedColor: '#FF69B4',
    backgroundColor: '#fff',
    borderStyle: 'black',
  },
  window: {
    backgroundTextStyle: 'light',
    // backgroundColor: '#FF69B4',
    navigationBarBackgroundColor: '#FF69B4',
    navigationBarTitleText: '美乐蒂玩具工坊',
    navigationBarTextStyle: 'white',
  },
  // subPackages: [
  //     // {
  //     //     root: 'pages/login/',
  //     //     pages: ['index'],
  //     // },
  //     // {
  //     //     root: 'pages/edit/',
  //     //     pages: ['index'],
  //     // },
  // ],
  // entryPagePath: 'pages/chart/index',
});
