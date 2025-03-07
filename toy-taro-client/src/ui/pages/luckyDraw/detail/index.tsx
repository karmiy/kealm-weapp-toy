import { useCallback, useMemo, useRef, useState } from 'react';
import { Text, View } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import clsx from 'clsx';
import { showToast } from '@shared/utils/operateFeedback';
import { LUCKY_DRAW_TYPE, PRIZE_TYPE } from '@core';
import { LuckyGrid, LuckyRef, LuckyWheel, SafeAreaBar, StatusView } from '@ui/components';
import { useLuckyDrawAction, useLuckyDrawItem, usePrizeList, useUserInfo } from '@ui/viewModel';
import styles from './index.module.scss';

const LEVEL_TITLES = ['SSR', 'SR', 'R'];

const SPIN_DURATION = 3000;

export default function () {
  const router = useRouter();
  const luckyDrawRef = useRef<LuckyRef>(null);
  const luckyDrawId = router.params.id;
  const { prizeDict } = usePrizeList({ includeLuckyDraw: false, includeNone: true });
  const { handleStart, isStartLoading } = useLuckyDrawAction();
  const { luckyDraw, isPreView } = useLuckyDrawItem({
    id: luckyDrawId,
  });
  const { drawTicket } = useUserInfo();

  const beforeStart = useCallback(() => {
    if (!luckyDraw) {
      showToast({
        title: '祈愿池获取异常',
      });
      return false;
    }
    if (drawTicket < luckyDraw.quantity) {
      showToast({
        title: '祈愿券不足',
      });
      return false;
    }
    if (isStartLoading) {
      return false;
    }
    return true;
  }, [drawTicket, isStartLoading, luckyDraw]);

  const showSuccessToast = useCallback(
    (id: string) => {
      const prize = prizeDict.get(id);
      if (!prize) {
        showToast({
          title: '祈愿成功',
        });
        return;
      }
      showToast({
        title: `${prize.type === PRIZE_TYPE.NONE ? '' : '恭喜获得:'} ${prize.detailDesc}`,
      });
    },
    [prizeDict],
  );

  const onStart = useCallback(() => {
    if (isPreView) {
      return;
    }
    handleStart({
      id: luckyDrawId,
      onSuccess: async value => {
        luckyDrawRef.current?.play();

        await new Promise(resolve => setTimeout(resolve, SPIN_DURATION));
        luckyDrawRef.current?.stop(value.index);
      },
    });
  }, [handleStart, luckyDrawId, isPreView]);

  const onEnd = useCallback(
    ({ id, index }: { id: string; index: number }) => {
      showSuccessToast(id);
    },
    [showSuccessToast],
  );

  const LuckyCanvas = useMemo(() => {
    if (!luckyDraw) {
      return <StatusView type='empty' size='fill' />;
    }
    if (luckyDraw.type === LUCKY_DRAW_TYPE.WHEEL) {
      return (
        <LuckyWheel
          ref={luckyDrawRef}
          width={300}
          prizes={luckyDraw.prizes}
          beforeStart={beforeStart}
          onStart={onStart}
          onEnd={onEnd}
          disabledInnerAction={!isPreView}
        />
      );
    }
    if (luckyDraw.type === LUCKY_DRAW_TYPE.GRID) {
      return (
        <LuckyGrid
          ref={luckyDrawRef}
          width={300}
          prizes={luckyDraw.prizes}
          beforeStart={beforeStart}
          onStart={onStart}
          onEnd={onEnd}
          disabledInnerAction={!isPreView}
        />
      );
    }
    return null;
  }, [luckyDraw, beforeStart, onStart, onEnd, isPreView]);

  const LuckyRule = useMemo(() => {
    if (!luckyDraw) {
      return null;
    }

    const levelGroups = luckyDraw.levelPrizeGroups.slice(0, 3);
    return (
      <View className={styles.ruleWrapper}>
        <View className={styles.title}>祈愿信息</View>
        <View className={styles.rule}>
          1.每次祈愿消耗 <Text className={styles.highlight}>{luckyDraw.quantity}</Text> 张祈愿券
        </View>
        <View className={styles.rule}>
          <Text>2.祈愿池奖品: </Text>
          {levelGroups.map((group, gIdx) => {
            return (
              <View key={gIdx} className={styles.listItem}>
                <Text className={styles.title}>
                  稀有度 <Text className={styles.highlight}>{LEVEL_TITLES[gIdx]}</Text>
                </Text>
                {group.map((item, idx) => {
                  return (
                    <View key={`${item.id}_${idx}`} className={styles.listItem}>
                      <Text className={styles.highlight}>{item.detailDesc}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
        <View className={styles.rule}>3.祈愿后奖品将自动发放至您的账户中</View>
      </View>
    );
  }, [luckyDraw]);

  return (
    <View className={styles.wrapper}>
      <View className={styles.drawWrapper}>
        <View className={styles.header}>{luckyDraw?.name ?? '幸运祈愿池'}</View>
        <View className={styles.secondary}>我的祈愿券：{drawTicket}张</View>
        <View className={styles.luckyWrapper}>
          {LuckyCanvas}
          {/* <LuckyGrid
            ref={luckyDrawRef}
            width={300}
            beforeStart={() => {
              // showToast({
              //   title: '禁止祈愿',
              // });
              return true;
            }}
            disabledInnerAction
            onStart={() => {
              console.log('[test] onStart');
              luckyDrawRef.current?.play();

              setTimeout(() => {
                luckyDrawRef.current?.stop(9);
              }, 5000);
            }}
            prizes={[
              { id: '1', text: '1积分', type: 'points', range: 12 },
              { id: '2', text: '3积分', type: 'points', range: 7 },
              { id: '3', text: '谢谢惠顾', type: 'none', range: 12 },
              { id: '4', text: '5积分', type: 'points', range: 5 },
              { id: '5', text: '5折券', type: 'coupon', range: 1 },
              { id: '6', text: '1积分', type: 'points', range: 12 },
              { id: '7', text: '3积分', type: 'points', range: 7 },
              { id: '8', text: '8折券', type: 'coupon', range: 3 },
              { id: '9', text: '谢谢惠顾', type: 'none', range: 12 },
              { id: '10', text: '1积分', type: 'points', range: 12 },
            ]}
            onEnd={({ id, text, index }) => {
              console.log('[test] onEnd id', id, text, index);
              // showToast({
              //   title: `恭喜你获得${text}`,
              // });
            }}
          /> */}
        </View>
        {LuckyRule}
        {/* <View className={styles.ruleWrapper}>
          <View className={styles.title}>祈愿信息</View>
          <View className={styles.rule}>
            1.每次祈愿消耗 <Text className={styles.highlight}>1</Text> 张祈愿券
          </View>
          <View className={styles.rule}>
            <Text>2.祈愿池奖品: </Text>
            <View className={styles.listItem}>
              <Text className={styles.title}>稀有度 SSR</Text>
              <View className={styles.listItem}>
                <Text className={styles.highlight}>5折券</Text>
              </View>
              <View className={styles.listItem}>
                <Text className={styles.highlight}>
                  5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券
                </Text>
              </View>
            </View>
            <View className={styles.listItem}>
              <Text className={styles.title}>稀有度 SSR</Text>
              <View className={styles.listItem}>
                <Text className={styles.highlight}>5折券</Text>
              </View>
              <View className={styles.listItem}>
                <Text className={styles.highlight}>
                  5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券
                </Text>
              </View>
            </View>
            <View className={styles.listItem}>
              <Text className={styles.title}>稀有度 SSR</Text>
              <View className={styles.listItem}>
                <Text className={styles.highlight}>5折券</Text>
              </View>
              <View className={styles.listItem}>
                <Text className={styles.highlight}>
                  5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券5折券
                </Text>
              </View>
            </View>
          </View>
          <View className={styles.rule}>3.祈愿后奖品将自动发放至您的账户中</View>
        </View> */}
      </View>
      <SafeAreaBar inset='bottom' />
    </View>
  );
}
