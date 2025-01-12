import { useEffect } from 'react';
import { sdk, STORE_NAME } from '@core';
import { createStore } from './base';

const [useToyLimitedTimeOfferIdsStore] = createStore(
  'toyLimitedTimeOfferIds',
  {
    ids: [] as string[],
  },
  {
    update({ state, commit }, nextIds: string[]) {
      commit({
        ...state,
        ids: nextIds,
      });
    },
  },
);

const getLimitedTimeOfferIds = () => {
  return sdk.storeManager.getSortIds(STORE_NAME.TOY).filter(id => {
    const model = sdk.storeManager.getById(STORE_NAME.TOY, id);
    return model?.isLimitedTimeOffer;
  });
};

export function useToyLimitedTimeOffer() {
  const {
    state,
    actions: { update },
  } = useToyLimitedTimeOfferIdsStore({ ids: getLimitedTimeOfferIds() });

  useEffect(() => {
    const storeManger = sdk.storeManager;
    const handleIdsChange = () => {
      const ids = getLimitedTimeOfferIds();
      update(ids);
    };
    storeManger.subscribeIdList(STORE_NAME.TOY, handleIdsChange);
    return () => storeManger.unsubscribeIdList(STORE_NAME.TOY, handleIdsChange);
  }, [update]);
  return { ids: state.ids };
}
