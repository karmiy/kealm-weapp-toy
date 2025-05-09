import isEqual from 'lodash/isEqual';
import { Undefinable } from '@shared/types';
import { Logger } from '@shared/utils/logger';
import { toCamelCase } from '@shared/utils/utils';
import { config as storeConfig } from './config';
import { HANDLER_TYPE, STORE_NAME } from './constants';

interface Entity {
  id: string;
}

interface Model {
  id: string;
  dispose?: () => void;
}

type ModelConstruct = { new (entity: Entity): Model };

type InstanceEntity<
  C extends Record<STORE_NAME, { model: ModelConstruct }>,
  T extends STORE_NAME,
> = ConstructorParameters<C[T]['model']>[number];

type PartialEntity<E> = Partial<E> & { id: string };

class StoreManager<
  C extends Record<
    STORE_NAME,
    {
      type: HANDLER_TYPE;
      model: ModelConstruct;
      sortValue: (a: InstanceType<ModelConstruct>, b: InstanceType<ModelConstruct>) => number;
    }
  >,
> {
  private _singleStores = new Map<STORE_NAME, Model>();
  private _multiStores = new Map<STORE_NAME, Map<string, Model>>();
  private _sortIdsStores = new Map<STORE_NAME, string[]>();
  private _loadingStores = new Set<STORE_NAME>();
  private _subscriptions = new Map<STORE_NAME, Set<() => void>>();
  private _idListSubscriptions = new Map<STORE_NAME, Set<() => void>>();
  private _idSubscriptions = new Map<STORE_NAME, Map<string, Set<() => void>>>();
  private _loadingSubscriptions = new Map<STORE_NAME, Set<() => void>>();
  private _isLoaded = false;

  private get _logger() {
    return Logger.getLogger('[StoreManager]');
  }

  constructor(private _config: C) {}

  init() {
    this._logger.info('init');
    const config = this._config;
    const keys = Object.keys(config);
    keys.forEach(key => {
      const modelName = key as STORE_NAME;
      if (config[modelName].type === HANDLER_TYPE.SINGLE) {
        return;
      }
      this._multiStores.set(modelName, new Map());
    });
    this._isLoaded = true;
  }

  dispose() {
    this._logger.info('dispose');
    this._singleStores.clear();
    this._multiStores.clear();
    this._sortIdsStores.clear();
    this._loadingStores.clear();
    this._subscriptions.clear();
    this._idListSubscriptions.clear();
    this._idSubscriptions.clear();
    this._loadingSubscriptions.clear();
    this._isLoaded = false;
  }

  getHasLoaded() {
    return this._isLoaded;
  }

  refresh<T extends STORE_NAME>(
    storeName: T,
    payload: C[T]['type'] extends HANDLER_TYPE.MULTIPLE
      ? InstanceEntity<C, T>[]
      : InstanceEntity<C, T>,
  ) {
    const { model: ModelConstructor, type } = this._config[storeName] ?? {};
    if (!ModelConstructor) throw new Error(`[refresh]ModelConstructor for ${storeName} not found`);

    if (type === HANDLER_TYPE.MULTIPLE) {
      const prevIds = this.getSortIds(storeName);
      if (!Array.isArray(payload)) {
        throw new Error(`[refresh]Payload for ${storeName} must be an array for type MULTIPLE`);
      }
      const store = this._multiStores.get(storeName);
      if (!store) {
        throw new Error(`[refresh]Store for ${storeName} not found`);
      }
      [...store.values()].forEach(m => m.dispose?.());
      store.clear();
      payload.forEach(entity => {
        const model = new ModelConstructor(entity);
        store.set(model.id, model);

        this._notifyIdSubscribers(storeName, model.id);
      });

      this._reorderSortIds(storeName);
      const currentIds = this.getSortIds(storeName);
      this._notifySubscribers(storeName);
      !isEqual(currentIds, prevIds) && this._notifyIdListSubscribers(storeName);
    } else if (type === HANDLER_TYPE.SINGLE) {
      if (Array.isArray(payload)) {
        throw new Error(`[refresh]Payload for ${storeName} must not be an array for type SINGLE`);
      }
      const prevModel = this._singleStores.get(storeName);
      prevModel?.dispose?.();
      const model = new ModelConstructor(payload);
      this._singleStores.set(storeName, model);

      this._reorderSortIds(storeName);
      this._notifyIdSubscribers(storeName, model.id);
      this._notifySubscribers(storeName);
      prevModel?.id !== model.id && this._notifyIdListSubscribers(storeName);
    }
  }

  get<T extends STORE_NAME>(
    storeName: T,
  ): C[T]['type'] extends HANDLER_TYPE.MULTIPLE
    ? Map<string, InstanceType<C[T]['model']>>
    : Undefinable<InstanceType<C[T]['model']>> {
    const config = this._config[storeName];
    if (!config) throw new Error(`[get]Configuration for ${storeName} not found`);

    if (config.type === HANDLER_TYPE.MULTIPLE) {
      const store = this._multiStores.get(storeName);
      return store as C[T]['type'] extends HANDLER_TYPE.MULTIPLE
        ? Map<string, InstanceType<C[T]['model']>>
        : never;
    } else if (config.type === HANDLER_TYPE.SINGLE) {
      const store = this._singleStores.get(storeName);
      return store as C[T]['type'] extends HANDLER_TYPE.SINGLE
        ? Undefinable<InstanceType<C[T]['model']>>
        : never as any;
    }
    throw new Error(`[get]Unknown type for ${storeName}`);
  }

  getById<T extends STORE_NAME>(
    storeName: T,
    id: string,
  ): Undefinable<InstanceType<C[T]['model']>> {
    const config = this._config[storeName];
    if (!config) {
      throw new Error(`[getById]Configuration for ${storeName} not found`);
    }

    if (config.type === HANDLER_TYPE.MULTIPLE) {
      const store = this._multiStores.get(storeName);
      if (!store) {
        throw new Error(`[getById]Store for ${storeName} not found`);
      }
      return store.get(id) as Undefinable<InstanceType<C[T]['model']>>;
    } else if (config.type === HANDLER_TYPE.SINGLE) {
      const model = this._singleStores.get(storeName);
      if (!model) {
        throw new Error(`[getById]Model for ${storeName} not found`);
      }
      return model as Undefinable<InstanceType<C[T]['model']>>;
    }

    throw new Error(`[getById]Unknown type for ${storeName}`);
  }

  getIds<T extends STORE_NAME>(storeName: T) {
    const config = this._config[storeName];
    if (!config) {
      // throw new Error(`[getIds]Configuration for ${storeName} not found`);
      return [];
    }

    if (config.type === HANDLER_TYPE.MULTIPLE) {
      const store = this._multiStores.get(storeName);
      return store ? Array.from(store.keys()) : [];
    } else if (config.type === HANDLER_TYPE.SINGLE) {
      const store = this._singleStores.get(storeName);
      return store ? [store.id] : [];
    }

    // throw new Error(`[getIds]Unknown type for ${storeName}`);
    return [];
  }

  getSortIds<T extends STORE_NAME>(storeName: T) {
    return Array.from(this._sortIdsStores.get(storeName) ?? []);
  }

  getSortList<T extends STORE_NAME>(storeName: T) {
    const sortIds = storeManager.getSortIds(storeName);
    return sortIds.map(id => storeManager.getById(storeName, id)!);
  }

  subscribe(storeName: STORE_NAME, callback: () => void) {
    const subscribes = this._subscriptions.get(storeName) ?? new Set();
    subscribes.add(callback);
    this._subscriptions.set(storeName, subscribes);
  }

  unsubscribe(storeName: STORE_NAME, callback: () => void) {
    const storeSubscriptions = this._subscriptions.get(storeName);
    if (storeSubscriptions) {
      storeSubscriptions.delete(callback);
    }
  }

  subscribeIdList(storeName: STORE_NAME, callback: () => void) {
    const subscribes = this._idListSubscriptions.get(storeName) ?? new Set();
    subscribes.add(callback);
    this._idListSubscriptions.set(storeName, subscribes);
  }

  unsubscribeIdList(storeName: STORE_NAME, callback: () => void) {
    const storeSubscriptions = this._idListSubscriptions.get(storeName);
    if (storeSubscriptions) {
      storeSubscriptions.delete(callback);
    }
  }

  subscribeById(storeName: STORE_NAME, id: string, callback: () => void) {
    if (!this._idSubscriptions.has(storeName)) {
      this._idSubscriptions.set(storeName, new Map());
    }
    const idSubscriptions = this._idSubscriptions.get(storeName)!;
    if (!idSubscriptions.has(id)) {
      idSubscriptions.set(id, new Set());
    }
    idSubscriptions.get(id)!.add(callback);
  }

  unsubscribeById(storeName: STORE_NAME, id: string, callback: () => void) {
    const idSubscriptions = this._idSubscriptions.get(storeName);
    if (idSubscriptions) {
      const callbacks = idSubscriptions.get(id);
      if (callbacks) {
        callbacks.delete(callback);
      }
    }
  }

  private _reorderSortIds(storeName: STORE_NAME) {
    const config = this._config[storeName];
    if (!config) {
      throw new Error(`[_reorderSortIds]Configuration for ${storeName} not found`);
    }

    const { sortValue } = config;
    const ids = [...this.getIds(storeName)];
    ids.sort((a, b) => {
      const aModel = this.getById(storeName, a);
      const bModel = this.getById(storeName, b);
      if (!aModel || !bModel) {
        throw new Error(
          `[_reorderSortIds]sort id list failed for ${storeName}: hasAModel: ${!!aModel}, hasBModel: ${!!bModel}`,
        );
      }
      return sortValue(aModel, bModel);
    });
    this._sortIdsStores.set(storeName, ids);
  }

  // 触发优先级：_notifyIdSubscribers > _notifySubscribers > _notifyIdListSubscribers
  private _notifySubscribers(storeName: STORE_NAME) {
    const storeSubscriptions = this._subscriptions.get(storeName);
    if (storeSubscriptions) {
      storeSubscriptions.forEach(callback => {
        callback();
      });
    }
  }

  private _notifyIdListSubscribers(storeName: STORE_NAME) {
    const config = this._config[storeName];
    if (!config) {
      throw new Error(`[_notifyIdListSubscribers]Configuration for ${storeName} not found`);
    }

    const { sortValue } = config;
    const ids = [...this.getIds(storeName)];
    ids.sort((a, b) => {
      const aModel = this.getById(storeName, a);
      const bModel = this.getById(storeName, b);
      if (!aModel || !bModel) {
        throw new Error(
          `[_notifyIdListSubscribers]sort id list failed for ${storeName}: hasAModel: ${!!aModel}, hasBModel: ${!!bModel}`,
        );
      }
      return sortValue(aModel, bModel);
    });
    this._sortIdsStores.set(storeName, ids);

    const storeSubscriptions = this._idListSubscriptions.get(storeName);
    if (storeSubscriptions) {
      storeSubscriptions.forEach(callback => {
        callback();
      });
    }
  }

  private _notifyIdSubscribers(storeName: STORE_NAME, id: string) {
    const idSubscriptions = this._idSubscriptions.get(storeName);
    if (idSubscriptions) {
      const callbacks = idSubscriptions.get(id);
      if (callbacks) {
        callbacks.forEach(callback => {
          callback();
        });
      }
    }
  }

  private _mixinModel<T extends Model, E extends Entity>(model: T, partial: E) {
    let hasChange = false;
    for (const key in partial) {
      const modelKey = toCamelCase(key);
      if (modelKey in model) {
        const currentValue = model[modelKey];
        const updateValue = partial[key];
        if (isEqual(currentValue, updateValue)) {
          continue;
        }
        hasChange = true;
        model[modelKey] = partial[key];
      }
    }
    return { model, hasChange };
  }

  emitUpdate<T extends STORE_NAME>(
    storeName: T,
    payload: {
      entities?: InstanceEntity<C, T>[];
      partials?: PartialEntity<InstanceEntity<C, T>>[];
    },
  ) {
    const { model: ModelConstructor, type } = this._config[storeName] ?? {};
    if (!ModelConstructor) {
      throw new Error(`[emitUpdate]ModelConstructor for ${storeName} not found`);
    }
    const prevIds = this.getSortIds(storeName);
    const { entities, partials } = payload;

    if (entities) {
      if (type === HANDLER_TYPE.MULTIPLE) {
        const store = this._multiStores.get(storeName);
        if (!store) throw new Error(`[emitUpdate]Store for ${storeName} not found`);

        entities.forEach(entity => {
          const prevModel = store.get(entity.id);
          prevModel?.dispose?.();
          const model = new ModelConstructor(entity);
          store.set(model.id, model);
          this._notifyIdSubscribers(storeName, model.id);
        });
      } else if (type === HANDLER_TYPE.SINGLE) {
        const prevModel = this._singleStores.get(storeName);
        prevModel?.dispose?.();
        const model = new ModelConstructor(entities[0]);
        this._singleStores.set(storeName, model);
        this._notifyIdSubscribers(storeName, model.id);
      }
    }

    if (partials) {
      if (type === HANDLER_TYPE.MULTIPLE) {
        const store = this._multiStores.get(storeName);
        if (!store) throw new Error(`[emitUpdate]Store for ${storeName} not found`);

        partials.forEach(partial => {
          const model = store.get(partial.id as string);
          if (model) {
            const { hasChange } = this._mixinModel(model, partial);
            store.set(model.id, model);
            hasChange && this._notifyIdSubscribers(storeName, model.id);
          }
        });
      } else if (type === HANDLER_TYPE.SINGLE) {
        const model = this._singleStores.get(storeName);
        if (model) {
          const { hasChange } = this._mixinModel(model, partials[0]);
          this._singleStores.set(storeName, model);
          hasChange && this._notifyIdSubscribers(storeName, model.id);
        }
      }
    }

    this._reorderSortIds(storeName);
    const currentIds = this.getSortIds(storeName);
    this._notifySubscribers(storeName);
    !isEqual(currentIds, prevIds) && this._notifyIdListSubscribers(storeName);
  }

  emitDelete<T extends STORE_NAME>(
    storeName: T,
    ids?: T extends keyof C
      ? C[T]['type'] extends HANDLER_TYPE.MULTIPLE
        ? string[]
        : never
      : never,
  ): void {
    const { model: ModelConstructor, type } = this._config[storeName] ?? {};
    if (!ModelConstructor) {
      throw new Error(`[emitDelete]ModelConstructor for ${storeName} not found`);
    }

    if (type === HANDLER_TYPE.MULTIPLE) {
      if (!ids || ids.length === 0) {
        return;
      }

      const store = this._multiStores.get(storeName);
      if (!store) {
        throw new Error(`[emitDelete]Store for ${storeName} not found`);
      }

      ids.forEach(id => {
        const model = store.get(id);
        model?.dispose?.();
        store.delete(id);
      });
    } else if (type === HANDLER_TYPE.SINGLE) {
      const model = this._singleStores.get(storeName);
      model?.dispose?.();
      this._singleStores.delete(storeName);
    } else {
      throw new Error(`[emitDelete]Unknown type for ${storeName}`);
    }
    this._reorderSortIds(storeName);
    this._notifySubscribers(storeName);
    this._notifyIdListSubscribers(storeName);
  }

  startLoading<T extends STORE_NAME>(storeName: T) {
    this._loadingStores.add(storeName);
    this._notifyIdLoadingSubscribers(storeName);
  }

  stopLoading<T extends STORE_NAME>(storeName: T) {
    this._loadingStores.delete(storeName);
    this._notifyIdLoadingSubscribers(storeName);
  }

  private _notifyIdLoadingSubscribers(storeName: STORE_NAME) {
    const subscribes = this._loadingSubscriptions.get(storeName);
    if (subscribes) {
      subscribes.forEach(callback => {
        callback();
      });
    }
  }

  getLoadingStatus<T extends STORE_NAME>(storeName: T) {
    return this._loadingStores.has(storeName);
  }

  subscribeLoading(storeName: STORE_NAME, callback: () => void) {
    const subscribes = this._loadingSubscriptions.get(storeName) ?? new Set();
    subscribes.add(callback);
    this._loadingSubscriptions.set(storeName, subscribes);
  }

  unsubscribeLoading(storeName: STORE_NAME, callback: () => void) {
    const storeSubscriptions = this._loadingSubscriptions.get(storeName);
    if (storeSubscriptions) {
      storeSubscriptions.delete(callback);
    }
  }
}

const storeManager = new StoreManager(storeConfig);

// const productStore = storeManager.get(STORE_NAME.PRODUCT);
// const userStore = storeManager.get(STORE_NAME.USER);
// const productIds = storeManager.getIds(STORE_NAME.PRODUCT);
// const userIds = storeManager.getIds(STORE_NAME.USER);
// storeManager.refresh(STORE_NAME.USER, { id: '', name: '' });
// storeManager.refresh(STORE_NAME.PRODUCT, [{ id: '', name: '', desc: '' }]);
// storeManager.emitUpdate(STORE_NAME.PRODUCT, {
//   entities: [{ id: '1', name: '', desc: '' }],
//   partials: [{ id: '2', name: 'k' }],
// });
// storeManager.emitDelete(STORE_NAME.USER);
// storeManager.emitDelete(STORE_NAME.PRODUCT, ['1']);
// const t = storeManager.getById(STORE_NAME.PRODUCT, '1');
// const u = storeManager.getById(STORE_NAME.USER, '1');

export { storeManager };
