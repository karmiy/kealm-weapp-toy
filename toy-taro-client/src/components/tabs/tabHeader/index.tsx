import { Fragment, useCallback, useContext, useEffect, useRef } from 'react';
import { Block, CustomWrapper, ScrollView, Text, View } from '@tarojs/components';
import { clsx } from 'clsx';
import { WhiteSpace } from '@/components';
import { useConsistentFunc } from '@/hooks';
import { getBoundingClientRect, getScrollOffset, scrollTo } from '@/utils/dom';
import { Logger } from '@/utils/logger';
import { TabsContext } from '../context';
import styles from './index.module.scss';

const logger = Logger.getLogger('[Tabs]').tag('[TabHeader]');

interface TabHeaderProps {
  onChange?: (value: number) => void;
  items: string[];
}

interface TabHeaderItemProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const TabHeaderItem = (props: TabHeaderItemProps) => {
  const { label, isActive, onClick } = props;
  const { variant, mode } = useContext(TabsContext);
  const isTextVariant = variant === 'text';
  const isContainedVariant = variant === 'contained';
  const isHorizontal = mode === 'horizontal';
  const isVertical = mode === 'vertical';

  return (
    <View
      className={clsx({
        [styles.item]: true,
        [styles.isActive]: isActive,
        [styles.isTextVariant]: isTextVariant,
        [styles.isContainedVariant]: isContainedVariant,
        [styles.isHorizontal]: isHorizontal,
        [styles.isVertical]: isVertical,
      })}
      onClick={onClick}
    >
      <Text className={styles.title}>{label}</Text>
    </View>
  );
};

const TabHeader = (props: TabHeaderProps) => {
  const { items, onChange } = props;
  const itemsDepsKey = items.join('_');
  const { current = 0, variant, mode } = useContext(TabsContext);
  const isTextVariant = variant === 'text';
  const isContainedVariant = variant === 'contained';
  const isHorizontal = mode === 'horizontal';
  const isVertical = mode === 'vertical';
  const scrollViewRef = useRef<{ ctx: TaroGeneral.IAnyObject }>(null);
  const containerRef = useRef<{ ctx: TaroGeneral.IAnyObject }>(null);

  const scrollTabToCenterView = useConsistentFunc(async (index: number) => {
    const containerCtx = containerRef.current?.ctx;
    const scrollViewCtx = scrollViewRef.current?.ctx;
    if (!containerCtx || !scrollViewCtx) {
      logger.error('scrollTabToCenterView', 'containerCtx or scrollViewCtx is null');
      return;
    }
    const [scrollViewRect, itemRects] = await Promise.all([
      getBoundingClientRect({
        component: scrollViewCtx,
        className: styles.wrapper,
      }),
      getBoundingClientRect({
        component: containerCtx,
        className: styles.item,
        selectAll: true,
      }),
    ]);
    const ctx = scrollViewRef.current?.ctx;
    if (!scrollViewRect || !itemRects.length || !ctx) {
      return;
    }
    const scrollView = scrollViewRect;
    const item = itemRects[index];
    const containerBoundarySizeUnit = isHorizontal ? 'left' : 'top';
    const containerRectSizeUnit = isHorizontal ? 'width' : 'height';
    const contentBoundarySizeUnit = isHorizontal ? 'scrollLeft' : 'scrollTop';
    const contentRectSizeUnit = isHorizontal ? 'scrollWidth' : 'scrollHeight';
    const delta =
      item[containerBoundarySizeUnit] -
      (scrollView[containerRectSizeUnit] - item[containerRectSizeUnit]) / 2 -
      scrollView[containerBoundarySizeUnit];
    const offset = await getScrollOffset({
      component: ctx,
      className: styles.wrapper,
    });

    logger.info('scrollToInfo', {
      wrapper: {
        [containerRectSizeUnit]: scrollView[containerRectSizeUnit],
      },
      item: {
        [containerBoundarySizeUnit]: item[containerBoundarySizeUnit],
        [containerRectSizeUnit]: item[containerRectSizeUnit],
      },
      scrollOffset: {
        [contentBoundarySizeUnit]: offset[contentBoundarySizeUnit],
        [contentRectSizeUnit]: offset[contentRectSizeUnit],
      },
      delta,
      expect: offset[contentBoundarySizeUnit] + delta,
      max: offset[contentRectSizeUnit] - scrollView[containerRectSizeUnit],
      min: 0,
    });

    scrollTo({
      component: ctx,
      className: styles.wrapper,
      [isHorizontal ? 'left' : 'top']: Math.min(
        Math.max(0, offset[contentBoundarySizeUnit] + delta),
        offset[contentRectSizeUnit] - scrollView[containerRectSizeUnit],
      ),
      // [isHorizontal ? 'left' : 'top']: offset[contentBoundarySizeUnit] + delta,
    });
  });

  useEffect(() => {
    scrollTabToCenterView(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsDepsKey, current]);

  return (
    <Block>
      <CustomWrapper ref={scrollViewRef}>
        <ScrollView
          scrollX={isHorizontal}
          scrollY={isVertical}
          className={clsx(styles.wrapper, {
            [styles.isHorizontal]: isHorizontal,
            [styles.isVertical]: isVertical,
            [styles.isTextVariant]: isTextVariant,
            [styles.isContainedVariant]: isContainedVariant,
          })}
          enableFlex
          enhanced
        >
          <CustomWrapper ref={containerRef}>
            <View
              className={clsx(styles.container, {
                [styles.isHorizontal]: isHorizontal,
                [styles.isVertical]: isVertical,
              })}
            >
              {items.map((item, index) => {
                const headerItemProps = {
                  label: item,
                  isActive: index === current,
                  onClick: () => onChange?.(index),
                };
                if (isTextVariant) {
                  return <TabHeaderItem key={item} {...headerItemProps} />;
                }
                if (isContainedVariant) {
                  return (
                    <Fragment key={item}>
                      {index !== 0 ? (
                        <WhiteSpace
                          isVertical={isVertical}
                          size={isVertical ? 'small' : 'medium'}
                        />
                      ) : null}
                      <TabHeaderItem {...headerItemProps} />
                    </Fragment>
                  );
                }
                return null;
              })}
            </View>
          </CustomWrapper>
        </ScrollView>
      </CustomWrapper>
    </Block>
  );
};

export { TabHeader };
