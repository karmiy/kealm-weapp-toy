import { pxTransform } from '@tarojs/taro';
import { OsSearch } from 'ossaui';
import { MENU_BUTTON_WIDTH, SCREEN_INFO } from '@/utils/utils';
import styles from './index.module.scss';

const SEARCH_STYLES = {
  backgroundColor: 'transparent',
};

const SearchBar = () => {
  return (
    <OsSearch
      className={styles.searchBar}
      customStyle={SEARCH_STYLES}
      showSplitLine={false}
      placeholder='搜索'
    />
  );
};

export { SearchBar };
