import { PropsWithChildren } from 'react';
import { getApp, useLaunch } from '@tarojs/taro';
import { sdk } from '@/core';
import { Logger } from '@/utils/logger';
import './app.scss';

function App({ children }: PropsWithChildren) {
  useLaunch(async () => {
    Logger.getLogger('[App]').info('App launched.');
    await sdk.load();
    getApp().sdk = sdk;
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
