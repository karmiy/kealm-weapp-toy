import { useMemo } from 'react';
import { View } from '@tarojs/components';
import { clsx } from 'clsx';
import { FallbackImage } from '@ui/components';
import { ProductScore } from '@ui/container';
import { previewImageManager } from '@ui/manager';
import styles from './index.module.scss';

interface ProductCardProps {
  mode?: 'horizontal' | 'vertical';
  isWhiteBg?: boolean;
  isRadius?: boolean;
  paddingSize?: 'small' | 'none';
  width?: string | number; // 用于 mode: vertical
  className?: string;
  style?: React.CSSProperties;
  coverImage: string;
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  discountedScore?: number;
  originalScore?: number;
  isLimitedTimeOffer?: boolean;
  action?: React.ReactNode;
}

const ProductCard = (props: ProductCardProps) => {
  const {
    className,
    style,
    mode = 'vertical',
    isWhiteBg = true,
    isRadius = mode === 'vertical',
    paddingSize = 'none',
    width,
    coverImage,
    title,
    subTitle,
    discountedScore,
    originalScore,
    isLimitedTimeOffer = false,
    action,
  } = props;

  const VerticalCard = useMemo(() => {
    if (mode !== 'vertical') {
      return;
    }
    return (
      <>
        <View className={styles.coverWrapper}>
          <View className={styles.coverContainer}>
            <FallbackImage
              src={coverImage}
              className={styles.coverImage}
              onClick={() => previewImageManager.preview({ current: coverImage })}
            />
          </View>
        </View>
        <View className={styles.title}>{title}</View>
        <View className={styles.subTitle}>{subTitle}</View>
        <View className={styles.operateWrapper}>
          {originalScore ? (
            <ProductScore
              discounted={isLimitedTimeOffer ? discountedScore : undefined}
              original={originalScore}
            />
          ) : null}
          {action}
        </View>
      </>
    );
  }, [
    action,
    coverImage,
    discountedScore,
    mode,
    originalScore,
    isLimitedTimeOffer,
    subTitle,
    title,
  ]);

  const HorizontalCard = useMemo(() => {
    if (mode !== 'horizontal') {
      return;
    }
    return (
      <>
        <FallbackImage
          src={coverImage}
          className={styles.coverImage}
          onClick={() => previewImageManager.preview({ current: coverImage })}
        />
        <View className={styles.info}>
          <View className={styles.header}>
            <View className={styles.title}>{title}</View>
            <View className={styles.subTitle}>{subTitle}</View>
          </View>
          <View className={styles.operateWrapper}>
            {originalScore ? (
              <ProductScore
                discounted={isLimitedTimeOffer ? discountedScore : undefined}
                original={originalScore}
              />
            ) : null}
            {action}
          </View>
        </View>
      </>
    );
  }, [
    mode,
    coverImage,
    title,
    subTitle,
    originalScore,
    isLimitedTimeOffer,
    discountedScore,
    action,
  ]);

  return (
    <View
      className={clsx(
        styles.wrapper,
        {
          [styles.isVertical]: mode === 'vertical',
          [styles.isHorizontal]: mode === 'horizontal',
          [styles.isWhiteBg]: isWhiteBg,
          [styles.isRadius]: isRadius,
          [styles.isSmallPadding]: paddingSize === 'small',
        },
        className,
      )}
      style={{
        ...style,
        width,
      }}
    >
      {VerticalCard}
      {HorizontalCard}
    </View>
  );
};

export { ProductCard };
