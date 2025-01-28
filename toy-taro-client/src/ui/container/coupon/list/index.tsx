import { Fragment } from 'react';
import { View } from '@tarojs/components';
import { WhiteSpace } from '@ui/components';
import type { CouponItemProps, CouponRenderAction } from '../item';
import { CouponItem } from '../item';
import styles from './index.module.scss';

interface CouponListProps {
  list?: Array<CouponItemProps>;
  selectedId?: string;
  onSelect?: (id: string) => void;
  renderAction?: CouponRenderAction;
}

const CouponList = (props: CouponListProps) => {
  const { list = [], selectedId, onSelect, renderAction } = props;

  return (
    <View className={styles.wrapper}>
      {list.map((item, index) => {
        const { id } = item;
        return (
          <Fragment key={id}>
            {index !== 0 ? <WhiteSpace size='medium' /> : null}
            <CouponItem
              {...item}
              selected={id === selectedId}
              onClick={() => onSelect?.(id)}
              renderAction={renderAction}
            />
          </Fragment>
        );
      })}
    </View>
  );
};

export { CouponList, CouponListProps, CouponItem };
