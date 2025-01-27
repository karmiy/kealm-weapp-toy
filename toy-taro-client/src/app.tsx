import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import { Logger } from '@shared/utils/logger';
import { bootstrap } from '@ui/bootstrap';
import './app.scss';

function App({ children }: PropsWithChildren) {
  useLaunch(async () => {
    Logger.getLogger('[App]').info('App launched.');
    await bootstrap();
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
