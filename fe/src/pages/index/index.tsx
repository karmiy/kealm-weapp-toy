import { useEffect } from 'react';
import { Button, Text, View } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { AtButton } from 'taro-ui';
import './index.scss';

export default function () {
    useEffect(() => {
        console.log('useEffect222');
    }, []);

    return (
        <View className='index'>
            <Text className='w-80'>Hello world!</Text>
            <Button onClick={() => navigateTo({ url: '/pages/about/index?id=123' })}>
                跳转 About!!222
            </Button>
            <AtButton type='primary'>Taro UI 按钮</AtButton>
        </View>
    );
}
