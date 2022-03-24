import { getStorageSync, setStorageSync } from '@tarojs/taro';
import { atom, useRecoilState } from 'recoil';
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

    return {
        userInfo,
        setUserInfo: handleUserInfo,
    };
}
