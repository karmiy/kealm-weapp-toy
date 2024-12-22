import { View } from '@tarojs/components';
import { statusBarHeight } from '@/utils/utils';

export default function () {
  return <View style={{ height: `${statusBarHeight}px` }} />;
}
