import { useEffect, useRef, useState } from 'react';
import { LuckyGrid, LuckyWheel, SlotMachine } from '@lucky-canvas/taro/react';
import { Image, View } from '@tarojs/components';
import Coupon from './coupon.png';
import RedEnvelop from './red-envelop.png';
import styles from './index.module.scss';

export default function () {
  const myLucky = useRef<{ play: () => void; stop: (idx: number) => void }>(null);
  const [blocks, setBlocks] = useState([{ padding: '12px', background: '#FF69B4' }]);
  const [prizes, setPrizes] = useState([
    {
      fonts: [{ text: '1积分', top: '25%', fontColor: '#FF69B4', fontSize: 14 }],
      background: '#FFC4E1',
      imgs: [{ src: RedEnvelop, width: 24, height: 24, top: '50%' }],
    },
    {
      fonts: [{ text: '3积分', top: '25%', fontColor: '#FF69B4', fontSize: 14 }],
      background: '#FFE5F1',
      imgs: [{ src: RedEnvelop, width: 24, height: 24, top: '50%' }],
    },
    {
      fonts: [{ text: '1积分', top: '25%', fontColor: '#FF69B4', fontSize: 14 }],
      background: '#FFC4E1',
      imgs: [{ src: RedEnvelop, width: 24, height: 24, top: '50%' }],
    },
    {
      fonts: [{ text: '5积分', top: '25%', fontColor: '#FF69B4', fontSize: 14 }],
      background: '#FFE5F1',
      imgs: [{ src: RedEnvelop, width: 24, height: 24, top: '50%' }],
    },
    {
      fonts: [{ text: '5折券', top: '25%', fontColor: '#FF69B4', fontSize: 14 }],
      background: '#FFC4E1',
      imgs: [{ src: Coupon, width: 24, height: 24, top: '50%' }],
    },
    {
      fonts: [{ text: '1积分', top: '25%', fontColor: '#FF69B4', fontSize: 14 }],
      background: '#FFE5F1',
      imgs: [{ src: RedEnvelop, width: 24, height: 24, top: '50%' }],
    },
    {
      fonts: [{ text: '3积分', top: '25%', fontColor: '#FF69B4', fontSize: 14 }],
      background: '#FFC4E1',
      imgs: [{ src: RedEnvelop, width: 24, height: 24, top: '50%' }],
    },
    {
      fonts: [{ text: '8折券', top: '25%', fontColor: '#FF69B4', fontSize: 14 }],
      background: '#FFE5F1',
      imgs: [{ src: Coupon, width: 24, height: 24, top: '50%' }],
    },
  ]);
  const [buttons, setButtons] = useState([
    { radius: '50px', background: '#FF69B4' },
    { radius: '45px', background: '#fff' },
    {
      radius: '40px',
      background: '#FFB0D8',
      pointer: true,
    },
    {
      radius: '35px',
      background: '#FFD9EB',
      fonts: [
        {
          text: '开始\n抽奖',
          top: '-20px',
          fontColor: '#FF69B4',
          fontSize: 16,
          fontWeight: 'bold',
        },
      ],
    },
  ]);
  return (
    <View>
      <LuckyWheel
        ref={myLucky}
        width='300px'
        height='300px'
        blocks={blocks}
        prizes={prizes}
        buttons={buttons}
        onStart={() => {
          // 点击抽奖按钮会触发star回调
          // 调用抽奖组件的play方法开始游戏
          myLucky.current?.play();
          // 模拟调用接口异步抽奖
          setTimeout(() => {
            // 假设后端返回的中奖索引是0
            const index = 0;
            // 调用stop停止旋转并传递中奖索引
            myLucky.current?.stop(index);
          }, 2500);
        }}
        onEnd={prize => {
          // 抽奖结束会触发end回调
          console.log(prize);
        }}
      />
    </View>
  );
}
