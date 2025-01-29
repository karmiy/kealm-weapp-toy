import { useState } from 'react';
import { AtSearchBar } from 'taro-ui';
import styles from './index.module.scss';

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <AtSearchBar
      className={styles.searchBar}
      value={searchValue}
      onChange={setSearchValue}
      placeholder='搜索'
    />
  );
};

export { SearchBar };
