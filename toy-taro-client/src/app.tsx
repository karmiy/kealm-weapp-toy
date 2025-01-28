import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import { Logger } from '@shared/utils/logger';
import { showToast } from '@shared/utils/operateFeedback';
import { bootstrap } from '@ui/bootstrap';
import './app.scss';

function App({ children }: PropsWithChildren) {
  useLaunch(async () => {
    try {
      Logger.getLogger('[App]').info('App launched.');
      await bootstrap();
    } catch {
      showToast({ title: 'App启动失败，请联系管理员' });
    }
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
