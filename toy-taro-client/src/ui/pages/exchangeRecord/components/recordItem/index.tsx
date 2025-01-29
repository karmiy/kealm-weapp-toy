import { useCallback, useMemo, useState } from 'react';
import { Text, View } from '@tarojs/components';
import { showModal, showToast } from '@shared/utils/operateFeedback';
import { sdk, STORE_NAME } from '@core';
import { Button } from '@ui/components';
import { ProductCard } from '@ui/container';
import { useStoreById, useUserInfo } from '@ui/viewModel';
import styles from './index.module.scss';

interface RecordItemProps {
  id: string;
}

const RecordItem = (props: RecordItemProps) => {
  const { id } = props;
  const { isAdmin } = useUserInfo();
  const order = useStoreById(STORE_NAME.ORDER, id);
  const [isActionLoading, setIsActionLoading] = useState(false);

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
      const feedback = await showModal({
        content: '您确定要撤销兑换这件商品吗？撤销后请与管理员联系处理归还事宜',
      });
      if (!feedback) {
        return;
      }
      setIsActionLoading(true);
      await sdk.modules.order.revokeOrder(id);
      showToast({
        title: '撤销成功',
      });
    } catch {
      showToast({
        title: '撤销失败',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [id]);

  const handleApprove = useCallback(async () => {
    try {
      const feedback = await showModal({
        content: '确认同意撤销兑换吗？',
      });
      if (!feedback) {
        return;
      }
      setIsActionLoading(true);
      // await sdk.modules.order.approveOrder(id);
      // showToast({
      //   title: '同意撤销成功',
      // });
    } catch {
      showToast({
        title: '撤销失败',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, []);

  const ActionButton = useMemo(() => {
    if (!isAdmin) {
      return (
        <Button
          size='small'
          type='plain'
          disabled={isRevoking || isActionLoading}
          icon={isActionLoading ? 'loading' : undefined}
          onClick={handleRevoke}
        >
          {isRevoking ? '撤销中' : '撤销'}
        </Button>
      );
    }
    return (
      <Button
        size='small'
        type='plain'
        disabled={isActionLoading}
        icon={isActionLoading ? 'loading' : undefined}
        onClick={handleApprove}
      >
        同意撤销
      </Button>
    );
  }, [handleRevoke, handleApprove, isAdmin, isActionLoading, isRevoking]);

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
        action={ActionButton}
      />
    </View>
  );
};

export { RecordItem };
