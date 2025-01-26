import { Text, View } from '@tarojs/components';
import { TAB_BAR_ID } from '@shared/tabBar';
import { COLOR_VARIABLES, PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { FallbackImage, Icon, WhiteSpace } from '@ui/components';
import { withCustomTabBar } from '@ui/hoc';
import styles from './index.module.scss';

function Task() {
  return (
    <View className={styles.wrapper}>
      <View className={styles.header}>
        <View className={styles.avatar}>
          <FallbackImage
            src='https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/demo/demo-avatar.png'
            className={styles.image}
          />
        </View>
        <View className={styles.info}>
          <Text className={styles.name}>洪以妍</Text>
          <Text className={styles.score}>积分: 144</Text>
        </View>
      </View>
      <View className={styles.container}>
        {/* <AtButton type='primary'>按钮</AtButton> */}
        <View className={styles.menuList}>
          <View
            className={styles.menuItem}
            onClick={() => navigateToPage({ pageName: PAGE_ID.COUPON })}
          >
            <View className={styles.title}>
              <Icon name='coupon' size={14} color={COLOR_VARIABLES.COLOR_RED} />
              <Text>优惠券</Text>
            </View>
            <Icon name='arrow-right' size={14} />
          </View>
          <View
            className={styles.menuItem}
            onClick={() => navigateToPage({ pageName: PAGE_ID.EXCHANGE_RECORD })}
          >
            <View className={styles.title}>
              <Icon name='exchange-record' size={14} color={COLOR_VARIABLES.COLOR_RED} />
              <Text>兑换记录</Text>
            </View>
            <Icon name='arrow-right' size={14} />
          </View>
          <View
            className={styles.menuItem}
            onClick={() => navigateToPage({ pageName: PAGE_ID.PRODUCT_MANAGE })}
          >
            <View className={styles.title}>
              <Icon name='product' size={14} color={COLOR_VARIABLES.COLOR_RED} />
              <Text>商品管理</Text>
            </View>
            <Icon name='arrow-right' size={14} />
          </View>
        </View>
        <WhiteSpace size='medium' />
        <View className={styles.menuList}>
          <View className={styles.menuButton}>
            <Text>退出登录</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const TaskPage = withCustomTabBar(Task, { tabBarId: TAB_BAR_ID.MINE });

export default TaskPage;
