export default defineAppConfig({
    pages: ['pages/detail/index', 'pages/mine/index'],
    tabBar: {
        list: [
            {
                iconPath: 'images/detail-inactive.png',
                selectedIconPath: 'images/detail-active.png',
                pagePath: 'pages/detail/index',
                text: '明细',
            },
            {
                iconPath: 'images/mine-inactive.png',
                selectedIconPath: 'images/mine-active.png',
                pagePath: 'pages/mine/index',
                text: '我的',
            },
        ],
        color: '#3232332',
        selectedColor: '#00B26A',
        backgroundColor: '#fff',
        borderStyle: 'black',
    },
    window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#00B26A',
        navigationBarTitleText: '记账',
        navigationBarTextStyle: 'white',
    },
});
