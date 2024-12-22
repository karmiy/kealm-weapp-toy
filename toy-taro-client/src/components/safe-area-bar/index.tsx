import { View } from '@tarojs/components';
import { STATUS_BAR_HEIGHT } from '@/utils/utils';

const SafeAreaBar = () => {
  return <View style={{ height: STATUS_BAR_HEIGHT }} />;
};

export { SafeAreaBar };
