import { useGlobalIconFont } from './shared/utils/icon';

export default defineAppConfig({
  // eslint-disable-next-line react-hooks/rules-of-hooks
  usingComponents: Object.assign(useGlobalIconFont()),
  pages: [
    'ui/pages/home/index',
    'ui/pages/shopCart/index',
    'ui/pages/task/index',
    'ui/pages/mine/index',
  ],
  tabBar: {
    list: [
      {
        iconPath: 'ui/images/home-inactive.png',
        selectedIconPath: 'ui/images/home-active.png',
        pagePath: 'ui/pages/home/index',
        text: '首页',
      },
      {
        iconPath: 'ui/images/shop-cart-inactive.png',
        selectedIconPath: 'ui/images/shop-cart-active.png',
        pagePath: 'ui/pages/shopCart/index',
        text: '购物车',
      },
      {
        iconPath: 'ui/images/task-inactive.png',
        selectedIconPath: 'ui/images/task-active.png',
        pagePath: 'ui/pages/task/index',
        text: '任务中心',
      },
      {
        iconPath: 'ui/images/mine-inactive.png',
        selectedIconPath: 'ui/images/mine-active.png',
        pagePath: 'ui/pages/mine/index',
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
      root: 'ui/pages/checkout/',
      pages: ['index'],
    },
    {
      root: 'ui/pages/coupon/',
      pages: ['index'],
    },
    {
      root: 'ui/pages/exchangeRecord/',
      pages: ['index'],
    },
    {
      root: 'ui/pages/checkIn/',
      pages: ['index'],
    },
  ],
  // entryPagePath: 'ui/pages/checkIn/index',
});
