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
            1: '2rpx',
            2: '4rpx',
            4: '8rpx',
            8: '16rpx',
            12: '24rpx',
            16: '32rpx',
            20: '40rpx',
            24: '48rpx',
            32: '64rpx',
            40: '80rpx',
            48: '96rpx',
            56: '112rpx',
            64: '128rpx',
            72: '144rpx',
            80: '160rpx',
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
