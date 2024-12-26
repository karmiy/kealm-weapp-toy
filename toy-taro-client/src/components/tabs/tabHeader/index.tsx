import { useCallback, useContext, useEffect, useRef } from 'react';
import { Block, CustomWrapper, ScrollView, Text, View } from '@tarojs/components';
import { clsx } from 'clsx';
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

  return (
    <View
      className={clsx({
        [styles.item]: true,
        [styles.isActive]: isActive,
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
  const { current = 0 } = useContext(TabsContext);
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
    const deltaLeft = item.left - (scrollView.width - item.width) / 2;
    const offset = await getScrollOffset({
      component: ctx,
      className: styles.wrapper,
    });

    logger.info('scrollToInfo', {
      wrapper: {
        width: scrollView.width,
      },
      item: {
        left: item.left,
        width: item.width,
      },
      scrollOffset: {
        scrollLeft: offset.scrollLeft,
        scrollWidth: offset.scrollWidth,
      },
      deltaLeft,
      expect: offset.scrollLeft + deltaLeft,
      max: offset.scrollWidth - scrollView.width,
      min: 0,
    });

    scrollTo({
      component: ctx,
      className: styles.wrapper,
      left: Math.min(
        Math.max(0, offset.scrollLeft + deltaLeft),
        offset.scrollWidth - scrollView.width,
      ),
      // left: offset.scrollLeft + deltaLeft,
    });
  });

  useEffect(() => {
    scrollTabToCenterView(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsDepsKey, current]);

  return (
    <Block>
      <CustomWrapper ref={scrollViewRef}>
        <ScrollView scrollX className={styles.wrapper} enableFlex enhanced>
          <CustomWrapper ref={containerRef}>
            <View className={styles.container}>
              {items.map((item, index) => {
                return (
                  <TabHeaderItem
                    key={item}
                    label={item}
                    isActive={index === current}
                    onClick={() => onChange?.(index)}
                  />
                );
              })}
            </View>
          </CustomWrapper>
        </ScrollView>
      </CustomWrapper>
    </Block>
  );
};

export { TabHeader };
