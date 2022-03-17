import { useEffect } from 'react';
import { Button, Text, View } from '@tarojs/components';
import { Current, navigateBack } from '@tarojs/taro';
import './index.scss';

export default function () {
    useEffect(() => {
        console.log(Current.router?.params.id);
    }, []);

    return (
        <View className='index'>
            <Text>About</Text>
            <Button onClick={() => navigateBack()}>后退</Button>
        </View>
    );
}
