import { Fragment, useCallback, useMemo } from 'react';
import { Text, View } from '@tarojs/components';
import { STORE_NAME } from '@core';
import { Button, WhiteSpace } from '@ui/components';
import { ProductCard, ProductScore } from '@ui/container';
import { ORDER_ACTION_ID, useOrderAction, useStoreById, useUserInfo } from '@ui/viewModel';
import { ACTION_TITLE, ORDER_TIME_TITLE } from './constants';
import styles from './index.module.scss';

interface RecordItemProps {
  id: string;
}

const RecordItem = (props: RecordItemProps) => {
  const { id } = props;
  const { isAdmin } = useUserInfo();
  const role = isAdmin ? 'admin' : 'user';
  const order = useStoreById(STORE_NAME.ORDER, id);
  const { isActionLoading, handleRevoke, handleApprove, handleReject, currentActionId } =
    useOrderAction();

  const { products, orderTime, operateTime, score, discountScore, status } = order! ?? {};
  const orderTimeTitle = ORDER_TIME_TITLE[role][status];

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
    const action = ACTION_TITLE[role][status];

    return (
      <View className={styles.actionButtons}>
        {action.map((item, index) => {
          return (
            <Fragment key={index}>
              {index !== 0 ? <WhiteSpace size='small' isVertical={false} /> : null}
              <Button
                size='medium'
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
  }, [role, status, isActionLoading, currentActionId, handleAction]);

  if (!order) {
    return null;
  }
  return (
    <View className={styles.wrapper}>
      {products.map((product, index) => {
        return (
          <Fragment key={product.id}>
            {index !== 0 ? <WhiteSpace size='small' /> : null}
            <ProductCard
              className={styles.card}
              mode='horizontal'
              paddingSize='none'
              title={product.name}
              subTitle={
                <View className={styles.subTitle}>
                  {product.desc ? <Text>{product.desc}</Text> : null}
                  <Text>数量: {product.count}</Text>
                </View>
              }
              coverImage={product.cover_image}
            />
          </Fragment>
        );
      })}
      <WhiteSpace isVertical line size='large' />
      <View className={styles.orderInfo}>
        <View className={styles.item}>
          <Text className={styles.label}>兑换时间</Text>
          {orderTime}
        </View>
        <WhiteSpace size='small' />
        {orderTimeTitle ? (
          <>
            <View className={styles.item}>
              <Text className={styles.label}>{orderTimeTitle}</Text>
              {operateTime}
            </View>
            <WhiteSpace size='small' />
          </>
        ) : null}
        <View className={styles.item}>
          <Text className={styles.label}>兑换积分</Text>
          <ProductScore original={score} discounted={discountScore} />
        </View>
      </View>
      <WhiteSpace size='medium' />
      <View className={styles.actionWrapper}>{ActionButton}</View>
    </View>
  );
};

export { RecordItem };
