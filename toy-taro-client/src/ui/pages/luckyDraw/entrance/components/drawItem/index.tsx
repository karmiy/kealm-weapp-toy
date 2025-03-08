import { useMemo } from 'react';
import { View } from '@tarojs/components';
import { PAGE_ID } from '@shared/utils/constants';
import { navigateToPage } from '@shared/utils/router';
import { Button } from '@ui/components';
import { useLuckyDrawItem, useUserInfo } from '@ui/viewModel';
import styles from './index.module.scss';

interface Props {
  id: string;
}

export function DrawItem(props: Props) {
  const { id } = props;
  const { isAdmin } = useUserInfo();
  const { luckyDraw } = useLuckyDrawItem({ id });

  const Action = useMemo(() => {
    return (
      <Button
        size='large'
        width='100%'
        icon='present-fill'
        onClick={() =>
          navigateToPage({
            pageName: isAdmin ? PAGE_ID.LUCKY_DRAW_CONFIGURATION : PAGE_ID.LUCKY_DRAW_DETAIL,
            params: { id },
          })
        }
      >
        {isAdmin ? '配置祈愿池' : '去祈愿'}
      </Button>
    );
  }, [isAdmin, id]);

  if (!luckyDraw) {
    return null;
  }

  return (
    <View className={styles.drawItemWrapper}>
      <View
        className={styles.coverImg}
        style={{ backgroundImage: `url(${luckyDraw.coverImageUrl})` }}
      />
      <View className={styles.content}>
        <View className={styles.title}>
          <View className={styles.label}>{luckyDraw.name}</View>
          <View className={styles.tip}>需要{luckyDraw.quantity}张券</View>
        </View>
        {Action}
      </View>
    </View>
  );
}
