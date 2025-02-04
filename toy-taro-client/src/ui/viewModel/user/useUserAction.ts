import { useCallback, useState } from 'react';
import { BaseEventOrig } from '@tarojs/components';
import { login as taroLogin } from '@tarojs/taro';
import { PAGE_ID } from '@shared/utils/constants';
import { Logger } from '@shared/utils/logger';
import { showToast } from '@shared/utils/operateFeedback';
import { navigateToPage } from '@shared/utils/router';
import { sdk } from '@core';
import { bootstrap, unBootstrap } from '@ui/bootstrap';

const logger = Logger.getLogger('[useUserAction]');

export function useUserAction() {
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleLoginSuccess = useCallback(async () => {
    try {
      await bootstrap();
      await showToast({ title: '登录成功' });
      navigateToPage({ pageName: PAGE_ID.HOME, isRelaunch: true });
    } catch (error) {
      logger.tag('[handleLoginSuccess]').error('reload sdk failed', error);
      showToast({ title: '登录后发生异常，请联系管理员' });
    }
  }, []);

  const handleLogin = useCallback(
    async (options: { handler: () => Promise<void>; logName: string }) => {
      const { handler, logName } = options;
      try {
        setIsActionLoading(true);
        await handler();
        await handleLoginSuccess();
      } catch (error) {
        logger.tag('[handleLogin]').error(`${logName} login failed`, error);
        showToast({ title: error.message ?? '登录失败' });
      } finally {
        setIsActionLoading(false);
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

  const handleAccountLogin = useCallback(
    async (params: { username: string; password: string }) => {
      const { username, password } = params;
      handleLogin({
        handler: async () => {
          await sdk.modules.user.login({ username, password });
        },
        logName: 'wx',
      });
    },
    [handleLogin],
  );

  const handleChooseAvatar = useCallback(
    async (e: BaseEventOrig<any>) => {
      try {
        if (isActionLoading) {
          return;
        }
        const { avatarUrl } = e.detail;
        setIsActionLoading(true);
        await sdk.modules.user.uploadAvatar(avatarUrl);
      } catch (error) {
        logger.tag('[handleChooseAvatar]').error('onChooseAvatar error', error.message);
        showToast({ title: '头像更新失败' });
      } finally {
        setIsActionLoading(false);
      }
    },
    [isActionLoading],
  );

  const handleUpdateNickName = useCallback(
    async (params: { nickName: string }) => {
      try {
        const { nickName } = params;
        if (isActionLoading) {
          return;
        }
        setIsActionLoading(true);
        await sdk.modules.user.uploadProfile({ name: nickName });
      } catch (error) {
        logger.tag('[handleUpdateNickName]').error('onSaveNickName error', error.message);
        showToast({ title: '昵称更新失败' });
      } finally {
        setIsActionLoading(false);
      }
    },
    [isActionLoading],
  );

  const handleLogout = useCallback(async () => {
    try {
      if (isActionLoading) {
        return;
      }
      setIsActionLoading(true);
      await unBootstrap();
    } catch {
      showToast({ title: '退出登录失败，请联系管理员' });
    } finally {
      setIsActionLoading(false);
    }
  }, [isActionLoading]);

  return {
    isActionLoading,
    handleWxLogin,
    handleAccountLogin,
    handleChooseAvatar,
    handleUpdateNickName,
    handleLogout,
  };
}
