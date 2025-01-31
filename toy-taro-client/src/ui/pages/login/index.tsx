import { Fragment, useState } from 'react';
import { View } from '@tarojs/components';
import { Button, Icon, Input, SafeAreaBar, WhiteSpace } from '@ui/components';
import { FormItem } from '@ui/container';
import { useUserAction } from '@ui/viewModel';
import { COLOR_VARIABLES } from '@/shared/utils/constants';
import { LOGIN_PAGE_STATUS } from './constants';
import styles from './index.module.scss';

export default function () {
  const [pageStatus, setPageStatus] = useState(LOGIN_PAGE_STATUS.DEFAULT);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isActionLoading, handleWxLogin, handleAccountLogin } = useUserAction();
  const actionIcon = isActionLoading ? 'loading' : undefined;

  return (
    <View className={styles.loginWrapper}>
      <View className={styles.container}>
        {pageStatus === LOGIN_PAGE_STATUS.ACCOUNT_LOGIN ? (
          <Fragment>
            <FormItem title='账号' required>
              <Input
                placeholder='请输入用户名'
                value={username}
                onInput={e => setUsername(e.detail.value)}
              />
            </FormItem>
            <FormItem title='密码' required>
              <Input
                placeholder='请输入密码'
                type='safe-password'
                value={password}
                onInput={e => setPassword(e.detail.value)}
              />
            </FormItem>
            <Button
              icon={actionIcon}
              className={styles.actionButton}
              size='large'
              onClick={() => handleAccountLogin({ username, password })}
              disabled={isActionLoading}
            >
              登录
            </Button>
            <View className={styles.back} onClick={() => setPageStatus(LOGIN_PAGE_STATUS.DEFAULT)}>
              <Icon name='arrow-left' color={COLOR_VARIABLES.COLOR_RED} /> 返回
            </View>
          </Fragment>
        ) : null}
        {pageStatus === LOGIN_PAGE_STATUS.DEFAULT ? (
          <Fragment>
            <Button
              icon={actionIcon}
              className={styles.actionButton}
              size='large'
              onClick={handleWxLogin}
              disabled={isActionLoading}
            >
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
