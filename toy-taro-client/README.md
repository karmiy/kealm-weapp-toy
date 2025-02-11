# Toy Taro client

## 开发

vscode 开发（可以响应 eslint 等）

```
yarn dev:weapp
```

微信开发者工具打开 toy-taro-client 预览

```
小程序配置：
- 详情 -> 本地设置 -> 不校验合法域名
- 详情 -> 本地设置 -> 将 JS 编译成 ES5
```

## px/rpx 单位

屏幕宽度都是 rpx
不同屏幕 px 宽度可能不一样，如 iPhone13 pro max 是 428px

### api

api 拿到单位都是 px

```js
systemInfo.statusBarHeight;
```

### 组件 style

taro 会把给 style 的 rpx 转为 px

```json
// 会以全屏 750px 设计稿来看，所以 pxTransform(200) 时，得到的也是 200，在 iPhone13 pro max 428px 的屏幕下，得到的 px 即 428/750 = ?/428，得到 114px
// 所以
{
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2,
    },
}
```

```jsx
// 如在 iPhone13 pro max, 428px 的屏幕
// 得到 375px
<View style={{ height: 40, width: '375px' }} className='bg-black' />
// 得到 428px
<View style={{ height: 40, width: '750rpx' }} className='bg-red-600' />
// 得到 114px
<View style={{ height: 40, width: pxTransform(200) }} className='bg-red-200' />
```

### 样式

目前看起来，taro 会把 scss 里的 px 都转 rpx，1:1 的关系，如 2px -> 2rpx

### Controller/ViewModel

- controller
  - 持久化
  - 不应该每次进页面都去重新算
  - 多处使用
- viewModel
  - 非持久化
  - 每次进页面可以接受重新算
  - 单处使用

### 新增页面

- toy-taro-client/src/shared/utils/constants.ts 新增 PAGE_ID
- toy-taro-client/src/app.config.ts 新增 subPackages
- toy-taro-client/src/shared/utils/router.ts 需要在 pagePathMap 新增路径映射

## 图标

https://gitee.com/mirrors/Taro-Iconfont

```
// 生成图标
npx iconfont-taro
```

## 请求

toy-taro-client\src\core\httpRequest\url.ts 改成自己本机 ip
