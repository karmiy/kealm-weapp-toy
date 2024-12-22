import { Button, Image, View } from '@tarojs/components';
import { pxTransform } from '@tarojs/taro';
import { OsButton } from 'ossaui';
import { WhiteSpace } from '@/components';
import CheckInIcon from '@/images/check-in.png';
import CheckInIconSVG from '@/images/check-in.svg';
import { MENU_BUTTON_WIDTH, SCREEN_INFO } from '@/utils/utils';
import { SearchBar } from '../searchBar';
import styles from './index.module.scss';

const STYLES = {
  width: SCREEN_INFO.width - MENU_BUTTON_WIDTH - 16,
};

const TopBar = () => {
  return (
    <View className={styles.topBar} style={STYLES}>
      <SearchBar />
      {/* <WhiteSpace isVertical={false} /> */}
      {/* <OsButton ic>签到</OsButton> */}
      <View className={styles.checkIn} />
      {/* <Image src={CheckInIconSVG} /> */}
    </View>
  );
};

export { TopBar };
