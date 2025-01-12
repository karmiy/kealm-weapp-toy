import { useMemo } from 'react';
import { Image, Text, View } from '@tarojs/components';
import { clsx } from 'clsx';
import { ToyScore } from '@/ui/container';
import styles from './index.module.scss';

interface ToyCardProps {
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
  originalScore: number;
  action?: React.ReactNode;
}

const ToyCard = (props: ToyCardProps) => {
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
            <Image src={coverImage} mode='aspectFill' lazyLoad className={styles.coverImage} />
          </View>
        </View>
        <View className={styles.title}>{title}</View>
        <View className={styles.subTitle}>{subTitle}</View>
        <View className={styles.operateWrapper}>
          <ToyScore discounted={discountedScore} original={originalScore} />
          {action}
        </View>
      </>
    );
  }, [action, coverImage, discountedScore, mode, originalScore, subTitle, title]);

  const HorizontalCard = useMemo(() => {
    if (mode !== 'horizontal') {
      return;
    }
    return (
      <>
        <Image src={coverImage} mode='aspectFill' lazyLoad className={styles.coverImage} />
        <View className={styles.info}>
          <View className={styles.header}>
            <View className={styles.title}>{title}</View>
            <View className={styles.subTitle}>{subTitle}</View>
          </View>
          <View className={styles.operateWrapper}>
            <ToyScore discounted={discountedScore} original={originalScore} />
            {action}
          </View>
        </View>
      </>
    );
  }, [mode, coverImage, title, subTitle, discountedScore, originalScore, action]);

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

export { ToyCard };
