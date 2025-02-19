import { View } from '@tarojs/components';
import { PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { Button, Icon } from '@ui/components';
import styles from './index.module.scss';

export function DrawItem() {
  return (
    <View className={styles.drawItemWrapper}>
      <View className={styles.coverImg} />
      <View className={styles.content}>
        <View className={styles.title}>
          <View className={styles.label}>幸运转转乐</View>
          <View className={styles.tip}>需要3张券</View>
        </View>
        <Button
          size='large'
          width='100%'
          icon='gift-fill'
          onClick={() => navigateToPage({ pageName: PAGE_ID.LUCKY_DRAW_DETAIL })}
        >
          去祈愿
        </Button>
      </View>
    </View>
  );
}
