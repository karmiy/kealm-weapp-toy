import { useCallback, useMemo, useState } from 'react';
import { Text, View } from '@tarojs/components';
import { sdk, STORE_NAME } from '@core';
import { Button } from '@ui/components';
import { ProductCard } from '@ui/container';
import { useStoreById } from '@ui/viewModel';
import { useOperateFeedback } from '@/ui/hoc';
import styles from './index.module.scss';

interface ItemProps {
  id: string;
}

const Item = (props: ItemProps) => {
  const { id } = props;
  const order = useStoreById(STORE_NAME.ORDER, id);
  const { openToast, openConfirmDialog } = useOperateFeedback();
  const [isRequestRevoking, setIsRequestRevoking] = useState(false);

  const { name, desc, orderTime, score, coverImage, isRevoking } = order! ?? {};

  const subTitle = useMemo(() => {
    return (
      <View className={styles.subTitle}>
        <Text>{desc}</Text>
        <Text>兑换时间: {orderTime}</Text>
      </View>
    );
  }, [desc, orderTime]);

  const handleRevoke = useCallback(async () => {
    try {
      const feedback = await openConfirmDialog({
        content: '您确定要撤销兑换这件商品吗？撤销后请与管理员联系处理归还事宜',
      });
      if (!feedback) {
        return;
      }
      setIsRequestRevoking(true);
      await sdk.modules.order.revokeOrder(id);
      openToast({
        text: '撤销成功',
      });
    } catch {
      openToast({
        text: '撤销失败',
      });
    } finally {
      setIsRequestRevoking(false);
    }
  }, [openConfirmDialog, id, openToast]);

  if (!order) {
    return null;
  }
  return (
    <View className={styles.wrapper}>
      <ProductCard
        className={styles.card}
        mode='horizontal'
        paddingSize='none'
        title={name}
        subTitle={subTitle}
        coverImage={coverImage}
        originalScore={score}
        action={
          <Button
            size='small'
            type='plain'
            disabled={isRevoking || isRequestRevoking}
            onClick={handleRevoke}
          >
            {isRevoking ? '撤销中' : '撤销'}
          </Button>
        }
      />
    </View>
  );
};

export { Item };
