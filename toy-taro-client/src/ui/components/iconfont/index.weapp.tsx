/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import Taro from '@tarojs/taro';

export type IconNames = 'sort' | 'present' | 'present-fill' | 'task' | 'delete' | 'product' | 'edit' | 'loading' | 'empty' | 'exchange-record' | 'coupon' | 'star-fill' | 'star' | 'close' | 'arrow-up' | 'arrow-down' | 'arrow-right' | 'arrow-left' | 'uncheck' | 'check' | 'add' | 'minus' | 'cart-add-fill' | 'check-in';

interface Props {
  name: IconNames;
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

const IconFont: FunctionComponent<Props> = (props) => {
  const { name, size, color, style } = props;

  // @ts-ignore
  return <iconfont name={name} size={parseFloat(Taro.pxTransform(size))} color={color} style={style} />;
};

IconFont.defaultProps = {
  size: 28,
};

export default IconFont;
