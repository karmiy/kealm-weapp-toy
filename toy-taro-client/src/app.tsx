import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import { Logger } from './utils/logger';
import './app.scss';

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    Logger.getLogger('App').info('App launched.');
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
