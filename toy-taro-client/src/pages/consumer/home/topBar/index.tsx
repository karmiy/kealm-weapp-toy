import { Button, Image, View } from '@tarojs/components';
import { pxTransform } from '@tarojs/taro';
import { OsButton } from 'ossaui';
import { Icon, WhiteSpace } from '@/components';
import CheckInIcon from '@/images/check-in.png';
import CheckInIconSVG from '@/images/check-in.svg';
import { MENU_BUTTON, SCREEN_INFO } from '@/utils/utils';
import { SearchBar } from '../searchBar';
import styles from './index.module.scss';

const STYLES = {
  width: SCREEN_INFO.width - MENU_BUTTON.width - 16,
};

const TopBar = () => {
  return (
    <View className={styles.topBar} style={STYLES}>
      <Icon name='check-in' color='#FF69B4' size={24 * 2} />
      <SearchBar />
      {/* <WhiteSpace isVertical={false} /> */}
      {/* <OsButton ic>签到</OsButton> */}
      {/* <View className={styles.checkIn} /> */}
      {/* <Image src={CheckInIconSVG} /> */}
    </View>
  );
};

export { TopBar };
