import { forwardRef, useImperativeHandle, useState } from 'react';
import { CoverImage, CoverView } from '@tarojs/components';
import { switchTab } from '@tarojs/taro';
import clsx from 'clsx';
import { ADMIN_TAB_BAR_LIST, TAB_BAR_ID, USER_TAB_BAR_LIST } from '@shared/tabBar';
import styles from './index.module.scss';

export interface CustomTabBarRef {
  setSelected: (id: TAB_BAR_ID) => void;
}

const CustomTabBar = forwardRef<CustomTabBarRef>((_, ref) => {
  const [selected, setSelected] = useState<TAB_BAR_ID>();
  const [tarBarList, setTabBarList] = useState(() => {
    const isAdmin = false;
    return isAdmin ? ADMIN_TAB_BAR_LIST : USER_TAB_BAR_LIST;
  });

  useImperativeHandle(ref, () => ({
    setSelected: setSelected,
  }));

  return (
    <CoverView className={styles.tabBarWrapper}>
      <CoverView className={styles.tarBarBorder} />
      {tarBarList.map(item => {
        const { id, text, selectedIconPath, iconPath, pagePath } = item;
        return (
          <CoverView
            key={id}
            className={styles.tabBarItem}
            onClick={() => switchTab({ url: pagePath })}
          >
            <CoverImage src={selected === id ? selectedIconPath : iconPath} />
            <CoverView className={clsx({ [styles.isActive]: selected === id })}>{text}</CoverView>
          </CoverView>
        );
      })}
    </CoverView>
  );
});

export default CustomTabBar;
