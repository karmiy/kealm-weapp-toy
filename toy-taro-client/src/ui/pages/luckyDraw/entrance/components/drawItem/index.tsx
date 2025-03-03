import { useMemo } from 'react';
import { View } from '@tarojs/components';
import { PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { Button, Icon } from '@ui/components';
import { useUserInfo } from '@ui/viewModel';
import styles from './index.module.scss';

export function DrawItem() {
  const { isAdmin } = useUserInfo();

  const Action = useMemo(() => {
    return (
      <Button
        size='large'
        width='100%'
        icon='present-fill'
        onClick={() =>
          navigateToPage({
            pageName: isAdmin ? PAGE_ID.LUCKY_DRAW_CONFIGURATION : PAGE_ID.LUCKY_DRAW_DETAIL,
          })
        }
      >
        {isAdmin ? '配置祈愿池' : '去祈愿'}
      </Button>
    );
  }, [isAdmin]);

  return (
    <View className={styles.drawItemWrapper}>
      <View className={styles.coverImg} />
      <View className={styles.content}>
        <View className={styles.title}>
          <View className={styles.label}>幸运转转乐</View>
          <View className={styles.tip}>需要3张券</View>
        </View>
        {Action}
      </View>
    </View>
  );
}
