import { Fragment, useState } from 'react';
import { Text, View } from '@tarojs/components';
import { Button, Icon, Input, SafeAreaBar, WhiteSpace } from '@ui/components';
import { FormItem } from '@ui/container';
import { COLOR_VARIABLES } from '@/shared/utils/constants';
import { LOGIN_PAGE_STATUS } from './constants';
import styles from './index.module.scss';

export default function () {
  const [pageStatus, setPageStatus] = useState(LOGIN_PAGE_STATUS.DEFAULT);

  return (
    <View className={styles.loginWrapper}>
      <View className={styles.container}>
        {pageStatus === LOGIN_PAGE_STATUS.ACCOUNT_LOGIN ? (
          <Fragment>
            <FormItem title='账号' required>
              <Input placeholder='请输入用户名' />
            </FormItem>
            <FormItem title='密码' required>
              <Input placeholder='请输入密码' type='safe-password' />
            </FormItem>
            <Button className={styles.actionButton} size='large'>
              登录
            </Button>
            <View className={styles.back} onClick={() => setPageStatus(LOGIN_PAGE_STATUS.DEFAULT)}>
              <Icon name='arrow-left' color={COLOR_VARIABLES.COLOR_RED} /> 返回
            </View>
          </Fragment>
        ) : null}
        {pageStatus === LOGIN_PAGE_STATUS.DEFAULT ? (
          <Fragment>
            <Button className={styles.actionButton} size='large'>
              微信一键登录
            </Button>
            <WhiteSpace size='medium' />
            <Button
              className={styles.actionButton}
              type='plain'
              size='large'
              onClick={() => setPageStatus(LOGIN_PAGE_STATUS.ACCOUNT_LOGIN)}
            >
              账号密码登录
            </Button>
          </Fragment>
        ) : null}
      </View>
      <SafeAreaBar inset='bottom' />
    </View>
  );
}
