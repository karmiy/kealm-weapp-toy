import { Fragment, useCallback, useMemo } from 'react';
import { Text, View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { Button, WhiteSpace } from '@ui/components';
import { ProductCard } from '@ui/container';
import { ORDER_ACTION_ID, useOrderAction, useStoreById, useUserInfo } from '@ui/viewModel';
import { ACTION_TITLE } from './constants';
import styles from './index.module.scss';

interface RecordItemProps {
  id: string;
}

const RecordItem = (props: RecordItemProps) => {
  const { id } = props;
  const { isAdmin } = useUserInfo();
  const order = useStoreById(STORE_NAME.ORDER, id);
  const { isActionLoading, handleRevoke, handleApprove, handleReject, currentActionId } =
    useOrderAction();

  const { name, desc, orderTime, score, coverImage, count, status } = order! ?? {};

  const subTitle = useMemo(() => {
    return (
      <View className={styles.subTitle}>
        <Text>{desc}</Text>
        <Text>兑换时间: {orderTime}</Text>
        <Text>数量: {count}</Text>
      </View>
    );
  }, [desc, orderTime, count]);

  const handleAction = useCallback(
    async (actionId?: ORDER_ACTION_ID) => {
      if (!actionId) {
        return;
      }
      actionId === ORDER_ACTION_ID.REVOKE && handleRevoke(id);
      actionId === ORDER_ACTION_ID.APPROVE && handleApprove(id);
      actionId === ORDER_ACTION_ID.REJECT && handleReject(id);
    },
    [handleRevoke, id, handleApprove, handleReject],
  );

  const ActionButton = useMemo(() => {
    const role = isAdmin ? 'admin' : 'user';
    const action = ACTION_TITLE[role][status];

    return (
      <View className={styles.actionWrapper}>
        {action.map((item, index) => {
          return (
            <Fragment key={index}>
              {index !== 0 ? <WhiteSpace size='small' isVertical={false} /> : null}
              <Button
                size='small'
                type={item.type}
                disabled={item.disabled || isActionLoading}
                icon={
                  isActionLoading && currentActionId && currentActionId === item.id
                    ? 'loading'
                    : undefined
                }
                onClick={() => handleAction(item.id)}
              >
                {item.label}
              </Button>
            </Fragment>
          );
        })}
      </View>
    );
  }, [isAdmin, status, isActionLoading, currentActionId, handleAction]);

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
