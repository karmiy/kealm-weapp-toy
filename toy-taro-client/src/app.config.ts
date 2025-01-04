import { useGlobalIconFont } from './utils/icon';

export default defineAppConfig({
  // eslint-disable-next-line react-hooks/rules-of-hooks
  usingComponents: Object.assign(useGlobalIconFont()),
  pages: ['pages/home/index', 'pages/shopCart/index', 'pages/task/index', 'pages/mine/index'],
  tabBar: {
    list: [
      {
        iconPath: 'images/home-inactive.png',
        selectedIconPath: 'images/home-active.png',
        pagePath: 'pages/home/index',
        text: '首页',
      },
      {
        iconPath: 'images/shop-cart-inactive.png',
        selectedIconPath: 'images/shop-cart-active.png',
        pagePath: 'pages/shopCart/index',
        text: '购物车',
      },
      {
        iconPath: 'images/task-inactive.png',
        selectedIconPath: 'images/task-active.png',
        pagePath: 'pages/task/index',
        text: '任务中心',
      },
      {
        iconPath: 'images/mine-inactive.png',
        selectedIconPath: 'images/mine-active.png',
        pagePath: 'pages/mine/index',
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
  subPackages: [
    {
      root: 'pages/checkout/',
      pages: ['index'],
    },
    {
      root: 'pages/coupon/',
      pages: ['index'],
    },
  ],
  // entryPagePath: 'pages/coupon/index',
  entryPagePath: 'pages/shopCart/index',
});
