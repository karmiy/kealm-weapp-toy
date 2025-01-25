import { useCallback } from 'react';
import { clsx } from 'clsx';
import { AtImagePicker } from 'taro-ui';
import type { AtImagePickerProps, File } from 'taro-ui/types/image-picker';
import { previewImageManager } from '@ui/manager';
import styles from './index.module.scss';

// 图片上传方式，见 https://taro-ui.jd.com/#/docs/imagepicker，用 Taro.uploadFile 上传图片
type ImagePickerProps = AtImagePickerProps;

const ImagePicker = (props: ImagePickerProps) => {
  const { className, onImageClick: _onImageClick, ...rest } = props;
  const onImageClick = useCallback(
    (index: number, file: File) => {
      previewImageManager.preview({ current: file.url });
      _onImageClick?.(index, file.url);
    },
    [_onImageClick],
  );
  return (
    <AtImagePicker
      className={clsx(styles.imagePickerWrapper, className)}
      onImageClick={onImageClick}
      {...rest}
    />
  );
};

export { ImagePicker };
