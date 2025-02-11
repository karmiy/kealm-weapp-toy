import { Fragment, useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { AtSearchBar } from 'taro-ui';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { ProductModel, STORE_NAME } from '@core';
import { IconButton, SafeAreaBar, StatusWrapper, WhiteSpace } from '@ui/components';
import { ProductCard } from '@ui/container';
import { useSyncOnPageShow } from '@ui/hooks';
import { useProductShopCart, useStoreFilter, useUserInfo } from '@ui/viewModel';
import styles from './index.module.scss';

export default function () {
  const router = useRouter();
  const { isAdmin } = useUserInfo();
  const { handleRefresh, refresherTriggered } = useSyncOnPageShow();
  const [searchValue, setSearchValue] = useState(router.params.searchValue ?? '');
  const [filterValue, setFilterValue] = useState(searchValue);
  const filterFunc = useCallback(
    (item: ProductModel) => item.name.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()),
    [filterValue],
  );
  const { models: products, loading } = useStoreFilter({
    storeName: STORE_NAME.PRODUCT,
    filterFunc,
  });
  const { addProductShopCart } = useProductShopCart();

  const handleSearch = useCallback(() => {
    setFilterValue(searchValue);
  }, [searchValue]);

  useEffect(() => {
    // 清空时搜索
    if (!searchValue && filterValue) {
      setFilterValue('');
    }
  }, [filterValue, searchValue]);

  return (
    <View className={styles.productSearchWrapper}>
      <View className={styles.searchWrapper}>
        <AtSearchBar
          className={styles.searchBar}
          value={searchValue}
          onChange={setSearchValue}
          onActionClick={handleSearch}
          placeholder='搜索'
        />
      </View>
      <View className={styles.list}>
        <StatusWrapper loading={loading} loadingIgnoreCount count={products.length} size='fill'>
          <ScrollView
            scrollY
            className={styles.scrollView}
            refresherEnabled
            refresherTriggered={refresherTriggered}
            onRefresherRefresh={handleRefresh}
            refresherBackground={COLOR_VARIABLES.FILL_BODY}
          >
            <View className={styles.container}>
              {products.map((product, index) => {
                const {
                  id,
                  name,
                  desc,
                  coverImageUrl,
                  discountedScore,
                  originalScore,
                  isLimitedTimeOffer,
                } = product;
                return (
                  <Fragment key={id}>
                    <ProductCard
                      className={styles.card}
                      mode='horizontal'
                      paddingSize='none'
                      title={name}
                      subTitle={desc}
                      coverImage={coverImageUrl}
                      discountedScore={discountedScore}
                      originalScore={originalScore}
                      isLimitedTimeOffer={isLimitedTimeOffer}
                      action={
                        !isAdmin ? (
                          <IconButton
                            name='cart-add-fill'
                            onClick={() => addProductShopCart(id, 1)}
                          />
                        ) : null
                      }
                    />
                    <WhiteSpace size='medium' line />
                  </Fragment>
                );
              })}
            </View>
          </ScrollView>
        </StatusWrapper>
      </View>
      <SafeAreaBar inset='bottom' />
    </View>
  );
}
