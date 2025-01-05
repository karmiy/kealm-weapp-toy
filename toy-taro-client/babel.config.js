// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true
    }]
  ],
  plugins: [
    // [Draft]: ossaui
    // [
    //     'import',
    //     {
    //         libraryName: 'ossaui',
    //         customName: name => `ossaui/lib/components/${name.replace(/^os-/, '')}`,
    //         customStyleName: name =>
    //             `ossaui/dist/style/components/${name.replace(/^os-/, '')}.scss`,
    //     },
    //     'ossaui',
    // ],
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
              if (path === 'modal-content') path = 'modal/content';
              return `taro-ui/lib/components/${path}`;
          },
          style: name => {
              // taro-ui/lib/components/avatar
              // taro-ui/lib/components/list/item
              // taro-ui/lib/components/modal/content
              const wholePath = name.split('/');
              let [rootName, compName] = wholePath.slice(-2);
              if (compName === 'tabs-pane') compName = 'tabs';
              if (compName === 'item' && rootName === 'list') compName = 'list';
              if (compName === 'content' && rootName === 'modal') compName = 'modal';
              return `taro-ui/dist/style/components/${compName}.scss`;
          },
      },
    ],
  ],
}
