import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import { sdk } from '@/core';
import { Logger } from '@/utils/logger';
import './app.scss';

function App({ children }: PropsWithChildren) {
  useLaunch(async () => {
    Logger.getLogger('[App]').info('App launched.');
    await sdk.load();
    // const toys = await sdk.modules.toy.getToyList();
    // Logger.getLogger('[App]').info('toys', toys);
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
