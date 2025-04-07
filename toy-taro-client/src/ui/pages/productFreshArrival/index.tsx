import { Fragment, useCallback, useMemo } from 'react';
import { ScrollView, View } from '@tarojs/components';
import { format, startOfToday } from 'date-fns';
import { ProductModel, STORE_NAME } from '@core';
import { IconButton, SafeAreaBar, StatusWrapper, WhiteSpace } from '@ui/components';
import { ProductCard } from '@ui/container';
import { useSyncOnPageShow } from '@ui/hooks';
import { useProductShopCart, useStoreFilter, useUserInfo } from '@ui/viewModel';
import styles from './index.module.scss';

export default function () {
  const { isAdmin } = useUserInfo();
  const { scrollViewRefreshProps } = useSyncOnPageShow();
  const filterFunc = useCallback((item: ProductModel) => {
    // 近 7 天
    const sevenDaysAgo = new Date(startOfToday().getTime() - 7 * 24 * 60 * 60 * 1000);
    return item.createTime >= sevenDaysAgo.getTime();
  }, []);
  const { models, loading } = useStoreFilter({
    storeName: STORE_NAME.PRODUCT,
    filterFunc,
  });
  const products = useMemo(() => {
    return [...models].sort((a, b) => b.createTime - a.createTime);
  }, [models]);
  const { addProductShopCart } = useProductShopCart();

  return (
    <View className={styles.productSearchWrapper}>
      <View className={styles.list}>
        <StatusWrapper loading={loading} loadingIgnoreCount count={products.length} size='fill'>
          <ScrollView scrollY className={styles.scrollView} {...scrollViewRefreshProps}>
            <View className={styles.container}>
              {products.map(product => {
                const {
                  id,
                  name,
                  desc,
                  coverImageUrl,
                  discountedScore,
                  originalScore,
                  isLimitedTimeOffer,
                  createTime,
                } = product;
                return (
                  <Fragment key={id}>
                    <ProductCard
                      mode='horizontal'
                      paddingSize='none'
                      title={name}
                      subTitle={
                        <Fragment>
                          <View className={styles.desc}>{desc}</View>
                          <View className={styles.createTime}>
                            上架时间：{format(createTime, 'yyyy-MM-dd')}
                          </View>
                        </Fragment>
                      }
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
