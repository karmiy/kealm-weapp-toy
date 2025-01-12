import { Fragment } from 'react';
import { View } from '@tarojs/components';
import { WhiteSpace } from '@/ui/components';
import type { CouponItemProps } from '../item';
import { CouponItem } from '../item';
import styles from './index.module.scss';

interface CouponListProps {
  list?: Array<CouponItemProps>;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

const CouponList = (props: CouponListProps) => {
  const { list = [], selectedId, onSelect } = props;

  return (
    <View className={styles.wrapper}>
      {list.map((item, index) => {
        const { id } = item;
        return (
          <Fragment key={id}>
            {index !== 0 ? <WhiteSpace size='medium' /> : null}
            <CouponItem {...item} selected={id === selectedId} onClick={() => onSelect?.(id)} />
          </Fragment>
        );
      })}
    </View>
  );
};

export { CouponList, CouponListProps, CouponItem };
