# Toy Taro client

## 开发
vscode 开发（可以响应 eslint 等）
```
yarn dev:weapp
```
微信开发者工具打开 toy-taro-client 预览（预览不了：详情 -> 本地设置 -> 不校验合法域名...）

## px/rpx 单位
屏幕宽度都是 rpx
不同屏幕 px 宽度可能不一样，如 iPhone13 pro max 是 428px

### api
api 拿到单位都是 px
```js 
systemInfo.statusBarHeight
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