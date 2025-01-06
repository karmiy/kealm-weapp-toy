import { View } from '@tarojs/components';
import { Icon } from '@/components';
import { PAGE_ID } from '@/utils/constants';
import { navigateToPage } from '@/utils/router';
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
        <View
          className={styles.checkIn}
          onClick={() => navigateToPage({ pageName: PAGE_ID.CHECK_IN })}
        >
          <Icon name='check-in' color='#FF69B4' size={24} />
        </View>
        <SearchBar />
      </View>
    </View>
  );
};

export { TopBar };
