## Demo

```tsx
import { View } from '@tarojs/components';
import { showToast } from '@shared/utils/operateFeedback';
import { WhiteSpace } from '@ui/components';
import { LuckyGrid } from './grid';
import { LuckyWheel } from './wheel';
import styles from './index.module.scss';

export default function () {
  return (
    <View>
      <WhiteSpace />
      <LuckyGrid
        canvasId='grid-24'
        prizes={[
          { id: '1', text: '1积分', type: 'score', range: 12 },
          { id: '2', text: '3积分', type: 'score', range: 7 },
          { id: '3', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '4', text: '5积分', type: 'score', range: 5 },
          { id: '5', text: '5折券', type: 'coupon', range: 1000 },
          { id: '6', text: '1积分', type: 'score', range: 12 },
          { id: '7', text: '3积分', type: 'score', range: 7 },
          { id: '8', text: '8折券', type: 'coupon', range: 3 },
          { id: '9', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '10', text: '1积分', type: 'score', range: 12 },
          { id: '11', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '12', text: '1积分', type: 'score', range: 12 },
          { id: '13', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '14', text: '1积分', type: 'score', range: 12 },
          { id: '15', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '16', text: '1积分', type: 'score', range: 12 },
          { id: '17', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '18', text: '1积分', type: 'score', range: 12 },
          { id: '19', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '20', text: '1积分', type: 'score', range: 12 },
          { id: '21', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '22', text: '1积分', type: 'score', range: 12 },
          { id: '23', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '24', text: '1积分', type: 'score', range: 12 },
        ]}
        onEnd={(id, text) => {
          showToast({
            title: `恭喜你获得${text}`,
          });
        }}
      />
      <WhiteSpace />
      <LuckyGrid
        canvasId='grid-19'
        prizes={[
          { id: '1', text: '1积分', type: 'score', range: 12 },
          { id: '2', text: '3积分', type: 'score', range: 7 },
          { id: '3', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '4', text: '5积分', type: 'score', range: 5 },
          { id: '5', text: '5折券', type: 'coupon', range: 1000 },
          { id: '6', text: '1积分', type: 'score', range: 12 },
          { id: '7', text: '3积分', type: 'score', range: 7 },
          { id: '8', text: '8折券', type: 'coupon', range: 3 },
          { id: '9', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '10', text: '1积分', type: 'score', range: 12 },
          { id: '11', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '12', text: '1积分', type: 'score', range: 12 },
          { id: '13', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '14', text: '1积分', type: 'score', range: 12 },
          { id: '15', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '16', text: '1积分', type: 'score', range: 12 },
          { id: '17', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '18', text: '1积分', type: 'score', range: 12 },
          { id: '19', text: '谢谢惠顾', type: 'none', range: 12 },
        ]}
        onEnd={(id, text) => {
          showToast({
            title: `恭喜你获得${text}`,
          });
        }}
      />
      <WhiteSpace />
      <LuckyGrid
        canvasId='grid-15'
        prizes={[
          { id: '1', text: '1积分', type: 'score', range: 12 },
          { id: '2', text: '3积分', type: 'score', range: 7 },
          { id: '3', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '4', text: '5积分', type: 'score', range: 5 },
          { id: '5', text: '5折券', type: 'coupon', range: 1000 },
          { id: '6', text: '1积分', type: 'score', range: 12 },
          { id: '7', text: '3积分', type: 'score', range: 7 },
          { id: '8', text: '8折券', type: 'coupon', range: 3 },
          { id: '9', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '10', text: '1积分', type: 'score', range: 12 },
          { id: '11', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '12', text: '1积分', type: 'score', range: 12 },
          { id: '13', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '14', text: '1积分', type: 'score', range: 12 },
          { id: '15', text: '谢谢惠顾', type: 'none', range: 12 },
        ]}
        onEnd={(id, text) => {
          showToast({
            title: `恭喜你获得${text}`,
          });
        }}
      />
      <WhiteSpace />
      <LuckyGrid
        canvasId='grid-11'
        prizes={[
          { id: '1', text: '1积分', type: 'score', range: 12 },
          { id: '2', text: '3积分', type: 'score', range: 7 },
          { id: '3', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '4', text: '5积分', type: 'score', range: 5 },
          { id: '5', text: '5折券', type: 'coupon', range: 1000 },
          { id: '6', text: '1积分', type: 'score', range: 12 },
          { id: '7', text: '3积分', type: 'score', range: 7 },
          { id: '8', text: '8折券', type: 'coupon', range: 3 },
          { id: '9', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '10', text: '1积分', type: 'score', range: 12 },
          { id: '11', text: '谢谢惠顾', type: 'none', range: 12 },
        ]}
        onEnd={(id, text) => {
          showToast({
            title: `恭喜你获得${text}`,
          });
        }}
      />
      <WhiteSpace />
      <LuckyGrid
        canvasId='grid-8'
        prizes={[
          { id: '1', text: '1积分', type: 'score', range: 12 },
          { id: '2', text: '3积分', type: 'score', range: 7 },
          { id: '3', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '4', text: '5积分', type: 'score', range: 5 },
          { id: '5', text: '5折券', type: 'coupon', range: 1000 },
          { id: '6', text: '1积分', type: 'score', range: 12 },
          { id: '7', text: '3积分', type: 'score', range: 7 },
          { id: '8', text: '8折券', type: 'coupon', range: 3 },
        ]}
        onEnd={(id, text) => {
          showToast({
            title: `恭喜你获得${text}`,
          });
        }}
      />
      <WhiteSpace />
      <LuckyWheel
        prizes={[
          { id: '1', text: '1积分', type: 'score', range: 12 },
          { id: '2', text: '3积分', type: 'score', range: 7 },
          { id: '3', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '4', text: '5积分', type: 'score', range: 5 },
          { id: '5', text: '5折券', type: 'coupon', range: 1 },
          { id: '6', text: '1积分', type: 'score', range: 12 },
          { id: '7', text: '3积分', type: 'score', range: 7 },
          { id: '8', text: '8折券', type: 'coupon', range: 3 },
          { id: '9', text: '谢谢惠顾', type: 'none', range: 12 },
          { id: '10', text: '1积分', type: 'score', range: 12 },
        ]}
        onEnd={(id, text) => {
          showToast({
            title: `恭喜你获得${text}`,
          });
        }}
      />
    </View>
  );
}
```

## Grid

```tsx
// grid 第一版配置归档
const layoutConfigMap = new Map<number, PrizeConfig>([
  [
    8,
    {
      rows: 3,
      cols: 3,
      height: (width: number) => width,
      prize: {
        position: generateBoundaryCoords(3, 3),
        font: { top: '60%', fontSize: 14 },
        img: { width: 40, height: 40, top: '10%' },
      },
      button: { x: 1, y: 1, width: '110%', height: '110%', top: '-5%', col: 1, row: 1 },
    },
  ],
  [
    10,
    {
      rows: 3,
      cols: 4,
      height: (width: number) => (width * 3) / 4,
      prize: {
        position: generateBoundaryCoords(3, 4),
        font: { top: '60%', fontSize: 12 },
        img: { width: 30, height: 30, top: '10%' },
      },
      button: { x: 1, y: 1, width: '55%', height: '110%', top: '-5%', col: 2, row: 1 },
    },
  ],
  [
    12,
    {
      rows: 4,
      cols: 4,
      height: (width: number) => width,
      prize: {
        position: generateBoundaryCoords(4, 4),
        // position: generateSpiralCoords(3, 4),
        font: { top: '60%', fontSize: 12 },
        img: { width: 30, height: 30, top: '10%' },
      },
      button: { x: 1, y: 1, width: '85%', height: '85%', top: '7.5%', col: 2, row: 2 },
    },
  ],
  [
    14,
    {
      rows: 4,
      cols: 5,
      height: (width: number) => (width * 4) / 5,
      prize: {
        position: generateBoundaryCoords(4, 5),
        font: { top: '55%', fontSize: 10 },
        img: { width: 24, height: 24, top: '6%' },
      },
      button: { x: 1, y: 1, width: '66.67%', height: '100%', top: '0%', col: 3, row: 2 },
    },
  ],
  [
    16,
    {
      rows: 5,
      cols: 5,
      height: (width: number) => width,
      prize: {
        position: generateBoundaryCoords(5, 5),
        font: { top: '55%', fontSize: 10 },
        img: { width: 24, height: 24, top: '6%' },
      },
      button: { x: 1, y: 1, width: '85%', height: '85%', top: '7.5%', col: 3, row: 3 },
    },
  ],
  [
    24,
    {
      rows: 5,
      cols: 5,
      height: (width: number) => width,
      prize: {
        position: generateSpiralCoords(5, 5),
        font: { top: '55%', fontSize: 10 },
        img: { width: 24, height: 24, top: '6%' },
      },
      button: { x: 2, y: 2, width: '110%', height: '110%', top: '-5%', col: 1, row: 1 },
    },
  ],
]);
```
