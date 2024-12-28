import IconFont, { IconProps } from '../iconfont';

const Icon = (props: IconProps) => {
  const { size = 14 } = props;
  return <IconFont {...props} size={size * 2} />;
};

export { Icon };
