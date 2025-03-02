import { useCallback, useMemo } from 'react';
import { PAGE_ID } from '@shared/utils/constants';
import { showToast } from '@shared/utils/operateFeedback';
import { navigateToPage } from '@shared/utils/router';
import {
  LUCK_DRAW_PREVIEW_ID,
  LUCKY_DRAW_TYPE,
  LuckyDrawUpdateParams,
  PRIZE_TYPE,
  sdk,
  STORE_NAME,
} from '@core';
import { useAction, useStoreById, useStoreList } from '../base';
import { useCouponList } from '../coupon';
import { usePrizeList } from '../prize';

export function useLuckyDrawAction() {
  const [createPreviewLuckyDraw] = useAction(
    async (params: Partial<LuckyDrawUpdateParams>) => {
      const { name, type, quantity, list } = params;
      if (!name) {
        showToast({
          title: '请输入祈愿池名称',
        });
        return false;
      }
      if (!type) {
        showToast({
          title: '请选择祈愿池类型',
        });
        return false;
      }
      if (!quantity) {
        showToast({
          title: '请输入祈愿券数量',
        });
        return false;
      }
      if (!list || !list.length) {
        showToast({
          title: '请选中祈愿池奖品',
        });
        return false;
      }
      if (list.some(item => !item.range)) {
        showToast({
          title: '奖品权重不能为 0',
        });
        return false;
      }
      await sdk.modules.luckyDraw.createMockLuckyDraw({
        name,
        type,
        quantity,
        list,
      });
    },
    {
      onSuccess: () => {
        navigateToPage({
          pageName: PAGE_ID.LUCKY_DRAW_DETAIL,
          params: {
            id: LUCK_DRAW_PREVIEW_ID,
          },
        });
      },
      onError: async error => {
        await showToast({
          title: error.message ?? '预览异常',
        });
      },
    },
  );

  const [clearPreviewLuckyDraw] = useAction(
    async () => {
      await sdk.modules.luckyDraw.clearMockLuckyDraw();
    },
    {
      onError: async error => {
        await showToast({
          title: error.message ?? '预览异常',
        });
      },
    },
  );

  return {
    createPreviewLuckyDraw,
    clearPreviewLuckyDraw,
  };
}
