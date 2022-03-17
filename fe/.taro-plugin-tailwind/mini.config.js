const range = (size) =>
    Object.fromEntries(
        [...Array(size).keys()]
            .slice(1)
            .map((i) => [`${i}_${size}`, `${(i / size) * 100}%`])
    );

module.exports = {
    prefixer: false,
    separator: "_",
    compile: false,
    globalUtility: false,
    darkMode: "media",
    corePlugins: {
        preflight: false,
        divideColor: false,
        divideOpacity: false,
        divideStyle: false,
        divideWidth: false,
        space: false,
        placeholderColor: false,
        placeholderOpacity: false,
        transitionProperty: false,
    },
    exclude: [/([0-9]{1,}[.][0-9]*)$/],
    theme: {
        spacing: {
            0: 0,
            1: '1rpx',
            2: '2rpx',
            4: '4rpx',
            8: '8rpx',
            12: '12rpx',
            16: '16rpx',
            20: '20rpx',
            24: '24rpx',
            32: '32rpx',
            40: '40rpx',
            48: '48rpx',
            56: '56rpx',
            64: '64rpx',
            72: '72rpx',
            80: '80rpx',
        },
        width: (theme) => ({
            auto: "auto",
            full: "100%",
            screen: "100vw",
            ...Object.assign(...[2, 3, 4, 5, 6, 12].map(range)),
            ...theme("spacing"),
        }),
        height: (theme) => ({
            auto: "auto",
            full: "100%",
            screen: "100vh",
            ...Object.assign(...[2, 3, 4, 5, 6, 12].map(range)),
            ...theme("spacing"),
        }),
        maxHeight: {
            full: "100%",
            screen: "100vh",
        },
    },
};
