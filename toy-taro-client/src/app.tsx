import { PropsWithChildren } from 'react';
import { getApp, useLaunch } from '@tarojs/taro';
import { Logger } from '@shared/utils/logger';
import { sdk } from '@core';
import { bootstrap } from '@ui/controller';
import './app.scss';

function App({ children }: PropsWithChildren) {
  useLaunch(async () => {
    Logger.getLogger('[App]').info('App launched.');
    await sdk.load();
    getApp().sdk = sdk;
    await bootstrap();
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
