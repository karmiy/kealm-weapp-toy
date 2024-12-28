import { View } from '@tarojs/components';
import { Icon } from '@/components';
import { MENU_BUTTON, SCREEN_INFO } from '@/utils/utils';
import { SearchBar } from '../searchBar';
import styles from './index.module.scss';

const STYLES = {
  width: SCREEN_INFO.width - MENU_BUTTON.width - 16,
};

const TopBar = () => {
  return (
    <View className={styles.wrapper}>
      <View className={styles.topBar} style={STYLES}>
        <Icon name='check-in' color='#FF69B4' size={24} />
        <SearchBar />
      </View>
    </View>
  );
};

export { TopBar };
