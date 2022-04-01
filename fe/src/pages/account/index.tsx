import { useState } from 'react';
import { View } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import { AdditionForm } from '@/components';
import { ACCOUNT_MODE } from '@/utils/constants';
// import styles from './index.module.scss';

const TAB_LIST = [{ title: '支出' }, { title: '收入' }];

export default function () {
    const [currentTabIndex, setCurrentTabIndex] = useState(0);

    return (
        <View className='account'>
            <AtTabs
                current={currentTabIndex}
                tabList={TAB_LIST}
                onClick={setCurrentTabIndex}
                animated={false}
            >
                <AtTabsPane current={currentTabIndex} index={0}>
                    <AdditionForm mode={ACCOUNT_MODE.支出} />
                </AtTabsPane>
                <AtTabsPane current={currentTabIndex} index={1}>
                    <AdditionForm mode={ACCOUNT_MODE.收入} />
                </AtTabsPane>
            </AtTabs>
        </View>
    );
}
