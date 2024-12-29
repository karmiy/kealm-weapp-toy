import { Text, View } from '@tarojs/components';
import { ActionSheet, WhiteSpace } from '@/components';
import { CouponItem } from './item';
import { CouponList } from './list';
import styles from './index.module.scss';

interface CouponActionSheetProps {
  visible?: boolean;
  onClose?: () => void;
}

const CouponActionSheet = (props: CouponActionSheetProps) => {
  const { visible = false, onClose } = props;

  const list = [
    {
      id: '1',
      score: 50,
      condition: '无门槛',
      title: '新人优惠券',
      range: '全场商品可用',
      period: '2024-12-31',
    },
    {
      id: '2',
      score: 20,
      condition: '满199可用',
      title: '美乐蒂玩具专享券',
      range: '仅限玩具类商品',
      period: '2024-12-31',
      disabled: true,
    },
    {
      id: '3',
      score: 100,
      condition: '满299可用',
      title: '节日特惠券',
      range: '全场商品可用',
      period: '2024-12-31',
    },
    {
      id: '4',
      score: 40,
      condition: '无门槛',
      title: '新人优惠券',
      range: '全场商品可用',
      period: '2024-12-31',
    },
  ];

  return (
    <ActionSheet visible={visible} onClose={onClose} title='优惠券' maxHeight={320}>
      <View className={styles.wrapper}>
        <CouponList list={list} onClick={onClose} />
      </View>
    </ActionSheet>
  );
};

export { CouponActionSheet, CouponItem, CouponList };
