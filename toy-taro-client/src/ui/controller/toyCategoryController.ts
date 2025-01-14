import isEqual from 'lodash/isEqual';
import { Singleton } from '@shared/utils/utils';
import { sdk, STORE_NAME } from '@core';

type Listener = () => void;

export class ToyCategoryController extends Singleton {
  static identifier = 'ToyCategoryController';

  private _toyIdsListeners = new Map<string, Set<Listener>>();
  private _toyIdsStore = new Map<string, Set<string>>();

  init() {
    this._handleToyListChange();
    sdk.storeManager.subscribeIdList(STORE_NAME.TOY, this._handleToyListChange);
  }

  dispose() {
    sdk.storeManager.unsubscribeIdList(STORE_NAME.TOY, this._handleToyListChange);
    this._toyIdsListeners.clear();
    this._toyIdsStore.clear();
  }

  private _handleToyListChange = () => {
    const storeManager = sdk.storeManager;
    const allToyIds = storeManager.getSortIds(STORE_NAME.TOY);
    const store = new Map<string, Set<string>>();
    allToyIds.forEach(id => {
      const toyModel = storeManager.getById(STORE_NAME.TOY, id);
      if (!toyModel) {
        return;
      }
      const { categoryId } = toyModel;
      const toyIds = store.get(categoryId) ?? new Set();
      toyIds.add(id);
      store.set(categoryId, toyIds);
    });
    const prevStore = this._toyIdsStore;
    this._toyIdsStore = store;

    [...store.entries()].forEach(([categoryId, ids]) => {
      const prevIds = prevStore.get(categoryId);
      if (prevIds && isEqual(prevIds, ids)) {
        return;
      }
      this._notifyChange(categoryId);
    });
  };

  private _notifyChange = (categoryId: string) => {
    const listeners = this._toyIdsListeners.get(categoryId);
    listeners?.forEach(listener => listener());
  };

  getToyIds(categoryId: string) {
    const toyIds = this._toyIdsStore.get(categoryId);
    return toyIds ? Array.from(toyIds) : [];
  }

  onToyListChange(categoryId: string, listener: Listener) {
    const listeners = this._toyIdsListeners.get(categoryId) ?? new Set();
    listeners.add(listener);
    this._toyIdsListeners.set(categoryId, listeners);
  }

  offToyListChange(categoryId: string, listener: Listener) {
    const listeners = this._toyIdsListeners.get(categoryId);
    listeners?.delete(listener);
    !listeners?.size && this._toyIdsListeners.delete(categoryId);
  }
}
