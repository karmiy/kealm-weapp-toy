import isEqual from 'lodash/isEqual';
import { Singleton } from '@shared/utils/utils';
import { Models, sdk, STORE_NAME } from '@core';

type Listener = () => void;

export class AbstractGroupByController<T extends Models> extends Singleton {
  static identifier = 'AbstractGroupByController';

  private _idsListeners = new Map<string, Set<Listener>>();
  private _idsStore = new Map<string, Set<string>>();

  constructor(private _storeName: STORE_NAME, private _enable = true) {
    super();
  }

  init() {
    if (!this._enable) {
      return;
    }
    this._handleListChange();
    sdk.storeManager.subscribe(this._storeName, this._handleListChange);
  }

  dispose() {
    super.dispose();
    sdk.storeManager.subscribe(this._storeName, this._handleListChange);
    this._idsListeners.clear();
    this._idsStore.clear();
  }

  protected getGroupByIdentifier(model: T) {
    return model.id;
  }

  protected isMatchFunc(model: T) {
    return true;
  }

  private _handleListChange = () => {
    const storeManager = sdk.storeManager;
    const allIds = storeManager.getSortIds(this._storeName);
    const store = new Map<string, Set<string>>();
    allIds.forEach(id => {
      const model = storeManager.getById(this._storeName, id);
      if (!model || !this.isMatchFunc(model as T)) {
        return;
      }
      const groupByIdentifier = this.getGroupByIdentifier(model as T);
      const ids = store.get(groupByIdentifier) ?? new Set();
      ids.add(id);
      store.set(groupByIdentifier, ids);
    });
    const prevStore = this._idsStore;
    this._idsStore = store;

    [...store.entries()].forEach(([groupByIdentifier, ids]) => {
      const prevIds = prevStore.get(groupByIdentifier);
      if (prevIds && isEqual([...prevIds], [...ids])) {
        return;
      }
      this._notifyChange(groupByIdentifier);
    });
  };

  private _notifyChange(groupByIdentifier: string) {
    const listeners = this._idsListeners.get(groupByIdentifier);
    listeners?.forEach(listener => listener());
  }

  getIds(groupByIdentifier: string) {
    const ids = this._idsStore.get(groupByIdentifier);
    return ids ? Array.from(ids) : [];
  }

  onGroupListChange(groupByIdentifier: string, listener: Listener) {
    const listeners = this._idsListeners.get(groupByIdentifier) ?? new Set();
    listeners.add(listener);
    this._idsListeners.set(groupByIdentifier, listeners);
  }

  offGroupListChange(groupByIdentifier: string, listener: Listener) {
    const listeners = this._idsListeners.get(groupByIdentifier);
    listeners?.delete(listener);
    !listeners?.size && this._idsListeners.delete(groupByIdentifier);
  }
}
