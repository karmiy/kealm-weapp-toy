/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';

export type IconNames = 'arrow-up' | 'arrow-down' | 'arrow-right' | 'arrow-left' | 'uncheck' | 'check' | 'add' | 'minus' | 'cart-add-fill' | 'check-in';

export interface IconProps {
  name: IconNames;
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

const IconFont: FunctionComponent<IconProps> = () => {
  return null;
};

export default IconFont;
