import { Fragment, useCallback, useState } from 'react';
import { View } from '@tarojs/components';
import { login as taroLogin } from '@tarojs/taro';
import { Logger } from '@shared/utils/logger';
import { showToast } from '@shared/utils/operateFeedback';
import { navigateToPage } from '@shared/utils/router';
import { sdk } from '@core';
import { bootstrap } from '@ui/bootstrap';
import { Button, Icon, Input, SafeAreaBar, WhiteSpace } from '@ui/components';
import { FormItem } from '@ui/container';
import { COLOR_VARIABLES, PAGE_ID } from '@/shared/utils/constants';
import { LOGIN_PAGE_STATUS } from './constants';
import styles from './index.module.scss';

const logger = Logger.getLogger('[UI][Login]');

export default function () {
  const [pageStatus, setPageStatus] = useState(LOGIN_PAGE_STATUS.DEFAULT);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const actionIcon = isLoading ? 'loading' : undefined;

  const handleLoginSuccess = useCallback(async () => {
    try {
      await bootstrap();
      await showToast({ title: '登录成功' });
      navigateToPage({ pageName: PAGE_ID.HOME, isRelaunch: true });
    } catch (error) {
      logger.error('reload sdk failed', error);
      showToast({ title: '登录后发生异常，请联系管理员' });
    }
  }, []);

  const handleLogin = useCallback(
    async (options: { handler: () => Promise<void>; logName: string }) => {
      const { handler, logName } = options;
      try {
        setIsLoading(true);
        await handler();
        await handleLoginSuccess();
      } catch (error) {
        logger.error(`${logName} login failed`, error);
        showToast({ title: '登录失败' });
      } finally {
        setIsLoading(false);
      }
    },
    [handleLoginSuccess],
  );

  const handleWxLogin = useCallback(async () => {
    handleLogin({
      handler: async () => {
        const { code } = await taroLogin();
        await sdk.modules.user.login({ code });
      },
      logName: 'wx',
    });
  }, [handleLogin]);

  const handleAccountLogin = useCallback(async () => {
    handleLogin({
      handler: async () => {
        await sdk.modules.user.login({ username, password });
      },
      logName: 'wx',
    });
  }, [username, password, handleLogin]);

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
              onClick={handleAccountLogin}
              disabled={isLoading}
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
              disabled={isLoading}
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
