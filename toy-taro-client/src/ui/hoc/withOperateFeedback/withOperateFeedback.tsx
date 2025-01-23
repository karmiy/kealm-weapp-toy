import { ComponentType, useCallback, useState } from 'react';
import { Block } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import { Context, FeedbackParams } from './context';

interface Config {
  enableToast?: boolean;
}

export function withOperateFeedback<T extends object>(
  WrappedComponent: ComponentType<T>,
  Config?: Config,
) {
  const { enableToast = false } = Config ?? {};
  return (props: T) => {
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMes, setToastMes] = useState('');
    const openToast = useCallback((params: FeedbackParams) => {
      const { mes } = params;
      setToastMes(mes);
      setIsToastOpen(true);
    }, []);

    return (
      <Context.Provider value={{ openToast }}>
        <WrappedComponent {...props} />
        {/* https://juejin.cn/post/7299736066423848994 */}
        {/* scrollView 同级节点有更新会导致 scroll 位置回到 0 */}
        <Block>
          {enableToast && (
            <AtToast isOpened={isToastOpen} onClose={() => setIsToastOpen(false)} text={toastMes} />
          )}
        </Block>
      </Context.Provider>
    );
  };
}
