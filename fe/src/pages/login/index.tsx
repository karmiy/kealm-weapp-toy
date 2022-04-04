import { Image, Text, View } from '@tarojs/components';
import { getUserProfile, setStorageSync, showToast } from '@tarojs/taro';
import { AtButton } from 'taro-ui';
import { login } from '@/services';
import { useUserInfoStore } from '@/store';
import { asyncWrapper } from '@/utils/base';
import { getStorageKey, navigateToPage } from '@/utils/utils';
import styles from './index.module.scss';

export default function () {
    const { applyForUserInfo } = useUserInfoStore();

    const handleLogin = async () => {
        await applyForUserInfo();

        // 登录
        const [loginData, loginErr] = await asyncWrapper(login());

        if (loginErr || !loginData.data.token) {
            showToast({
                title: '登录失败',
            });
            return;
        }

        // token 存缓存
        setStorageSync(getStorageKey('auth'), loginData.data.token);

        // 跳转到首页
        navigateToPage({
            pageName: 'detail',
            isSwitchTab: true,
        });
    };
    return (
        <View className={`${styles.wrapper} h-full flex flex-col items-center relative`}>
            {/* <Image
                className={styles.logo}
                src='https://gitee.com/karmiy/static/raw/master/weapp-accounts/imgs/kirby-logo.png'
            /> */}
            {/* <Text className={styles.title}>卡比记账</Text> */}
            {/* <Text className={styles.desc}>记账一键通，让统计更便捷</Text> */}
            <AtButton type='primary' className={styles.loginBtn} onClick={handleLogin}>
                微信一键登录
            </AtButton>
        </View>
    );
}
