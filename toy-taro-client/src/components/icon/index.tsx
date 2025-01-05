import type { IconNames, IconProps } from '../iconfont';
import IconFont from '../iconfont';

const Icon = (props: IconProps) => {
  const { size = 14 } = props;
  return <IconFont {...props} size={size * 2} />;
};

export { Icon, IconProps, IconNames };
