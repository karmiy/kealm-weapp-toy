import { Fragment, PropsWithChildren } from 'react';
import { View } from '@tarojs/components';
import { useLaunch } from '@tarojs/taro';
import { useDialog } from '@/hooks';
import './app.scss';

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    console.log('App launched.');
  });

  const RootDialogs = useDialog();
  console.log('[test] children', children);

  // children 是将要会渲染的页面
  return children;
}

export default App;
