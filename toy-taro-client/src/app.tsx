import { PropsWithChildren } from 'react';
import { sdk } from '@core';
import { getApp, useLaunch } from '@tarojs/taro';
import { Logger } from '@shared/utils/logger';
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
