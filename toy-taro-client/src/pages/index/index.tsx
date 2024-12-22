import { useState } from 'react';
import { Text, View } from '@tarojs/components';
import { clsx } from 'clsx';
import { OsButton } from 'ossaui';
import styles from './index.module.scss';
import './index.scss';

const Index = () => {
  const [flag, setFlag] = useState(true);
  const className = clsx(
    flag ? 'bg-[#123456]' : 'bg-[#654321]',
    'text-white',
    "after:content-['click_here_to_switch_bg_className']",
    'p-[13.3333333px]',
    'rounded-[10086px]',
  );

  const logoClass = clsx(
    'bg-[url(https://pic1.zhimg.com/v2-3ee20468f54bbfefcd0027283b21aaa8_720w.jpg)] bg-[length:100%_100%] bg-no-repeat w-screen h-[41.54vw]',
  );
  return (
    <>
      <View className={logoClass} />
      <OsButton type='primary'>按钮</OsButton>
      <Text className='bg-black'>123123</Text>
      <View className={styles.header}>
        <Text>312312</Text>
      </View>
      <View className='[&_.u-count-down\_\_text]:!text-sky-400'>
        <View />
        <View>
          <View className="u-count-down__text text-[40px] text-center before:content-['taro-react-tailwind-vscode-template']" />
        </View>
      </View>
      <View className='space-y-4 flex flex-col items-center'>
        <View className="after:mx-auto after:text-center after:block after:content-['这是一个小程序taro_react_tailwindcss的模板'] after:text-lime-700" />
        <View
          className="rounded-lg p-1 bg-gray-100 dark:bg-zinc-800 h-20 w-40 after:text-xs after:content-['this_is_a_hover_block.have_a_try!']"
          hoverClass='bg-red-500 text-[#fff] dark:bg-green-500'
        />

        <View
          className={className}
          onClick={() => {
            setFlag(!flag);
          }}
        />
        <View className='test' />
      </View>
    </>
  );
};

export default Index;
