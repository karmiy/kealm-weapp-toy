import isEqual from 'lodash/isEqual';
import { Singleton } from '@shared/utils/utils';
import { ModelsWithCategoryId, sdk, StoreNamesWithCategoryId } from '@core';

type Listener = () => void;

export class AbstractCategoryController<T extends ModelsWithCategoryId> extends Singleton {
  static identifier = 'AbstractCategoryController';

  private _idsListeners = new Map<string, Set<Listener>>();
  private _idsStore = new Map<string, Set<string>>();

  constructor(private _storeName: StoreNamesWithCategoryId) {
    super();
  }

  init() {
    this._handleIdListChange();
    sdk.storeManager.subscribeIdList(this._storeName, this._handleIdListChange);
  }

  dispose() {
    sdk.storeManager.unsubscribeIdList(this._storeName, this._handleIdListChange);
    this._idsListeners.clear();
    this._idsStore.clear();
  }

  protected getCategoryIdentifier(model: T) {
    return model.categoryId;
  }

  private _handleIdListChange = () => {
    const storeManager = sdk.storeManager;
    const allIds = storeManager.getSortIds(this._storeName);
    const store = new Map<string, Set<string>>();
    allIds.forEach(id => {
      const model = storeManager.getById(this._storeName, id);
      if (!model) {
        return;
      }
      const categoryIdentifier = this.getCategoryIdentifier(model as T);
      const ids = store.get(categoryIdentifier) ?? new Set();
      ids.add(id);
      store.set(categoryIdentifier, ids);
    });
    const prevStore = this._idsStore;
    this._idsStore = store;

    [...store.entries()].forEach(([categoryIdentifier, ids]) => {
      const prevIds = prevStore.get(categoryIdentifier);
      if (prevIds && isEqual(prevIds, ids)) {
        return;
      }
      this._notifyChange(categoryIdentifier);
    });
  };

  private _notifyChange(categoryIdentifier: string) {
    const listeners = this._idsListeners.get(categoryIdentifier);
    listeners?.forEach(listener => listener());
  }

  getIds(categoryIdentifier: string) {
    const ids = this._idsStore.get(categoryIdentifier);
    return ids ? Array.from(ids) : [];
  }

  onCategoryListChange(categoryIdentifier: string, listener: Listener) {
    const listeners = this._idsListeners.get(categoryIdentifier) ?? new Set();
    listeners.add(listener);
    this._idsListeners.set(categoryIdentifier, listeners);
  }

  offCategoryListChange(categoryIdentifier: string, listener: Listener) {
    const listeners = this._idsListeners.get(categoryIdentifier);
    listeners?.delete(listener);
    !listeners?.size && this._idsListeners.delete(categoryIdentifier);
  }
}
