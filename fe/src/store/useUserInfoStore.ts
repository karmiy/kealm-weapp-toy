import { getStorageSync, getUserProfile, setStorageSync } from '@tarojs/taro';
import { atom, useRecoilState } from 'recoil';
import { asyncWrapper } from '@/utils/base';
import { getStorageKey } from '@/utils/utils';

interface UserInfo {
    nickName: string;
    avatarUrl: string;
}

const DEFAULT_USER_INFO = {
    nickName: '游客',
    avatarUrl: 'https://gitee.com/karmiy/static/raw/master/weapp-accounts/imgs/kirby-5.png',
};

const userInfoState = atom({
    key: 'userInfo',
    default: getStorageSync<UserInfo>(getStorageKey('user-info')) ?? DEFAULT_USER_INFO,
});

export function useUserInfoStore() {
    const [userInfo, setUserInfo] = useRecoilState(userInfoState);

    const handleUserInfo = (val: UserInfo) => {
        setStorageSync(getStorageKey('user-info'), val);
        setUserInfo(val);
    };

    const applyForUserInfo = async () => {
        // 申请获取昵称、头像
        const [profileData, profileErr] = await asyncWrapper(
            getUserProfile({
                lang: 'zh_CN',
                desc: '卡比记账',
            }),
        );

        if (profileErr || !profileData) return;

        // 存到全局 store
        handleUserInfo({
            nickName: profileData.userInfo.nickName,
            avatarUrl: profileData.userInfo.avatarUrl,
        });
    };

    return {
        userInfo,
        applyForUserInfo,
    };
}
