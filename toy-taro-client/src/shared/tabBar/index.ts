import { TAB_BAR_ID } from './constants';

const TAB_BAR_CONFIG = {
  home: {
    id: TAB_BAR_ID.HOME,
    iconPath: '/ui/images/home-inactive.png',
    selectedIconPath: '/ui/images/home-active.png',
    pagePath: '/ui/pages/home/index',
    text: '首页',
  },
  shopCart: {
    id: TAB_BAR_ID.SHOP_CART,
    iconPath: '/ui/images/shop-cart-inactive.png',
    selectedIconPath: '/ui/images/shop-cart-active.png',
    pagePath: '/ui/pages/shopCart/index',
    text: '购物车',
  },
  task: {
    id: TAB_BAR_ID.TASK,
    iconPath: '/ui/images/task-inactive.png',
    selectedIconPath: '/ui/images/task-active.png',
    pagePath: '/ui/pages/task/index',
    text: '任务中心',
  },
  mine: {
    id: TAB_BAR_ID.MINE,
    iconPath: '/ui/images/mine-inactive.png',
    selectedIconPath: '/ui/images/mine-active.png',
    pagePath: '/ui/pages/mine/index',
    text: '我的',
  },
};

export const USER_TAB_BAR_LIST = [
  TAB_BAR_CONFIG.home,
  TAB_BAR_CONFIG.shopCart,
  TAB_BAR_CONFIG.task,
  TAB_BAR_CONFIG.mine,
];

export const ADMIN_TAB_BAR_LIST = [TAB_BAR_CONFIG.home, TAB_BAR_CONFIG.task, TAB_BAR_CONFIG.mine];

export { TAB_BAR_ID };
