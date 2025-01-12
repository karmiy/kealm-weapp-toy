import { View } from '@tarojs/components';
import { FloatLayout } from '@/ui/components';
import type { CouponItemProps } from './item';
import { CouponItem } from './item';
import { CouponList, CouponListProps } from './list';
import styles from './index.module.scss';

interface CouponActionSheetProps {
  visible?: boolean;
  selectedId?: string;
  list?: CouponListProps['list'];
  onClose?: () => void;
  onSelect?: (id: string) => void;
}

const CouponActionSheet = (props: CouponActionSheetProps) => {
  const { visible = false, selectedId, list, onClose, onSelect } = props;

  const handleSelect = (id: string) => {
    onSelect?.(id);
    onClose?.();
  };

  return (
    <FloatLayout visible={visible} title='优惠券' onClose={onClose} maxHeight={320}>
      <View className={styles.wrapper}>
        <CouponList list={list} selectedId={selectedId} onSelect={handleSelect} />
      </View>
    </FloatLayout>
  );
};

export { CouponActionSheet, CouponItem, CouponList, CouponItemProps };
