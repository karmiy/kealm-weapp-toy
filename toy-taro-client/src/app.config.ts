export default defineAppConfig({
  pages: [
    'pages/consumer/home/index',
    'pages/consumer/toyMarket/index',
    'pages/consumer/mine/index',
  ],
  tabBar: {
    list: [
      {
        iconPath: 'images/detail-inactive.png',
        selectedIconPath: 'images/detail-active.png',
        pagePath: 'pages/consumer/home/index',
        text: '首页',
      },
      {
        iconPath: 'images/detail-inactive.png',
        selectedIconPath: 'images/detail-active.png',
        pagePath: 'pages/consumer/toyMarket/index',
        text: '明细',
      },
      {
        iconPath: 'images/mine-inactive.png',
        selectedIconPath: 'images/mine-active.png',
        pagePath: 'pages/consumer/mine/index',
        text: '我的',
      },
    ],
    color: '#3232332',
    selectedColor: '#DD1A21',
    backgroundColor: '#fff',
    borderStyle: 'black',
  },
  window: {
    backgroundTextStyle: 'light',
    // backgroundColor: '#DD1A21',
    navigationBarBackgroundColor: '#DD1A21',
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
