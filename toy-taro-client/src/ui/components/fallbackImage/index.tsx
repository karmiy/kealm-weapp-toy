import { useState } from 'react';
import { BaseEventOrig, Image, ImageProps } from '@tarojs/components';
import { clsx } from 'clsx';
import styles from './index.module.scss';

const FallbackImage = (props: ImageProps) => {
  const { className, onError: _onError, ...rest } = props;

  const [isError, setIsError] = useState(false);

  const onError = (event: BaseEventOrig<ImageProps.onErrorEventDetail>) => {
    setIsError(true);
    _onError?.(event);
  };
  return (
    <Image
      className={clsx(styles.fallbackImageWrapper, { [styles.isError]: isError }, className)}
      mode='aspectFill'
      lazyLoad
      onError={onError}
      {...rest}
    />
  );
};

export { FallbackImage };
