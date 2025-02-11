import { View } from '@tarojs/components';
import { PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { WhiteSpace } from '@ui/components';
import { Item } from './item';
import styles from './index.module.scss';

const Hub = () => {
  return (
    <>
      <View className={styles.wrapper}>
        <View className={styles.container}>
          <Item
            title='上新清单'
            coverImage='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-melody-banner.png'
            onClick={() => {
              navigateToPage({
                pageName: PAGE_ID.PRODUCT_FRESH_ARRIVAL,
              });
            }}
          />
          <Item
            title='推荐专区'
            coverImage='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-hub-1.png'
          />
        </View>
      </View>
      <WhiteSpace size='large' />
    </>
  );
};

export { Hub };
