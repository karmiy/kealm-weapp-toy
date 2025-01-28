import { ComponentType } from 'react';
import { View } from '@tarojs/components';
import { getCurrentInstance, getTabBar, useDidShow } from '@tarojs/taro';
import { TAB_BAR_ID } from '@shared/tabBar';
import { SafeAreaBar } from '@ui/components';
import type { CustomTabBarRef } from '@/custom-tab-bar';
import styles from './index.module.scss';

interface Config {
  tabBarId: TAB_BAR_ID;
}

export function withCustomTabBar<T extends object>(
  WrappedComponent: ComponentType<T>,
  Config: Config,
) {
  const { tabBarId } = Config;
  return (props: T) => {
    useDidShow(() => {
      const pageCtx = getCurrentInstance().page;
      const tabbar = getTabBar<CustomTabBarRef>(pageCtx);
      tabbar?.setSelected(tabBarId);
    });

    return (
      <View className={styles.pageWrapperWithCustomTabBar}>
        <View className={styles.pageContainer}>
          <WrappedComponent {...props} />
        </View>
        <SafeAreaBar inset='tabBar' />
        <SafeAreaBar inset='bottom' />
      </View>
    );
  };
}
