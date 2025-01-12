import { useState } from 'react';
import { View } from '@tarojs/components';
import { TabPanel, Tabs, WhiteSpace } from '@ui/components';
import { ToyList } from './toyList';
import styles from './index.module.scss';

// 初始不渲染参考：https://github.com/karmiy/kealm-react-components/blob/master/packages/components/cores/tabs/tab-pane.jsx

const Category = () => {
  const demoItems = [
    '卡牌',
    '美乐蒂',
    '玩偶',
    '赛车',
    '益智游戏',
    '泡泡玛特',
    '贴纸',
    '安静书',
    '文具',
  ];
  const [items, setItems] = useState<string[]>(demoItems);
  const [current, setCurrent] = useState(0);
  return (
    <>
      <Tabs current={current} onChange={setCurrent}>
        {items.map((item, index) => {
          return (
            <TabPanel key={item} label={item}>
              <ToyList />
            </TabPanel>
          );
        })}
      </Tabs>
      <WhiteSpace size='large' />
    </>
  );
};

export { Category };
