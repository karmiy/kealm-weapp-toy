// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
    presets: [
        [
            'taro',
            {
                framework: 'react',
                ts: true,
            },
        ],
    ],
    plugins: [
        [
            'import',
            {
                libraryName: 'taro-ui',
                // libraryDirectory: "lib/components",
                // styleLibraryDirectory: "dist/style/components",
                customName: name => {
                    const nameSection = name.split('-');
                    if (nameSection.length === 4) {
                        // 子组件的路径跟主组件一样
                        nameSection.pop();
                    }
                    let path = nameSection.slice(1).join('-');
                    if (path === 'list-item') path = 'list/item';
                    return `taro-ui/lib/components/${path}`;
                },
                style: name => {
                    // taro-ui/lib/components/avatar
                    // taro-ui/lib/components/list/item
                    const wholePath = name.split('/');
                    let compName = wholePath[wholePath.length - 1];
                    if (compName === 'tabs-pane') compName = 'tabs';
                    if (compName === 'item') compName = 'list';
                    return `taro-ui/dist/style/components/${compName}.scss`;
                },
            },
        ],
    ],
};
