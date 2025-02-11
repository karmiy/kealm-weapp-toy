import { useCallback, useState } from 'react';
import { AtSearchBar } from 'taro-ui';
import { PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import styles from './index.module.scss';

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('');

  const onSearch = useCallback(() => {
    navigateToPage({
      pageName: PAGE_ID.PRODUCT_SEARCH,
      params: {
        searchValue,
      },
    });
    setSearchValue('');
  }, [searchValue]);

  return (
    <AtSearchBar
      className={styles.searchBar}
      value={searchValue}
      onChange={setSearchValue}
      onActionClick={onSearch}
      placeholder='搜索'
    />
  );
};

export { SearchBar };
